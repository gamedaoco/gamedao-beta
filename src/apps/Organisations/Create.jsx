import { Image } from '@mui/icons-material'
import { useApiProvider } from '@substra-hooks/core'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from 'src/context/Wallet'
import { formatZero, toZeroAddress } from 'src/utils/helper'
import { useFormik } from 'formik'
import {
	Box,
	Button,
	Container,
	FileDropZone,
	FormControl,
	FormHelperText,
	FormSectionHeadline,
	Grid,
	Image16to9,
	InputLabel,
	Loader,
	MenuItem,
	Paper,
	Select,
	Step,
	StepLabel,
	Stepper,
	TextField,
	Typography,
} from '../../components'
import config from '../../config'
import { data, rnd } from '../lib/data'
import { gateway, pinFileToIPFS, pinJSONToIPFS } from '../lib/ipfs'
import { useTheme } from '@mui/material/styles'

import { useDebouncedEffect } from 'src/hooks/useDebouncedEffect'

const dev = config.dev
if (dev) console.log('dev mode')

const random_state = (account) => {
	const name = ''
	const email = ''
	const website = ''
	const repo = ''
	const description = ''

	const creator = toZeroAddress(account.address)
	const controller = toZeroAddress(account.address)
	const treasury = toZeroAddress(account.address)

	const body = 0
	const access = 0
	const member_limit = '1'
	const fee_model = 0
	const fee = '1'

	const cid = ''
	const gov_asset = 0
	const pay_asset = 0

	// collect curve settings
	// tbd storage

	const token_buy_fn = 1 // 1:1 price over t, vol
	const token_sell_fn = 1 // 1:1 price over t, vol
	const reward_fn = 1 // reward token to token volume per cycle
	const reward_cycle = 1 //

	const entity = data.project_entities[rnd(data.project_entities.length)].value
	const country = data.countries[rnd(data.countries.length)].value

	return {
		name,
		body,
		creator,
		controller,
		treasury,
		access,
		member_limit,
		fee_model,
		fee,
		cid,
		gov_asset,
		pay_asset,
		email,
		website,
		repo,
		description,
		country,
		entity,
	}
}

