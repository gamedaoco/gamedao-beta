import { Image } from '@mui/icons-material'
import { useApiProvider } from '@substra-hooks/core'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import {
	Box,
	Button,
	Checkbox,
	Container,
	FileDropZone,
	FormControl,
	FormControlLabel,
	FormSectionHeadline,
	FormHelperText,
	Grid,
	Image16to9,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Step,
	StepLabel,
	Stepper,
	TextField,
	Typography,
	Loader
} from '../../components'
import config from '../../config'
import { data, rnd } from '../lib/data'
import { gateway, pinFileToIPFS, pinJSONToIPFS } from '../lib/ipfs'

import { useWallet } from 'src/context/Wallet'
import { useDebouncedEffect } from 'src/hooks/useDebouncedEffect';

const dev = config.dev
if (dev) console.log('dev mode')

const random_state = (account) => {
	const name = ''
	const email = ''
	const website = ''
	const repo = ''
	const description = ''

	const creator = account.address
	const controller = account.address
	const treasury = account.address

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

	useEffect(() => {
		const ls =  localStorage.getItem("gamedao-form-create-org")
		if(ls){
			setPersistedData(JSON.parse(ls))
		}
		setInitialData(random_state(account))
	}, [account])


	// handle file uploads to ipfs
	const onFileChange = (files, event) => {
		const name = event.target.getAttribute("name")

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
				formik.values.fee,
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
					setLoading(false)
					setRefresh(true)
					if (state) {
						setStepperState(2)
						result.events.forEach(({ event: { data, method, section } }) => {
							if (section === 'gameDaoControl' && method === 'BodyCreated') {
								navigate(`/app/organisations/${data[1].toHex()}`)
							}
						})
					}
				}
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

			if(!values.name || values.name === "") errors.name = "You must choose a Name"

			if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
				errors.email = "Not a vaild email I'm afraid..."
			}

			if(!values.description || values.description === "") errors.description = "We need a short description"
			
			if(values.treasury === values.controller) errors.treasury = "Treasury Account needs to differ from Controller Account!"
			return errors
		},
		//validationSchema: validationSchema,
		onSubmit: handleSubmit
	});

	// update json payload from form data
	useDebouncedEffect(() => {
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
		localStorage.setItem("gamedao-form-create-org", JSON.stringify(formik.values))
	}, [logoCID, headerCID, formik.values], 2000)

	useEffect(() => {
		if (!refresh) return
		if (dev) console.log('refresh signal')
		setRefresh(false)
		setLoading(false)
	}, [account, refresh])

	if (!formik.values) return <Loader text="Create Organization" />

	return (
		<form onSubmit={formik.handleSubmit}>
			<Box sx={{ pb: 2 }}>
				<Grid container spacing={3} alignItems={'center'}>
					<Grid item xs={12} md={8}>
						<Typography variant={'body1'}>Create Organization</Typography>
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
			<Paper sx={{ p: 4 }}>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<FormSectionHeadline variant={'h5'}>
							General Information
						</FormSectionHeadline>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							label="Name"
							fullWidth
							placeholder="Name"
							name="name"
							value={formik.values.name}
							onChange={formik.handleChange}
							error={Boolean(formik.errors.name)}
							helperText={formik.errors.name || formik.touched.name}
							required
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							label="Contact Email"
							fullWidth
							placeholder="email"
							name="email"
							value={formik.values.email}
							onChange={formik.handleChange}
							error={Boolean(formik.errors.email)}
							helperText={formik.errors.email || formik.touched.email}
						/>
					</Grid>
					<Grid item xs={12}>
						<FormControl fullWidth error={Boolean(formik.errors.body)}>
							<InputLabel id="body-select-label">Organizational Body</InputLabel>
							<Select
								label="Organizational Body"
								name="body"
								placeholder="Organizational Body"
								labelId="body-select-label"
								id="body"
								value={formik.values.body}
								onChange={formik.handleChange}
								required
							>
								{data.dao_bodies.map((item) => (
									<MenuItem key={item.key} value={item.value}>
										{item.text}
									</MenuItem>
								))}
							</Select>
							<FormHelperText>{formik.errors.body || formik.touched.body}</FormHelperText>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<FormControl fullWidth error={Boolean(formik.errors.country)}>
							<InputLabel id="country-select-label">Country</InputLabel>
							<Select
								label="Country"
								name="country"
								placeholder="Country"
								labelId="country-select-label"
								id="country"
								value={formik.values.country}
								onChange={formik.handleChange}
								required
							>
								{data.countries.map((item) => (
									<MenuItem key={item.key} value={item.value}>
										{item.text}
									</MenuItem>
								))}
							</Select>
							<FormHelperText>{formik.errors.country || formik.touched.country}</FormHelperText>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<FormSectionHeadline variant={'h5'}>Logos</FormSectionHeadline>
					</Grid>
					<Grid item xs={12}>
						<FileDropZone name="logo" onDroppedFiles={onFileChange}>
							{!logoCID.logo && <Image />}
							{logoCID.logo && (
								<Image16to9 sx={{  maxHeight: "200px" }} alt={formik.values.title} src={gateway + logoCID.logo} />
							)}
							<Typography variant={'body2'} align={'center'}>
							{!logoCID.logo ? "Pick a " : ""}logo graphic
							</Typography>
						</FileDropZone>
					</Grid>
					<Grid item xs={12}>
						<FileDropZone name="header" onDroppedFiles={onFileChange}>
							{!headerCID.header && <Image />}
							{headerCID.header && (
								<Image16to9 sx={{  maxHeight: "200px" }} alt={formik.values.title} src={gateway + headerCID.header} />
							)}
							<Typography variant={'body2'} align={'center'}>
							{!headerCID.header ? "Pick a " : ""}header graphic
							</Typography>
						</FileDropZone>
					</Grid>

					<Grid item xs={12}>
						<FormSectionHeadline>Meta Information</FormSectionHeadline>
					</Grid>
					<Grid item xs={12}>
						<TextField
							multiline
							aria-label="Short Description"
							minRows={3}
							placeholder="Minimum 3 rows"
							fullWidth
							label="Short Description"
							name="description"
							value={formik.values.description}
							placeholder="Tell us more"
							onChange={formik.handleChange}
							error={Boolean(formik.errors.description)}
							helperText={formik.errors.description || formik.touched.description}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							label="Website"
							placeholder="https://your.website.xyz"
							isInjected="website"
							fullWidth
							name="website"
							value={formik.values.website}
							onChange={formik.handleChange}
							error={Boolean(formik.errors.website)}
							helperText={formik.errors.website || formik.touched.website}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							label="Code Repository"
							placeholder="repo"
							id="repo"
							fullWidth
							name="repo"
							value={formik.values.repo}
							onChange={formik.handleChange}
							error={Boolean(formik.errors.repo)}
							helperText={formik.errors.repo || formik.touched.repo}
						/>
					</Grid>
					<Grid item xs={12}>
						<FormSectionHeadline>Controller Settings</FormSectionHeadline>
					</Grid>
					<Grid item xs={12}>
						<TextField
							id="controller"
							fullWidth
							name="controller"
							placeholder="Controller"
							label="Controller Account"
							value={formik.values.controller}
							helperText={
								'Note: In case you want to create a DAO, the controller must be the organization.'
							}
							onChange={formik.handleChange}
							required
							error={Boolean(formik.errors.controller)}
							helperText={formik.errors.controller || formik.touched.controller}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							id="treasury"
							name="treasury"
							placeholder="Treasury"
							fullWidth
							label="Treasury Account"
							value={formik.values.treasury}
							onChange={formik.handleChange}
							required
							error={Boolean(formik.errors.treasury)}
							helperText={formik.errors.treasury || formik.touched.treasury}
						/>
					</Grid>
					<Grid item xs={12}>
						<FormControl fullWidth error={Boolean(formik.errors.access)}>
							<InputLabel id="member-select-label">Member Access Control</InputLabel>
							<Select
								labelId="member-select-label"
								id="member-select"
								label="Member Access Control"
								name="access"
								value={formik.values.access}
								onChange={formik.handleChange}
								required
							>
								{data.dao_member_governance.map((item) => (
									<MenuItem key={item.key} value={item.value}>
										{item.text}
									</MenuItem>
								))}
							</Select>
							<FormHelperText>{formik.errors.access || formik.touched.access}</FormHelperText>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={4}>
						<TextField
							id="member_limit"
							name="member_limit"
							placeholder="100"
							label="Member Limit"
							value={formik.values.member_limit}
							onChange={formik.handleChange}
							fullWidth
							required
							error={Boolean(formik.errors.member_limit)}
							helperText={formik.errors.member_limit || formik.touched.member_limit}
						/>
					</Grid>
					<Grid item xs={12} md={4}>
						<FormControl fullWidth error={Boolean(formik.errors.fee_model)}>
							<InputLabel id="fee_model-label">Fee Model</InputLabel>
							<Select
								labelId="fee_model-label"
								id="fee_model"
								label="Fee Model"
								name="fee_model"
								value={formik.values.fee_model}
								onChange={formik.handleChange}
								required
							>
								{data.dao_fee_model.map((item) => (
									<MenuItem key={item.key} value={item.value}>
										{item.text}
									</MenuItem>
								))}
							</Select>
							<FormHelperText>{formik.errors.fee_model || formik.touched.fee_model}</FormHelperText>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={4}>
						<TextField
							id="fee"
							name="fee"
							label="Membership Fee"
							placeholder="10"
							fullWidth
							value={formik.values.fee}
							onChange={formik.handleChange}
							required
							error={Boolean(formik.errors.fee)}
							helperText={formik.errors.fee || formik.touched.fee}
						/>
					</Grid>
				</Grid>
			</Paper>
			<Container maxWidth={'xs'} sx={{ p: 4 }}>
				{account && (
					<Button type="submit" fullWidth variant={'contained'}>
						Create Organization
					</Button>
				)}
				<Typography sx={{ color: "red" }}>{Object.keys(formik.errors).length !== 0 ? "errors present" : ""}</Typography>
			</Container>
		</form>
	)
}

export default function Module(props) {
	const { account } = useWallet()
	const apiProvider = useApiProvider()
	return apiProvider && apiProvider.query.gameDaoControl && account ? <Main {...props} /> : null
}
