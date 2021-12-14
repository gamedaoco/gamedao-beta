import { Image } from '@mui/icons-material'
import { useApiProvider } from '@substra-hooks/core'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
//const steps = ['Select master blaster campaign settings', 'Create an ad group', 'Create an ad']
import { useWallet } from 'src/context/Wallet'
import {
	Box,
	Button,
	Container,
	FileDropZone,
	FormControl,
	FormSectionHeadline,
	Grid,
	InputLabel,
	Image16to9,
	MenuItem,
	Paper,
	Select,
	TextField,
	Typography,
	Stepper,
	Step,
	StepLabel,
} from '../../components'
import config from '../../config'
import { data, rnd } from '../lib/data'
import { gateway, pinFileToIPFS, pinJSONToIPFS } from '../lib/ipfs'

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
	const { account, address, signAndNotify } = useWallet()
	const [loading, setLoading] = useState(false)
	const [refresh, setRefresh] = useState(true)
	const [formData, updateFormData] = useState()
	const [logoCID, updateLogoCID] = useState({})
	const [headerCID, updateHeaderCID] = useState({})
	const [content, setContent] = useState()
	const navigate = useNavigate()
	useEffect(() => {
		if (!account) return
		if (dev) console.log('generate form data')
		const initial_state = random_state(account)
		updateFormData(initial_state)
	}, [account])

	// update json payload from form data

	useEffect(() => {
		if (!formData) return
		if (dev) console.log('update content json')
		const contentJSON = {
			name: formData.name,
			description: formData.description,
			website: formData.website,
			email: formData.email,
			repo: formData.repo,
			...logoCID,
			...headerCID,
		}
		setContent(contentJSON)
	}, [logoCID, headerCID, formData])

	// handle file uploads to ipfs
	const onFileChange = (files, event) => {
		const name = event.target.name

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

	// form fields

	const handleOnChange = (e) => {
		const { name, value } = e.target
		return updateFormData({ ...formData, [name]: value })
	}

	//
	// submit function
	//

	const handleSubmit = (e) => {
		e.preventDefault()
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
				formData.treasury,
				formData.name,
				cid,
				formData.body,
				formData.access,
				formData.fee_model,
				formData.fee,
				0,
				0,
				formData.member_limit,
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
						result.events.forEach(({ event: { data, method, section } }) => {
							if (section === 'gameDaoControl' && method === 'BodyCreated') {
								navigate(`/app/organisations/${data[2].toHex()}`)
							}
						})
					}
				}
			)
		}

		getCID()
	}

	useEffect(() => {
		if (!refresh) return
		if (dev) console.log('refresh signal')
		//updateFileCID(null)
		updateFormData(random_state(account))
		setRefresh(false)
		setLoading(false)
	}, [account, refresh])

	const logoInputRef = useRef(null)
	const headerInputRef = useRef(null)

	if (!formData) return null
	return (
		<>
			<Box sx={{ pb: 2 }}>
				<Grid container spacing={3} alignItems={'center'}>
					<Grid item xs={12} md={8}>
						<Typography variant={'body1'}>Create Organization</Typography>
						<Typography variant={'h3'}>
							{formData.name || 'Untitled organization'}
						</Typography>
					</Grid>
					<Grid item xs={12} md={4}>
						<Stepper orientation={'horizontal'}>
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
							value={formData.name}
							onChange={handleOnChange}
							required
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							label="Contact Email"
							fullWidth
							placeholder="email"
							name="email"
							value={formData.email}
							onChange={handleOnChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<FormControl fullWidth>
							<InputLabel id="body-select-label">Organizational Body</InputLabel>
							<Select
								label="Organizational Body"
								name="body"
								placeholder="Organizational Body"
								labelId="body-select-label"
								id="body"
								value={formData.body}
								onChange={handleOnChange}
								required
							>
								{data.dao_bodies.map((item) => (
									<MenuItem key={item.key} value={item.value}>
										{item.text}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<FormControl fullWidth>
							<InputLabel id="country-select-label">Country</InputLabel>
							<Select
								label="Country"
								name="country"
								placeholder="Country"
								labelId="country-select-label"
								id="country"
								value={formData.country}
								onChange={handleOnChange}
								required
							>
								{data.countries.map((item) => (
									<MenuItem key={item.key} value={item.value}>
										{item.text}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<FormSectionHeadline variant={'h5'}>Logos</FormSectionHeadline>
					</Grid>
					<Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
						{!logoCID.logo && (
							<img
								alt="placeholder"
								height={'128'}
								src={`${process.env.PUBLIC_URL}/assets/gamedao_logo_symbol.svg`}
							/>
						)}
						{logoCID.logo && (
							<Image16to9 alt={formData.title} src={gateway + logoCID.logo} />
						)}
					</Grid>

					<Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
						{!headerCID.header && (
							<img
								alt="placeholder"
								height={'128'}
								src={`${process.env.PUBLIC_URL}/assets/gamedao_tangram_white.svg`}
							/>
						)}
						{headerCID.header && (
							<Image16to9 alt={formData.title} src={gateway + headerCID.header} />
						)}
					</Grid>

					<Grid item xs={12} md={6}>
						<FileDropZone name="logo" onDroppedFiles={onFileChange}>
							<Image />
							<Typography variant={'body2'} align={'center'}>
								Pick a logo graphic
							</Typography>
						</FileDropZone>
					</Grid>
					<Grid item xs={12} md={6}>
						<FileDropZone name="header" onDroppedFiles={onFileChange}>
							<Image />
							<Typography variant={'body2'} align={'center'}>
								Pick a header graphic
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
							value={formData.description}
							placeholder="Tell us more"
							onChange={handleOnChange}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							label="Website"
							placeholder="https://your.website.xyz"
							isInjected="website"
							fullWidth
							name="website"
							value={formData.website}
							onChange={handleOnChange}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							label="Code Repository"
							placeholder="repo"
							id="repo"
							fullWidth
							name="repo"
							value={formData.repo}
							onChange={handleOnChange}
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
							value={formData.controller}
							helperText={
								'Note: In case you want to create a DAO, the controller must be the organization.'
							}
							onChange={handleOnChange}
							required
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							id="treasury"
							name="treasury"
							placeholder="Treasury"
							fullWidth
							label="Treasury Account"
							value={formData.treasury}
							onChange={handleOnChange}
							required
						/>
					</Grid>
					<Grid item xs={12}>
						<FormControl fullWidth>
							<InputLabel id="member-select-label">Member Access Control</InputLabel>
							<Select
								labelId="member-select-label"
								id="member-select"
								label="Member Access Control"
								name="access"
								value={formData.access}
								onChange={handleOnChange}
								required
							>
								{data.dao_member_governance.map((item) => (
									<MenuItem key={item.key} value={item.value}>
										{item.text}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={4}>
						<TextField
							id="member_limit"
							name="member_limit"
							placeholder="100"
							label="Member Limit"
							value={formData.member_limit}
							onChange={handleOnChange}
							fullWidth
							required
						/>
					</Grid>
					<Grid item xs={12} md={4}>
						<FormControl fullWidth>
							<InputLabel id="fee_model-label">Fee Model</InputLabel>
							<Select
								labelId="fee_model-label"
								id="fee_model"
								label="Fee Model"
								name="fee_model"
								value={formData.fee_model}
								onChange={handleOnChange}
								required
							>
								{data.dao_fee_model.map((item) => (
									<MenuItem key={item.key} value={item.value}>
										{item.text}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={4}>
						<TextField
							id="fee"
							name="fee"
							label="Membership Fee"
							placeholder="10"
							fullWidth
							value={formData.fee}
							onChange={handleOnChange}
							required
						/>
					</Grid>
				</Grid>
			</Paper>
			<Container maxWidth={'xs'} sx={{ p: 4 }}>
				{account && (
					<Button fullWidth variant={'contained'} onClick={handleSubmit}>
						Create Organization
					</Button>
				)}
			</Container>
		</>
	)
}

export default function Module(props) {
	const { account } = useWallet()
	const apiProvider = useApiProvider()
	return apiProvider && apiProvider.query.gameDaoControl && account ? <Main {...props} /> : null
}
