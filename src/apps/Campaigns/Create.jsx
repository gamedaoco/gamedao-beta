import React, { useEffect, useState } from 'react'
import { web3FromSource } from '@polkadot/extension-dapp'

import { Container, Button, Divider, FormGroup, FormControl, MenuItem, Select, Checkbox, Box, TextField, Typography, InputLabel, TextareaAutosize } from '../../components'

import { data, rnd } from '../lib/data'
import config from '../../config'

import { pinJSONToIPFS, pinFileToIPFS, gateway } from '../lib/ipfs'
import { useWallet } from 'src/context/Wallet'
import { useApiProvider } from '@substra-hooks/core'

const dev = config.dev

const random_state = (account) => {
	const name = 'Examplename'
	const email = 'mail@example.com'
	const title = 'Cool Prductname'
	const description = 'Even cooler catchphrase (very funny)'
	const country = data.countries[rnd(data.countries.length)].value
	const entity = data.project_entities[rnd(data.project_entities.length)].value
	const usage = data.project_types[rnd(data.project_types.length)].value
	const accept = false
	const cap = rnd(100000)
	const deposit = rnd(100)
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
	const apiProvider = useApiProvider()
	const { account, finalized } = useWallet()
	const [block, setBlock] = useState(0)
	const [nonce, updateNonce] = useState(0)
	const [orgHashes, updateOrgHashes] = useState([])
	const [orgs, updateOrgs] = useState([])

	const [formData, updateFormData] = useState()
	const [fileCID, updateFileCID] = useState()
	const [content, setContent] = useState()

	const [loading, setLoading] = useState(false)
	const [refresh, setRefresh] = useState(true)

	const getFromAcct = async () => {
		const {
			address,
			meta: { source, isInjected },
		} = account
		let fromAcct
		if (isInjected) {
			const injected = await web3FromSource(source)
			fromAcct = address
			apiProvider.setSigner(injected.signer)
		} else {
			fromAcct = account
		}
		return fromAcct
	}

	const bestBlock = finalized
		? apiProvider.derive.chain.bestNumberFinalized
		: apiProvider.derive.chain.bestNumber

	useEffect(() => {
		let unsubscribe = null
		apiProvider.query.gameDaoCrowdfunding
			.nonce((n) => {
				if (n.isNone) {
					updateNonce(0)
				} else {
					updateNonce(n.toNumber())
				}
			})
			.then((unsub) => {
				unsubscribe = unsub
			})
			.catch(console.error)
		return () => unsubscribe && unsubscribe()
	}, [apiProvider.query.gameDaoCrowdfunding])

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

	//

	useEffect(() => {
		let unsubscribe = null
		apiProvider.query.gameDaoControl
			.controlledBodies(account.address, (b) => {
				if (b.isNone || b.length === 0) return
				const hashes = [...new Set(b.toHuman().map((_) => _))]
				updateOrgHashes(hashes)
				console.log(hashes)
			})
			.then((unsub) => {
				unsubscribe = unsub
			})
			.catch(console.error)
		return () => unsubscribe && unsubscribe()
	}, [account, apiProvider.query.gameDaoControl])

	//

	useEffect(() => {
		if (orgHashes.length === 0) return
		const req = [...orgHashes]
		const query = async (args) => {
			const res = await apiProvider.query.gameDaoControl.bodies
				.multi(req)
				.then((_) => _.map((_h) => _h.toHuman()))
			const _ = res.map((body, i) => {
				const org = {
					key: i,
					value: body.id,
					text: body.name,
				}
				return org
			})
			updateOrgs(_)
		}
		query()
	}, [orgHashes, account, apiProvider.query.gameDaoControl])

	useEffect(() => {
		if (orgs.length === 0) return
		const initial_state = random_state(account)
		updateFormData(initial_state)
	}, [orgs, account])

	// handle form state

	const handleOnChange = (e, { name, value }) => updateFormData({ ...formData, [name]: value })

	useEffect(() => {
		if (!formData) return
		if (dev) console.log('update content json')
		const contentJSON = {
			name: formData.name,
			email: formData.email,
			title: formData.title,
			description: formData.description,
			...fileCID,
		}
		// if (dev) console.log(contentJSON)
		setContent(contentJSON)
	}, [fileCID, formData])

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

	// submit

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

		//

		const sendTX = async (cid) => {
			const campaign_end = dev
				? block + 100 // 100 blocks = 300 seconds = 5 mins
				: formData.duration * data.blockFactor + block // take current block as offset
			console.log('campaign_end', campaign_end)

			console.log()
			const target = formData.cap + 1000000000000
			const deposit = formData.deposit + 1000000000000

			const payload = [
				// account.address,
				formData.org,
				formData.admin,
				formData.title,
				target,
				deposit,
				campaign_end,
				formData.protocol,
				formData.governance === true ? 1 : 0,
				cid,
				'PLAY',
				'Play Coin',
			]
			console.log('payload', payload)

			const from = await getFromAcct()
			const tx = apiProvider.tx.gameDaoCrowdfunding.create(...payload)
			const hash = await tx.signAndSend(from, ({ status, events }) => {
				if (events.length) {
					events.forEach((record) => {
						const { event } = record
						// const types = event.typeDef
						if (
							event.section === 'gameDaoCrowdfunding' &&
							event.method === 'CampaignCreated'
						) {
							console.log('campaign created:', hash)
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
		updateFormData(random_state(account))
		setRefresh(false)
		setLoading(false)
	}, [account, refresh])

	if (!formData) return null

	return (
		<>
			<Box
				component="form"
				sx={{
					'& > *': { m: 1 },
				}}
			>
				<Box sx={{ textAlign: 'center', width: '100%', my: 4 }}>
					<Typography variant="h3">Create Campaign {nonce}</Typography>
				</Box>
				<br />
				<Divider clearing horizontal>
					<Typography>General Information</Typography>
				</Divider>
				<br />

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
						{orgs.map((item) => (
							<MenuItem key={item.key} value={item.value}>
								{item.text}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<TextField
					fluid
					required
					label="Campaign name"
					placeholder="Campaign name"
					name="title"
					value={formData.title}
					onChange={handleOnChange}
				/>

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
					name="description"
					value={formData.description}
					label="Campaign Description"
					placeholder="Tell us more about your idea..."
					name="description"
					value={formData.description}
					onChange={handleOnChange}
				/>
			</FormGroup>
				<br />
				<Divider clearing horizontal>
					Content
				</Divider>
				<br />

				{fileCID && (
					<Box size="tiny">
						{fileCID.logo && (
							<img alt={formData.title} src={gateway + fileCID.logo} />
						)}
						{fileCID.header && (
							<img alt={formData.title} src={gateway + fileCID.header} />
						)}
					</Box>
				)}

				<FormGroup widths="equal">
					<TextField
						type="file"
						label="Logo Graphic"
						name="logo"
						onChange={onFileChange}
					/>
					<TextField
						type="file"
						label="Header Graphic"
						name="header"
						onChange={onFileChange}
					/>
				</FormGroup>

				{/* legal body applying for the funding */}

				<br />
				<Divider clearing horizontal>
					Public Representative
				</Divider>
				<br />

				<FormGroup widths="equal">
					<TextField
						fluid
						label="Name"
						placeholder="Name"
						name="name"
						value={formData.name}
						onChange={handleOnChange}
					/>
					<TextField
						fluid
						label="Email"
						placeholder="Email"
						name="email"
						value={formData.email}
						onChange={handleOnChange}
					/>
				</FormGroup>

				<br />
				<Divider clearing horizontal>
					Campaign Settings
				</Divider>
				<br />

				<Container>
					This section is already covered during org creation, currently only a
					placeholder / reminder.
				</Container>

				<FormGroup
					sx={{
						display: 'grid',
						gridTemplateColumns: { sm: '1fr 1fr' },
						gap: 2,
						my: 2,
					}}
				>
					<FormControl>
						<InputLabel id="entity-select-label">Legal Entity</InputLabel>
						<Select
							labelId="entity-select-label"
							id="entity"
							required
							fluid
							label="Legal Entity"
							placeholder="Legal Entity"
							name="entity"
							value={formData.entity}
							onChange={handleOnChange}
						>
							{data.project_entities.map((item) => (
								<MenuItem key={item.key} value={item.value}>
									{item.text}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl>
						<InputLabel id="country-select-label">Country</InputLabel>
						<Select
							labelId="country-select-label"
							id="country"
							required
							label="Country"
							name="country"
							placeholder="Country"
							value={formData.country}
							onChange={handleOnChange}
						>
							{data.countries.map((item) => (
								<MenuItem key={item.key} value={item.value}>
									{item.text}
								</MenuItem>
							))}
						</Select>
					</FormControl>

				</FormGroup>


				<br />
				<Divider clearing horizontal></Divider>
				<br />
				{/* usage of funding and protocol to initiate after successfully raising */}

				<FormGroup widths="equal">
					<TextField
						fluid
						label="Admin Account"
						placeholder="Admin"
						name="admin"
						value={formData.admin}
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
					<FormControl>
						<InputLabel id="usage-select-label">Usage of funds</InputLabel>
						<Select
							labelId="usage-select-label"
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
					<FormControl>
						<InputLabel id="protocol-select-label">Protocol</InputLabel>
						<Select
							labelId="protocol-select-label"
							id="protocol"
							required
							fluid
							name="protocol"
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

				</FormGroup>

				<FormGroup widths="equal">
					<TextField
						fluid
						label="Deposit (PLAY)"
						placeholder="Deposit"
						name="deposit"
						value={formData.deposit}
						onChange={handleOnChange}
					/>

					<TextField
						fluid
						label="Funding Target (PLAY)"
						placeholder="Cap"
						name="cap"
						value={formData.cap}
						onChange={handleOnChange}
					/>

					<FormControl>
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
				</FormGroup>

				<Checkbox
					label="DAO Governance"
					name="governance"
					checked={formData.governance}
					onChange={handleOnChange}
				/>
				<Checkbox
					label="I agree to the Terms and Conditions"
					name="accept"
					checked={formData.accept}
					onChange={handleOnChange}
				/>

				<Container textAlign="right">
					<Button onClick={handleSubmit}>Create Campaign</Button>
				</Container>
			</Box>
		</>
	)
}

export default function Module() {
	const apiProvider = useApiProvider()
	const { account } = useWallet()

	return apiProvider && account ? <Main /> : null
}

//
//
//
