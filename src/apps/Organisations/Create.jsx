import React, { useEffect, useState } from 'react'
const steps = ['Select master blaster campaign settings', 'Create an ad group', 'Create an ad']
import { useWallet } from 'src/context/Wallet'
import { web3FromSource } from '@polkadot/extension-dapp'

import {
	Typography,
	TextField,
	FormGroup,
	Box,
	Button,
	Divider,
	Container,
	Stepper,
	Input,
	Step,
	Select,
	StepLabel,
	InputLabel,
	FormControl,
	MenuItem,
	TextareaAutosize,
	useFormControl,
} from '../../components'

import faker from 'faker'
import { data, rnd } from '../lib/data'
import config from '../../config'

import { pinJSONToIPFS, pinFileToIPFS, gateway } from '../lib/ipfs'

const dev = config.dev
if (dev) console.log('dev mode')

const random_state = (accountPair) => {
	const name = faker.commerce.productName()
	const email = faker.internet.email()
	const website = faker.internet.url()
	const repo = faker.internet.url()
	const description = faker.company.catchPhrase()

	const creator = accountPair.address
	const controller = accountPair.address
	const treasury = accountPair.address

	const body = 0
	const access = 0
	const member_limit = '10'
	const fee_model = 0
	const fee = '10'

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

	const { accountPair } = useWallet()
	// const [ status, setStatus ] = useState('')
	const [loading, setLoading] = useState(false)
	const [refresh, setRefresh] = useState(true)

	const [formData, updateFormData] = useState()
	const [fileCID, updateFileCID] = useState()
	const [content, setContent] = useState()
	// const [ contentCID, setContentCID ] = useState()

	// const [ submitState, setSubmitState ] = useState(0)

	// this is taken from txbutton

	const getFromAcct = async () => {
		const {
			address,
			meta: { source, isInjected },
		} = accountPair
		let fromAcct
		if (isInjected) {
			const injected = await web3FromSource(source)
			fromAcct = address
			apiProvider.setSigner(injected.signer)
		} else {
			fromAcct = accountPair
		}
		return fromAcct
	}

	// generator for the demo

	useEffect(() => {
		if (!accountPair) return
		if (dev) console.log('generate form data')
		const initial_state = random_state(accountPair)
		updateFormData(initial_state)
	}, [accountPair])

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
			...fileCID,
		}
		// if (dev) console.log(contentJSON)
		setContent(contentJSON)
	}, [fileCID, formData])

	// handle file uploads to ipfs

	async function onFileChange(e, { name }) {
		const file = e.target.files[0]
		if (dev) console.log('upload image')
		try {
			const cid = await pinFileToIPFS(file)
			updateFileCID({ ...fileCID, [name]: cid })
			if (dev) console.log('file cid', `${gateway}${cid}`)
		} catch (error) {
			console.log('Error uploading file: ', error)
		}
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

		//

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

		// send it

		const sendTX = async (cid) => {
			if (dev) console.log('2. send tx')

			const payload = [
				accountPair.address,
				formData.controller,
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
			const from = await getFromAcct()
			const tx = apiProvider.tx.gameDaoControl.create(...payload)
			const hash = await tx.signAndSend(from, ({ status, events }) => {
				if (events.length) {
					events.forEach((record) => {
						const { event } = record
						// const types = event.typeDef
						if (event.section === 'gameDaoControl' && event.method === 'BodyCreated') {
							console.log('body created:', hash)
							setRefresh(true)
						}
					})
				}
			})
		}

		getCID()
	}

	useEffect(() => {
		if (!refresh) return
		if (dev) console.log('refresh signal')
		updateFileCID(null)
		updateFormData(random_state(accountPair))
		setRefresh(false)
		setLoading(false)
	}, [accountPair, refresh])

	if (!formData) return null
	return (
		<Box
			component="form"
			sx={{
				'& > *': { m: 1 },
			}}
		>
			<Box sx={{ textAlign: 'center', width: '100%', my: 4 }}>
				<Typography variant="h3">Create Organization</Typography>
			</Box>

			<Box sx={{ width: '100%' }}>
				<Stepper activeStep={1} alternativeLabel>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
			</Box>

			<br />
			<Divider clearing horizontal>
				<Typography>General Information</Typography>
			</Divider>
			<br />

			<FormGroup
				sx={{
					gap: 2,
					my: 2,
				}}
			>
				<TextField
					label="Name"
					placeholder="Name"
					name="name"
					value={formData.name}
					onChange={handleOnChange}
					required
				/>
				<TextField
					label="Contact Email"
					placeholder="email"
					name="email"
					value={formData.email}
					onChange={handleOnChange}
				/>
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
			</FormGroup>

			{fileCID && (
				<>
					{fileCID.logo && <img alt={formData.name} src={gateway + fileCID.logo} />}
					{fileCID.header && <img alt={formData.name} src={gateway + fileCID.header} />}
				</>
			)}

			<FormGroup
				sx={{
					display: 'grid',
					gridTemplateColumns: { sm: '1fr 1fr' },
					gap: 2,
					my: 2,
				}}
			>
				<InputLabel id="logo-label">Logo Graphic</InputLabel>
				<Input
					labelId="logo-label"
					type="file"
					label="Logo Graphic"
					name="logo"
					onChange={onFileChange}
				/>
				<InputLabel id="header-gfx-label">Header Graphic</InputLabel>
				<Input
					labelId="header-gfx-label"
					type="file"
					label="Header Graphic"
					name="header"
					onChange={onFileChange}
				/>
			</FormGroup>

			<FormGroup
				sx={{
					display: 'grid',
					gridTemplateColumns: { sm: '1fr 1fr' },
					gap: 2,
					my: 2,
				}}
			>
				<InputLabel id="short-descr-label">Short Description</InputLabel>
				<TextareaAutosize
					aria-label="Short Description"
					minRows={3}
					placeholder="Minimum 3 rows"
					label="Short Description"
					name="description"
					value={formData.description}
					placeholder="Tell us more"
					onChange={handleOnChange}
				/>
			</FormGroup>

			<FormGroup
				sx={{
					display: 'grid',
					gridTemplateColumns: { sm: '1fr 1fr' },
					gap: 2,
					my: 2,
				}}
			>
				<TextField
					label="Website"
					placeholder="https://your.website.xyz"
					isInjected="website"
					name="website"
					value={formData.website}
					onChange={handleOnChange}
				/>
				<TextField
					label="Code Repository"
					placeholder="repo"
					id="repo"
					name="repo"
					value={formData.repo}
					onChange={handleOnChange}
				/>
			</FormGroup>

			<br />
			<Divider clearing horizontal>
				<Typography>Controller Settings</Typography>
			</Divider>
			<br />

			<Typography>
				Note: In case you want to create a DAO, the controller must be the organization.
			</Typography>

			<FormGroup
				sx={{
					display: 'grid',
					gridTemplateColumns: { sm: '1fr 1fr' },
					gap: 2,
					my: 2,
				}}
			>
				<TextField
					id="controller"
					name="controller"
					placeholder="Controller"
					label="Controller Account"
					value={formData.controller}
					onChange={handleOnChange}
					required
				/>
				<TextField
					id="treasury"
					name="treasury"
					placeholder="Treasury"
					label="Treasury Account"
					value={formData.treasury}
					onChange={handleOnChange}
					required
				/>
			</FormGroup>

			<FormGroup
				sx={{
					display: 'grid',
					gridTemplateColumns: { sm: '1fr 1fr' },
					gap: 2,
					my: 2,
				}}
			>
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
				<TextField
					id="member_limit"
					name="member_limit"
					placeholder="100"
					label="Member Limit"
					value={formData.member_limit}
					onChange={handleOnChange}
					required
				/>
			</FormGroup>

			<FormGroup
				sx={{
					display: 'grid',
					gridTemplateColumns: { sm: '1fr 1fr' },
					gap: 2,
				}}
			>
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
				<TextField
					id="fee"
					name="fee"
					label="Membership Fee"
					placeholder="10"
					value={formData.fee}
					onChange={handleOnChange}
					required
				/>
			</FormGroup>

			<Button fullWidth variant={'outlined'} onClick={handleSubmit}>
				Create Organization
			</Button>
		</Box>
	)
}

export default function Module(props) {
	const { accountPair } = useWallet()
	const apiProvider = useApiProvider()
	return apiProvider && apiProvider.query.gameDaoControl && accountPair ? (
		<Main {...props} />
	) : null
}
