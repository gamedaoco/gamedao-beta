import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import {
	Button,
	Divider,
	FormControl,
	MenuItem,
	Select,
	Checkbox,
	TextField,
	Typography,
	InputLabel,
	Grid,
	FormControlLabel,
	Image16to9,
	MarkdownEditor
} from '../../components'
import Loader from 'src/components/Loader'
import { data, rnd } from '../lib/data'
import config from '../../config'

import { pinJSONToIPFS, pinFileToIPFS, gateway } from '../lib/ipfs'

import { formatZero } from 'src/utils/helper'

import { useBalance } from 'src/hooks/useBalance'
import { useWallet } from 'src/context/Wallet'
import { useIdentity } from 'src/hooks/useIdentity'
import { useCrowdfunding } from 'src/hooks/useCrowdfunding'
import { useApiProvider } from '@substra-hooks/core'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'

import defaultMarkdown from '!!raw-loader!src/components/MarkdownDefault.md';

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
	const { address, account, finalized, signAndNotify } = useWallet()
	const apiProvider = useApiProvider()
	const identity = useIdentity(address)
	const crowdfunding = useCrowdfunding()
	const daoControl = useGameDaoControl()
	const gov = useGameDaoGovernance()
	const navigate = useNavigate();

	const [block, setBlock] = useState(0)

	// markdown editor & state
	const [markdownValue, setMarkdownValue] = useState(defaultMarkdown)

	function handleEditorChange({ html, text }) {
		setMarkdownValue(text)
	}

	const [formData, updateFormData] = useState()
	const [fileCID, updateFileCID] = useState()
	const [content, setContent] = useState()
	const { updateBalance } = useBalance()

	const [loading, setLoading] = useState(false)
	const [refresh, setRefresh] = useState(true)

	const bestBlock = finalized
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
			...fileCID,
		}
		// if (dev) console.log(contentJSON)
		setContent(contentJSON)
	}, [fileCID, formData])

	useEffect(() => {
		if (!refresh) return
		if (dev) console.log('refresh signal')
		updateFileCID(null)
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

	async function onFileChange(e, type) {
		const file = e.target.files[0]
		if (!file) return
		if (dev) console.log('upload image')
		try {
			const cid = await pinFileToIPFS(file)
			updateFileCID({ ...fileCID, [type]: cid })
			if (dev) console.log('file cid', `${gateway}${cid}`)
		} catch (error) {
			console.log('Error uploading file: ', error)
		}
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
			const campaign_end = parseFloat(formData.duration) * data.blockFactor + block // take current block as offset
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
				(state) => {
					setLoading(false)
					setRefresh(true)
					updateBalance()			
				
					navigate("/app", { replace: true });

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
		<Grid container spacing={2} component="form">
			<Grid item xs={12}>
				<Typography align={'center'} variant="h3">
					Create Campaign {nonce}
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Divider clearing horizontal>
					<Typography>General Information</Typography>
				</Divider>
			</Grid>
			<Grid item xs={12}>
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
			<Grid item xs={12}>
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
					required
					value={formData.description}
					label="Campaign Description"
					placeholder="Tell us more about your idea..."
					name="description"
					onChange={handleOnChange}
				/>
			</Grid>

			<Grid item xs={12}>
				<Divider>Content</Divider>
			</Grid>

			{!fileCID && (
				[<Grid item xs={12} md={6}>
					{<Image16to9 alt="placeholder" src="https://picsum.photos/200" />}
				</Grid>,
				<Grid item xs={12} md={6}>
					{<Image16to9 alt="placeholder" src="https://picsum.photos/200" />}
				</Grid>]
			)}

			{fileCID && (
				[<Grid item xs={12} md={6}>
					{!fileCID.logo && <Image16to9 alt="placeholder" src="https://picsum.photos/200" />}
					{fileCID.logo && <Image16to9 alt={formData.title} src={gateway + fileCID.logo} />}
				</Grid>,
				<Grid item xs={12} md={6}>
					{!fileCID.header && <Image16to9 alt="placeholder" src="https://picsum.photos/200" />}
					{fileCID.header && <Image16to9 alt={formData.title} src={gateway + fileCID.header} />}
				</Grid>]
			)}

			<Grid item xs={12} md={6}>
				<input
					type={'file'}
					ref={logoGraphicInputRef}
					onChange={(e) => onFileChange(e, 'logo')}
					name={'logo'}
					style={{ position: 'fixed', left: '-999999px' }}
				/>
				<Button
					fullWidth
					variant={'outlined'}
					onClick={() => logoGraphicInputRef.current.click()}
				>
					Pick a logo graphic
				</Button>
			</Grid>
			<Grid item xs={12} md={6}>
				<input
					type={'file'}
					ref={headerGraphicInputRef}
					onChange={(e) => onFileChange(e, 'header')}
					name={'header'}
					style={{ position: 'fixed', left: '-999999px' }}
				/>
				<Button
					fullWidth
					variant={'outlined'}
					onClick={() => headerGraphicInputRef.current.click()}
				>
					Pick a header graphic
				</Button>
			</Grid>

			<Grid item xs={12}>
				<Divider>Campaign Page Custom Content Description (Markdown)</Divider>
				<hr/>
				<MarkdownEditor value={markdownValue} onChange={handleEditorChange} />
			</Grid>

			{/* legal body applying for the funding */}

			<Grid item xs={12}>
				<Divider>Public Representative</Divider>
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
				<Divider clearing horizontal>
					Campaign Settings
				</Divider>
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
			<Grid item xs={12}>
				<Button variant={'contained'} fullWidth onClick={handleSubmit}>
					Create Campaign
				</Button>
			</Grid>
		</Grid>
	)
}

export default function Module() {
	const apiProvider = useApiProvider()
	const { account } = useWallet()

	return apiProvider && account ? <Main /> : null
}
