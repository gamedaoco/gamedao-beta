import { Image } from '@mui/icons-material'
import { useApiProvider } from '@substra-hooks/core'
import React, { useEffect, useState } from 'react'
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

import defaultMarkdown from '!!raw-loader!src/components/markdown/MarkdownDefault.md'
import { MarkdownEditor } from 'src/components/markdown/MarkdownEditor'
import { formatZero } from 'src/utils/helper'
import config from '../../config'
import { data, rnd } from '../lib/data'
import { gateway, pinFileToIPFS, pinJSONToIPFS } from '../lib/ipfs'

import { useBlock } from 'src/hooks/useBlock'
import { useWallet } from 'src/context/Wallet'
import { useBalance } from 'src/hooks/useBalance'
import { useCrowdfunding } from 'src/hooks/useCrowdfunding'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { useDebouncedEffect } from 'src/hooks/useDebouncedEffect';

const dev = config.dev

const random_state = (account) => {
	const name = 'Dao Jones'
	const email = 'daojones@gamedao.co'
	const title = 'Great Campaign Title'
	const description = 'Awesome Short Description'
	const country = data.countries[rnd(data.countries.length)].value
	const entity = data.project_entities[rnd(data.project_entities.length)].value
	const usage = data.project_types[rnd(data.project_types.length)].value
	const accept = false
	const cap = rnd(1000)
	const deposit = rnd(10)
	const duration = data.project_durations[rnd(data.project_durations.length)].value
	const protocol = data.protocol_types[rnd(data.protocol_types.length)].value
	const governance = rnd(2) === 0 ? false : true
	const cid = ''
	const tags = ['dao', 'game']
	const org = ''

	const admin = account.address

	return {
		name,
		email,
		title,
		description,
		country,
		entity,
		usage,
		accept,
		cap,
		deposit,
		duration,
		protocol,
		governance,
		cid,
		tags,
		org,
		admin,
	}
}


