import defaultMarkdown from '!!raw-loader!src/components/markdown/MarkdownDefault.md'
import { Image } from '@mui/icons-material'
import { useApiProvider } from '@substra-hooks/core'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import { MarkdownEditor } from 'src/components/markdown/MarkdownEditor'
import { useWallet } from 'src/context/Wallet'
import { useBalance } from 'src/hooks/useBalance'
import { useCrowdfunding } from 'src/hooks/useCrowdfunding'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'

import { formatZero } from 'src/utils/helper'
import {
	Box,
	Button,
	Checkbox,
	Container,
	FileDropZone,
	FormControl,
	FormControlLabel,
	FormSectionHeadline,
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
} from '../../components'
import config from '../../config'
import { data, rnd } from '../lib/data'
import { gateway, pinFileToIPFS, pinJSONToIPFS } from '../lib/ipfs'

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
	const org = null

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

	const [block, setBlock] = useState(0)

	// markdown editor & state
	const [markdownValue, setMarkdownValue] = useState(defaultMarkdown)

	function handleEditorChange({ html, text }) {
		setMarkdownValue(text)
	}

	const [formData, updateFormData] = useState()
	const [logoCID, updateLogoCID] = useState({})
	const [headerCID, updateHeaderCID] = useState({})
	const [content, setContent] = useState()
	const { updateBalance } = useBalance()

	const [loading, setLoading] = useState(false)
	const [refresh, setRefresh] = useState(true)

	const bestBlock = connected
		? apiProvider.derive.chain.bestNumberFinalized
		: apiProvider.derive.chain.bestNumber

	useEffect(() => {
		let unsubscribe = null
		bestBlock((number) => {
			setBlock(number.toNumber())
		})
			.then((unsub) => {
				unsubscribe = unsub
			})
			.catch(console.error)
		return () => unsubscribe && unsubscribe()
	}, [bestBlock])

	useEffect(() => {
		//if (orgs.length === 0) return
		const initial_state = random_state(account)
		updateFormData(initial_state)
	}, [account])

	useEffect(() => {
		if (!formData) return
		if (dev) console.log('update content json')
		const contentJSON = {
			name: formData.name,
			email: formData.email,
			title: formData.title,
			description: formData.description,
			markdown: markdownValue,
			...logoCID,
			...headerCID,
		}
		if (dev) console.log(contentJSON)
		setContent(contentJSON)
	}, [logoCID, headerCID, formData])

	useEffect(() => {
		if (!refresh) return
		if (dev) console.log('refresh signal')
		//updateFileCID(null)
		updateFormData(random_state(account))
		setRefresh(false)
		setLoading(false)
	}, [account, refresh])

	// handle form state
	const handleOnChange = ({ target: { name, value } }) => {
		updateFormData({ ...formData, [name]: value })
	}

	const handleCheckboxToggle = ({ target: { name } }) => {
		updateFormData({ ...formData, [name]: !formData[name] })
	}

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

	// submit
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

		//

		const sendTX = async (cid) => {
			setLoading(true)
			//                             day factor            a day in blocks   current block as offset
			const campaign_end = parseFloat(formData.duration) * data.blocksPerDay + block // take current block as offset
			const payload = [
				formData.org,
				formData.admin,
				formData.title,
				formatZero(formData.cap),
				formatZero(formData.deposit),
				campaign_end,
				formData.protocol,
				formData.governance === true ? 1 : 0,
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

	const logoGraphicInputRef = React.useRef(null)
	const headerGraphicInputRef = React.useRef(null)

	if (!daoControl || !daoControl.bodies) return <Loader text="" />
	if (!formData) return null

	const nonce = daoControl.nonce
	const orgs = Object.keys(daoControl.bodies).map((key) => daoControl.bodies[key])

	return (
		<>
			<Box sx={{ pb: 2 }}>
				<Grid container alignItems={'center'} spacing={3}>
					<Grid item xs={12} md={8}>
						<Typography variant={'body1'}>Create Campaign</Typography>
						<Typography variant={'h3'}>
							{formData.title || 'Untitled campaign'}
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
				<Grid container spacing={3} component="form">
					<Grid item xs={12}>
						<FormSectionHeadline variant={'h5'}>
							General Information
						</FormSectionHeadline>
					</Grid>
					<Grid item xs={12} md={6}>
						<FormControl fullWidth>
							<InputLabel id="org-select-label">Organization</InputLabel>
							<Select
								labelId="org-select-label"
								id="org"
								required
								label="Organization"
								placeholder="Organization"
								name="org"
								value={formData.org}
								onChange={handleOnChange}
							>
								{orgs.map((item, index) => (
									<MenuItem key={index} value={item.id}>
										{item.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							fullWidth
							required
							label="Campaign name"
							placeholder="Campaign name"
							name="title"
							value={formData.title}
							onChange={handleOnChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							multiline
							minRows={5}
							required
							value={formData.description}
							label="Campaign Description"
							placeholder="Tell us more about your idea..."
							name="description"
							onChange={handleOnChange}
						/>
					</Grid>

					<Grid item xs={12}>
						<FormSectionHeadline variant={'h5'}>Content</FormSectionHeadline>
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
							value={formData.name}
							onChange={handleOnChange}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							fullWidth
							label="Email"
							placeholder="Email"
							name="email"
							value={formData.email}
							onChange={handleOnChange}
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
							value={formData.admin}
							onChange={handleOnChange}
							required
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
								value={formData.usage}
								onChange={handleOnChange}
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
						<FormControl fullWidth>
							<InputLabel id="protocol-select-label">Protocol</InputLabel>
							<Select
								labelId="protocol-select-label"
								id="protocol"
								required
								fullWidth
								name="protocol"
								label={'protocol'}
								placeholder="Protocol"
								value={formData.protocol}
								onChange={handleOnChange}
							>
								{data.protocol_types.map((item) => (
									<MenuItem key={item.key} value={item.value}>
										{item.text}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>

					<Grid item xs={12} md={4}>
						<TextField
							fullWidth
							label="Deposit (GAME)"
							placeholder="Deposit"
							name="deposit"
							value={formData.deposit}
							onChange={handleOnChange}
						/>
					</Grid>
					<Grid item xs={12} md={4}>
						<TextField
							fullWidth
							label="Funding Target (PLAY)"
							placeholder="Cap"
							name="cap"
							value={formData.cap}
							onChange={handleOnChange}
						/>
					</Grid>

					<Grid item xs={12} md={4}>
						<FormControl fullWidth>
							<InputLabel id="duration-select-label">Campaign Duration</InputLabel>
							<Select
								labelId="duration-select-label"
								id="duration"
								required
								label="Campaign Duration"
								options={data.project_durations}
								placeholder="Campaign Duration"
								name="duration"
								value={formData.duration}
								onChange={handleOnChange}
							>
								{data.project_durations.map((item) => (
									<MenuItem key={item.key} value={item.value}>
										{item.text}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>

					<Grid item xs={12}>
						<FormControlLabel
							label="DAO Governance"
							control={
								<Checkbox
									name="governance"
									checked={formData.governance}
									onChange={handleCheckboxToggle}
								/>
							}
						/>
					</Grid>
					<Grid item xs={12}>
						<FormControlLabel
							label="I agree to the Terms and Conditions"
							control={
								<Checkbox
									name="accept"
									checked={formData.accept}
									onChange={handleCheckboxToggle}
								/>
							}
						/>
					</Grid>
				</Grid>
			</Paper>
			<Container maxWidth={'xs'} sx={{ p: 4 }}>
				<Button variant={'contained'} fullWidth onClick={handleSubmit}>
					Create Campaign
				</Button>
			</Container>
		</>
	)
}

export default function Module() {
	const apiProvider = useApiProvider()
	const { account } = useWallet()

	return apiProvider && account ? <Main /> : null
}