export const Main = (props) => {
	const apiProvider = useApiProvider()
	const [stepperState, setStepperState] = useState(0)
	const { account, address, signAndNotify } = useWallet()
	const [loading, setLoading] = useState(false)
	const [initialData, setInitialData] = useState()
	const [persistedData, setPersistedData] = useState()
	const [refresh, setRefresh] = useState(true)
	const [logoCID, updateLogoCID] = useState({})
	const [headerCID, updateHeaderCID] = useState({})
	const [content, setContent] = useState()
	const navigate = useNavigate()

	const theme = useTheme()
	const bgPlain = { backgroundColor: theme.palette.grey[500_16] }

	useEffect(() => {
		const ls = localStorage.getItem('gamedao-form-create-org')
		if (ls) {
			setPersistedData(JSON.parse(ls))
		}
		setInitialData(random_state(account))
	}, [account])

	// handle file uploads to ipfs
	const onFileChange = (files, event) => {
		const name = event.target.getAttribute('name')

		if (!files?.[0]) return
		if (dev) console.log('upload image')

		pinFileToIPFS(files[0])
			.then((cid) => {
				if (name === 'logo') {
					updateLogoCID({ logo: cid })
				}

				if (name === 'header') {
					updateHeaderCID({ header: cid })
				}

				if (dev) console.log('file cid', `${gateway}${cid}`)
			})
			.catch((error) => {
				console.log('Error uploading file: ', error)
			})
	}

	//
	// submit function
	//

	const handleSubmit = async (values, form) => {
		console.log('submit')
		setLoading(true)

		const getCID = async () => {
			if (dev) console.log('1. upload content json')
			try {
				// TODO: pin...
				const cid = await pinJSONToIPFS(content)
				if (cid) {
					// setContentCID(cid)
					if (dev) console.log('json cid', `${gateway}${cid}`)
					sendTX(cid)
				}
			} catch (err) {
				console.log('Error uploading file: ', err)
			}
		}

		const sendTX = async (cid) => {
			setLoading(true)
			if (dev) console.log('2. send tx')

			const payload = [
				address,
				formik.values.treasury,
				formik.values.name,
				cid,
				formik.values.body,
				formik.values.access,
				formik.values.fee_model,
				formatZero(formik.values.fee),
				0,
				0,
				formik.values.member_limit,
			]

			signAndNotify(
				apiProvider.tx.gameDaoControl.create(...payload),
				{
					pending: 'Summoning your DAO...',
					success: 'The beast is unleashed!',
					error: 'Summoning failed, check your Mana.',
				},
				(state, result) => {
					if (state) {
						setStepperState(2)
						result.events.forEach(({ event: { data, method, section } }) => {
							if (section === 'gameDaoControl' && method === 'BodyCreated') {
								navigate(`/app/organisations/${data[1].toHex()}`)
							}
						})

						// clear localstorage
						localStorage.removeItem('gamedao-form-create-org')
					}
				},
			)
		}

		getCID()
	}

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: persistedData ? persistedData : initialData,
		touched: (values) => {
			const touched = {}

			return touched
		},
		validate: (values) => {
			setStepperState(1)
			const errors = {}
			console.log(values)

			if (new Blob([values.name]).size > 48) errors.name = 'Please enter a maximum of 48 bytes.'
			if (!values.name || values.name === '') errors.name = 'You must choose a Name'

			if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
				errors.email = 'Please enter a valid e-mail address.'
			}

			if (values.website !== '' && !/^(ftp|http|https):\/\/[^ "]+$/i.test(values.website)) {
				errors.website = 'Please enter a valid URL.'
			}

			if (!values.member_limit || values.member_limit === '') errors.member_limit = 'Please enter the maximum number of members.'
			if (values.member_limit && isNaN(parseInt(values.member_limit))) errors.member_limit = 'Needs to be a number.'

			if (!values.fee || values.fee === '') errors.fee = 'Please enter the membership fee.'
			if (values.fee && !/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/i.test(values.fee)) errors.fee = 'Needs to be a number.'

			if (!values.description || values.description === '') errors.description = 'We need a short description'

			if (!toZeroAddress(values.controller)) errors.controller = 'Not a valid Account Address!'
			if (!toZeroAddress(values.treasury)) errors.treasury = 'Not a valid Account Address!'

			if (values.treasury === values.controller) errors.treasury = 'Treasury Account needs to differ from Controller Account!'

			return errors
		},
		//validationSchema: validationSchema,
		onSubmit: handleSubmit,
	})

	// update json payload from form data
	useDebouncedEffect(
		() => {
			if (!formik.values) return
			if (dev) console.log('update content json')
			const contentJSON = {
				name: formik.values.name,
				description: formik.values.description,
				website: formik.values.website,
				email: formik.values.email,
				repo: formik.values.repo,
				...logoCID,
				...headerCID,
			}
			setContent(contentJSON)
			localStorage.setItem('gamedao-form-create-org', JSON.stringify(formik.values))
		},
		[logoCID, headerCID, formik.values],
		2000,
	)

	useEffect(() => {
		if (!refresh) return
		if (dev) console.log('refresh signal')
		setRefresh(false)
		setLoading(false)
	}, [account, refresh])

	if (!formik.values) return <Loader text='Create Organization' />

	return (
		<form onSubmit={formik.handleSubmit}>
			<Box sx={{ pb: 2 }}>
				<Grid container spacing={3} alignItems={'center'}>
					<Grid item xs={12} md={8}>
						<Typography variant={'h3'}>
							{formik.values.name || 'Untitled organization'}
						</Typography>
					</Grid>
					<Grid item xs={12} md={4}>
						<Stepper activeStep={stepperState} orientation={'horizontal'}>
							<Step>
								<StepLabel>Enter data</StepLabel>
							</Step>
							<Step>
								<StepLabel>Validate</StepLabel>
							</Step>
							<Step>
								<StepLabel>Profit</StepLabel>
							</Step>
						</Stepper>
					</Grid>
				</Grid>
			</Box>
			<Paper sx={{ p: 4, ...bgPlain }}>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<FormSectionHeadline variant={'h5'}>
							General Information
						</FormSectionHeadline>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							label='Name'
							fullWidth
							placeholder='Name'
							name='name'
							value={formik.values.name}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={formik.touched.name && Boolean(formik.errors.name)}
							helperText={formik.touched.name && formik.errors.name}
							required
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							label='Contact Email'
							fullWidth
							placeholder='email'
							name='email'
							value={formik.values.email}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={formik.touched.email && Boolean(formik.errors.email)}
							helperText={formik.touched.email && formik.errors.email}
							required
						/>
					</Grid>
					<Grid item xs={12}>
						<FormControl fullWidth
									 error={formik.touched.body && Boolean(formik.errors.body)}>
							<InputLabel id='body-select-label'>Organizational Body</InputLabel>
							<Select
								label='Organizational Body'
								name='body'
								placeholder='Organizational Body'
								labelId='body-select-label'
								id='body'
								value={formik.values.body}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
							>
								{data.dao_bodies.map((item) => (
									<MenuItem key={item.key} value={item.value}>
										{item.text}
									</MenuItem>
								))}
							</Select>
							<FormHelperText>{formik.touched.body && formik.errors.body}</FormHelperText>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<FormControl fullWidth
									 error={formik.touched.country && Boolean(formik.errors.country)}>
							<InputLabel id='country-select-label'>Country</InputLabel>
							<Select
								label='Country'
								name='country'
								placeholder='Country'
								labelId='country-select-label'
								id='country'
								value={formik.values.country}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
							>
								{data.countries.map((item) => (
									<MenuItem key={item.key} value={item.value}>
										{item.text}
									</MenuItem>
								))}
							</Select>
							<FormHelperText>{formik.touched.country && formik.errors.country}</FormHelperText>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<FormSectionHeadline variant={'h5'}>Images</FormSectionHeadline>
					</Grid>
					<Grid item xs={12}>
						<FormSectionHeadline variant={'h6'}>Logo (800 x 800px)</FormSectionHeadline>
						<FileDropZone name='logo' onDroppedFiles={onFileChange}
									  onDeleteItem={() => updateLogoCID({})}>
							{!logoCID.logo && <Image />}
							{logoCID.logo && (
								<Image16to9
									sx={{ maxHeight: '200px' }}
									alt={formik.values.title}
									src={gateway + logoCID.logo}
								/>
							)}
							<Typography variant={'body2'}
										align={'center'}>{!logoCID.logo && 'Logo Image. Drop here, or select a file.'}</Typography>
							<Typography variant={'body2'}
										align={'center'}>{!logoCID.logo && 'It must be a JPG, GIF or PNG, no larger than 200 MB.'}</Typography>
						</FileDropZone>
					</Grid>
					<Grid item xs={12}>
						<FormSectionHeadline variant={'h6'}>Header (1920 x
							800px)</FormSectionHeadline>
						<FileDropZone name='header' onDroppedFiles={onFileChange}
									  onDeleteItem={() => updateHeaderCID({})}>
							{!headerCID.header && <Image />}
							{headerCID.header && (
								<Image16to9
									sx={{ maxHeight: '200px' }}
									alt={formik.values.title}
									src={gateway + headerCID.header}
								/>
							)}
							<Typography variant={'body2'}
										align={'center'}>{!headerCID.header && 'Header Image. Drop here, or select a file.'}</Typography>
							<Typography variant={'body2'}
										align={'center'}>{!headerCID.header && 'It must be a JPG or PNG, 1920 x 800px no larger than 200 MB.'}</Typography>
						</FileDropZone>
					</Grid>

					<Grid item xs={12}>
						<FormSectionHeadline>Meta Information</FormSectionHeadline>
					</Grid>
					<Grid item xs={12}>
						<TextField
							multiline
							aria-label='Short Description'
							minRows={3}
							placeholder='Minimum 3 rows'
							fullWidth
							label='Short Description'
							name='description'
							value={formik.values.description}
							placeholder='Tell us more'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={formik.touched.description && Boolean(formik.errors.description)}
							helperText={formik.touched.description && formik.errors.description}
							required
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							label='Website'
							placeholder='https://your.website.xyz'
							isInjected='website'
							fullWidth
							name='website'
							value={formik.values.website}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={formik.touched.website && Boolean(formik.errors.website)}
							helperText={formik.touched.website && formik.errors.website}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							label='Code Repository'
							placeholder='repo'
							id='repo'
							fullWidth
							name='repo'
							value={formik.values.repo}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={formik.touched.repo && Boolean(formik.errors.repo)}
							helperText={formik.touched.repo && formik.errors.repo}
						/>
					</Grid>
					<Grid item xs={12}>
						<FormSectionHeadline>Controller Settings</FormSectionHeadline>
					</Grid>
					<Grid item xs={12}>
						<TextField
							id='controller'
							fullWidth
							name='controller'
							placeholder='Controller'
							label='Controller Account'
							value={formik.values.controller}
							helperText={
								'Note: In case you want to create a DAO, the controller must be the organization.'
							}
							onChange={formik.handleChange}
							required
							onBlur={formik.handleBlur}
							error={formik.touched.controller && Boolean(formik.errors.controller)}
							helperText={formik.touched.controller && formik.errors.controller}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							id='treasury'
							name='treasury'
							placeholder='Treasury'
							fullWidth
							label='Treasury Account'
							value={formik.values.treasury}
							onChange={formik.handleChange}
							required
							onBlur={formik.handleBlur}
							error={formik.touched.treasury && Boolean(formik.errors.treasury)}
							helperText={formik.touched.treasury && formik.errors.treasury}
						/>
						<Typography variant='caption'>Note: The treasury account may not be the same
							as the controller account.</Typography>
					</Grid>
					<Grid item xs={12}>
						<FormControl fullWidth
									 error={formik.touched.access && Boolean(formik.errors.access)}>
							<InputLabel id='member-select-label'>Member Access Control</InputLabel>
							<Select
								labelId='member-select-label'
								id='member-select'
								label='Member Access Control'
								name='access'
								value={formik.values.access}
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								required
							>
								{data.dao_member_governance.map((item) => (
									<MenuItem key={item.key} value={item.value}>
										{item.text}
									</MenuItem>
								))}
							</Select>

							<FormHelperText>{formik.touched.access && formik.errors.access}</FormHelperText>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={4}>
						<TextField
							id='member_limit'
							name='member_limit'
							placeholder='100'
							label='Member Limit'
							value={formik.values.member_limit}
							onChange={formik.handleChange}
							fullWidth
							required
							onBlur={formik.handleBlur}
							error={formik.touched.member_limit && Boolean(formik.errors.member_limit)}
							helperText={formik.touched.member_limit && formik.errors.member_limit}
						/>
					</Grid>
					<Grid item xs={12} md={4}>
						<FormControl fullWidth
									 error={formik.touched.fee_model && Boolean(formik.errors.fee_model)}>
							<InputLabel id='fee_model-label'>Fee Model</InputLabel>
							<Select
								labelId='fee_model-label'
								id='fee_model'
								label='Fee Model'
								name='fee_model'
								value={formik.values.fee_model}
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								required
							>
								{data.dao_fee_model.map((item) => (
									<MenuItem key={item.key} value={item.value}>
										{item.text}
									</MenuItem>
								))}
							</Select>

							<FormHelperText>{formik.touched.fee_model && formik.touched.fee_model}</FormHelperText>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={4}>
						<TextField
							id='fee'
							name='fee'
							label='Membership Fee'
							placeholder='10'
							fullWidth
							value={formik.values.fee}
							onChange={formik.handleChange}
							required
							onBlur={formik.handleBlur}
							error={formik.touched.fee && Boolean(formik.errors.fee)}
							helperText={formik.touched.fee && formik.errors.fee}
						/>
					</Grid>
				</Grid>
			</Paper>
			<Container maxWidth={'xs'} sx={{ p: 4 }}>
				{account && (
					<Button type='submit' fullWidth variant={'contained'}>
						Create Organization
					</Button>
				)}
				<Typography sx={{ color: 'red' }}>
					{Object.keys(formik.errors).length !== 0 ? 'errors present' : ''}
				</Typography>
			</Container>
		</form>
	)
}

export default function Module(props) {
	const { account } = useWallet()
	const apiProvider = useApiProvider()
	return apiProvider && apiProvider.query.gameDaoControl && account ? <Main {...props} /> : null
}