export const Main = () => {
	const { account, connected, signAndNotify } = useWallet()
	const apiProvider = useApiProvider()
	const crowdfunding = useCrowdfunding()
	const daoControl = useGameDaoControl()
	const gov = useGameDaoGovernance()
	const navigate = useNavigate()
	const { updateBalance } = useBalance()
	const blockheight = useBlock()

	const [stepperState, setStepperState] = useState(0)
	const [initialData, setInitialData] = useState()
	const [persistedData, setPersistedData] = useState()
	const [logoCID, updateLogoCID] = useState({})
	const [headerCID, updateHeaderCID] = useState({})
	const [content, setContent] = useState()
	const [loading, setLoading] = useState(false)
	const [refresh, setRefresh] = useState(true)

	// markdown editor & state
	const [markdownValue, setMarkdownValue] = useState(defaultMarkdown)

	function handleEditorChange({ html, text }) {
		setMarkdownValue(text)
	}

	useEffect(() => {
		if (!account) return
		const ls =  localStorage.getItem("gamedao-form-create-campaign")
		const mls = localStorage.getItem("gamedao-markdown-create-campaign")
		if(mls){
			setMarkdownValue(mls)
		}
		if(ls){
			setPersistedData(JSON.parse(ls))
		}
		setInitialData(random_state(account))
	}, [account])

	const onFileChange = (files, event) => {
		const name = event.target.getAttribute("name")
		if (!files?.[0]) return
		if (dev) console.log('upload image')

		pinFileToIPFS(files[0])
			.then((cid) => {
				if (name === 'logo') updateLogoCID({ logo: cid })
				if (name === 'header') updateHeaderCID({ header: cid })
				if (dev) console.log('file cid', `${gateway}${cid}`)
			})
			.catch((error) => {
				console.log('Error uploading file: ', error)
			})

	}

	// submit
	const handleSubmit = (values, form) => {
		console.log('submit')
		setLoading(true)

		const getCID = async () => {
			if (dev) console.log('1. upload content json')
			try {
				
				const cid = await pinJSONToIPFS(content)
				if (cid) {
					if (dev) console.log('json cid', `${gateway}${cid}`)
					sendTX(cid)
				}
			} catch (err) {
				console.log('Error uploading file: ', err)
			}
		}

		const sendTX = async (cid) => {
			setLoading(true)
			//                             day factor            a day in blocks   current block as offset
			const campaign_end = parseFloat(formik.values.duration) * data.blocksPerDay + blockheight // take current block as offset

			const payload = [
				formik.values.org,
				formik.values.admin,
				formik.values.title,
				formatZero(formik.values.cap),
				formatZero(formik.values.deposit),
				campaign_end,
				formik.values.protocol,
				formik.values.governance === true ? 1 : 0,
				cid,
				'PLAY',
				'Play Coin',
			]

			console.log(payload)

			signAndNotify(
				apiProvider.tx.gameDaoCrowdfunding.create(...payload),
				{
					pending: 'Campaign creation in progress',
					success: 'Campaign creation successfully',
					error: 'Campaign creation failed',
				},
				(state, result) => {
					setLoading(false)
					setRefresh(true)
					updateBalance()

					if (state) {
						setStepperState(2)
						result.events.forEach(({ event: { data, method, section } }) => {
							if (section === 'gameDaoCrowdfunding' && method === 'CampaignCreated') {
								navigate(`/app/campaigns/${data[0].toHex()}`)
							}
						})
					}

					if (!state) {
						// TODO: 2075 Do we need error handling here?
					}
				}
			)
		}

		getCID()
	}

	
	const formik = useFormik({
		enableReinitialize: true,
		initialValues: persistedData ? persistedData : initialData,
		validate: (values) => {
			setStepperState(1)
			const errors = {}
		
			if(!values.org || values.org === "") errors.org = "You must choose an Organization"

			if(values.description === "Awesome Short Description") errors.description = "You can do better than that!"

			if(!values.title || values.title === "" ) errors.title = "Please Enter a Campaign Title!"
			if(new Blob([values.title]).size > 48) errors.title = 'Please enter a maximum of 48 bytes.'

			if(!values.name || values.name === "" ) errors.name = "Please Enter a Name!"
			if(values.name === "Dao Jones") errors.name = "...I dont think thats your name"
			if(!/^[a-zA-Z\s]*$/i.test(values.name)){
				errors.name = "Please enter only letters."
			}

			if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
				errors.email = "Please enter a valid e-mail address."
			}

			if(values.cap === "0" || values.cap === "") errors.cap = "Please enter funding target."
			if(values.cap && !/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/i.test(values.cap)) errors.cap = "Funding target must be numerical"
			
			if(values.deposit === "0" || values.deposit === "") errors.deposit = "Please enter funding target."
			if(values.deposit && !/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/i.test(values.deposit)) errors.deposit = "Deposit must be numerical"

			if(!values.accept) errors.accept = "You must accept the Terms"

			return errors
		},
		//validationSchema: validationSchema,
		onSubmit: handleSubmit
	});

	// save content json and form values to localstorage
	useDebouncedEffect(() => {
		if (!formik.values) return
		if (dev) console.log('update content json')
		const contentJSON = {
			name: formik.values.name,
			email: formik.values.email,
			title: formik.values.title,
			description: formik.values.description,
			markdown: markdownValue,
			...logoCID,
			...headerCID,
		}
		if (dev) console.log(contentJSON)
		setContent(contentJSON)
		localStorage.setItem("gamedao-form-create-campaign", JSON.stringify(formik.values))
		localStorage.setItem("gamedao-markdown-create-campaign", markdownValue)
	}, [logoCID, headerCID, formik.values, markdownValue], 2000)

	useEffect(() => {
		if (!refresh) return
		if (dev) console.log('refresh signal')
		setRefresh(false)
		setLoading(false)
	}, [account, refresh])

	if (!daoControl || !daoControl.bodies || !formik.values ) return <Loader text="Create Campaign" />

	const orgs = Object.keys(daoControl.bodies).map((key) => daoControl.bodies[key])

	return (
		<form onSubmit={formik.handleSubmit}>
			<Box sx={{ pb: 2 }}>
				<Grid container alignItems={'center'} spacing={3}>
					<Grid item xs={12} md={7}>
						<Typography variant={'body1'}>Create Campaign</Typography>
						<Typography variant={'h3'}>
							{formik.values.title || 'Untitled campaign'}
						</Typography>
					</Grid>
					<Grid item xs={12} md={5}>
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
				<Grid container spacing={3} component="form">
					<Grid item xs={12}>
						<FormSectionHeadline variant={'h5'}>
							General Information
						</FormSectionHeadline>
					</Grid>
					<Grid item xs={12} md={6}>
						<FormControl fullWidth error={formik.touched.org && Boolean(formik.errors.org)}>
							<InputLabel id="org-select-label">Organization</InputLabel>
							<Select
								component={Select}
								labelId="org-select-label"
								id="org"
								required
								label="Organization"
								placeholder="Organization"
								name="org"
								value={formik.values.org}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							>
								{orgs.map((item, index) => (
									<MenuItem key={index} value={item.id}>
										{item.name}
									</MenuItem>
								))}
							</Select>
							<FormHelperText>{formik.touched.org && formik.errors.org}</FormHelperText>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							fullWidth
							required
							label="Campaign name"
							placeholder="Campaign name"
							name="title"
							value={formik.values.title}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={formik.touched.title && Boolean(formik.errors.title)}
							helperText={formik.touched.title && formik.errors.title}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							multiline
							minRows={5}
							required
							label="Campaign Description"
							placeholder="Tell us more about your idea..."
							name="description"
							value={formik.values.description}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={formik.touched.description && Boolean(formik.errors.description)}
							helperText={formik.touched.description && formik.errors.description}
						/>
					</Grid>

					<Grid item xs={12}>
						<FormSectionHeadline variant={'h5'}>Content</FormSectionHeadline>
					</Grid>

					<Grid item xs={12}>
						<FormSectionHeadline variant={'h6'}>Logo (800 x 800px)</FormSectionHeadline>
						<FileDropZone name="logo" onDroppedFiles={onFileChange} onDeleteItem={ () => updateLogoCID({}) }>
							{!logoCID.logo && <Image />}
							{logoCID.logo && (
								<Image16to9 sx={{  maxHeight: "200px" }} alt={formik.values.title} src={gateway + logoCID.logo} />
							)}
							<Typography variant={'body2'} align={'center'}>{!logoCID.logo && "Logo Image. Drop here, or select a file."}</Typography>
							<Typography variant={'body2'} align={'center'}>{!logoCID.logo  && "It must be a JPG, GIF or PNG, no larger than 200 MB."}</Typography>
						</FileDropZone>
					</Grid>
					<Grid item xs={12}>
						<FormSectionHeadline variant={'h6'}>Header Image (1920 x 800px)</FormSectionHeadline>
						<FileDropZone name="header" onDroppedFiles={onFileChange} onDeleteItem={ () => updateHeaderCID({}) }>
							{!headerCID.header && <Image />}
							{headerCID.header && (
								<Image16to9 sx={{  maxHeight: "200px" }} alt={formik.values.title} src={gateway + headerCID.header} />
							)}
							<Typography variant={'body2'} align={'center'}>{!headerCID.header && "Header Image. Drop here, or select a file."}</Typography>
							<Typography variant={'body2'} align={'center'}>{!headerCID.header && "It must be a JPG, GIF or PNG, 1920 x 800px no larger than 200 MB."}</Typography>
						</FileDropZone>
					</Grid>

					<Grid item xs={12}>
						<FormSectionHeadline variant={'h5'}>
							Content Description
						</FormSectionHeadline>
					</Grid>

					<Grid item xs={12}>
						<MarkdownEditor value={markdownValue} onChange={handleEditorChange} />
					</Grid>

					{/* legal body applying for the funding */}

					<Grid item xs={12}>
						<FormSectionHeadline variant={'h5'}>
							Public Representative
						</FormSectionHeadline>
					</Grid>

					<Grid item xs={12} md={6}>
						<TextField
							fullWidth
							label="Name"
							placeholder="Name"
							name="name"
							value={formik.values.name}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={formik.touched.name && Boolean(formik.errors.name)}
							helperText={formik.touched.name && formik.errors.name}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							fullWidth
							label="Email"
							placeholder="Email"
							name="email"
							value={formik.values.email}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={formik.touched.email && Boolean(formik.errors.email)}
							helperText={formik.touched.email && formik.errors.email}
						/>
					</Grid>

					<Grid item xs={12}>
						<FormSectionHeadline variant={'h5'}>Campaign Settings</FormSectionHeadline>
					</Grid>

					{/* usage of funding and protocol to initiate after successfully raising */}

					<Grid item xs={12} md={6}>
						<TextField
							fullWidth
							label="Admin Account"
							placeholder="Admin"
							name="admin"
							required
							value={formik.values.admin}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={formik.touched.admin && Boolean(formik.errors.admin)}
							helperText={formik.touched.admin && formik.errors.admin}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<FormControl fullWidth>
							<InputLabel id="usage-select-label">Usage of funds</InputLabel>
							<Select
								labelId="usage-select-label"
								label={'Usage of funds'}
								id="usage"
								required
								name="usage"
								placeholder="Usage"
								value={formik.values.usage}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={formik.touched.usage && Boolean(formik.errors.usage)}
								helperText={formik.touched.usage && formik.errors.usage}
							>
								{data.project_types.map((item) => (
									<MenuItem key={item.key} value={item.value}>
										{item.text}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>

					<Grid item xs={12}>
						<FormControl fullWidth error={formik.touched.protocol && Boolean(formik.errors.protocol)}>
							<InputLabel id="protocol-select-label">Protocol</InputLabel>
							<Select
								labelId="protocol-select-label"
								id="protocol"
								required
								fullWidth
								name="protocol"
								label={'protocol'}
								placeholder="Protocol"
								value={formik.values.protocol}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							>
								{data.protocol_types.map((item) => (
									<MenuItem key={item.key} value={item.value}>
										{item.text}
									</MenuItem>
								))}
							</Select>
							<FormHelperText>{formik.touched.protocol && formik.errors.protocol}</FormHelperText>
						</FormControl>
					</Grid>

					<Grid item xs={12} md={4}>
						<TextField
							fullWidth
							label="Deposit (GAME)"
							placeholder="Deposit"
							name="deposit"
							value={formik.values.deposit}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={formik.touched.deposit && Boolean(formik.errors.deposit)}
							helperText={formik.touched.deposit && formik.errors.deposit}
						/>
					</Grid>
					<Grid item xs={12} md={4}>
						<TextField
							fullWidth
							label="Funding Target (PLAY)"
							placeholder="Cap"
							name="cap"
							value={formik.values.cap}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={formik.touched.cap && Boolean(formik.errors.cap)}
							helperText={formik.touched.cap && formik.errors.cap}
						/>
					</Grid>

					<Grid item xs={12} md={4}>
						<FormControl fullWidth error={formik.touched.duration && Boolean(formik.errors.duration)}>
							<InputLabel id="duration-select-label">Campaign Duration</InputLabel>
							<Select
								labelId="duration-select-label"
								id="duration"
								required
								label="Campaign Duration"
								placeholder="Campaign Duration"
								name="duration"
								value={formik.values.duration}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							>
								{data.project_durations.map((item) => (
									<MenuItem key={item.key} value={item.value}>
										{item.text}
									</MenuItem>
								))}
							</Select>
							<FormHelperText>{formik.touched.duration && formik.errors.duration}</FormHelperText>
						</FormControl>
					</Grid>

					<Grid item xs={12}>
					<FormControl error={formik.touched.governance && Boolean(formik.errors.governance)}>
						<FormControlLabel
							label="DAO Governance"
							control={
								<Checkbox
									name="governance"
									checked={formik.values.governance}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
							}
						/>
        				<FormHelperText>{formik.touched.governance && formik.errors.governance}</FormHelperText>
      				</FormControl>
					</Grid>
					<Grid item xs={12}>
					<FormControl error={formik.touched.accept && Boolean(formik.errors.accept)}>
						<FormControlLabel
							label="I agree to the Terms and Conditions"
							control={
								<Checkbox
									required
									name="accept"
									checked={formik.values.accept}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
							}
						/>
        				<FormHelperText>{formik.touched.accept && formik.errors.accept}</FormHelperText>
      				</FormControl>
					</Grid>
				</Grid>
			</Paper>
			<Container maxWidth={'xs'} sx={{ p: 4 }}>
				<Button 
					type="submit"
					variant='contained' 
					fullWidth 
				>
					Create Campaign
				</Button>
				<Typography sx={{ color: "red" }}>{Object.keys(formik.errors).length !== 0 ? "errors present" : ""}</Typography>
			</Container>
	</form>
	)
}

export default function Module() {
	const apiProvider = useApiProvider()
	const { account } = useWallet()

	return apiProvider && account ? <Main /> : null
}
