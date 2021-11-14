import React, { useEffect, useState } from 'react'

import { useWallet } from 'src/context/Wallet'
import { web3FromSource } from '@polkadot/extension-dapp'

// import { Container, Form, Divider, Segment, Image, Button, Radio } from 'semantic-ui-react'

import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Form from '@mui/material/Stack'

// selekta
import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'

import faker from 'faker'
import { data, rnd } from '../lib/data'
import config from '../../config'

import { pinJSONToIPFS, pinFileToIPFS, gateway } from '../lib/ipfs'
import { useApiProvider } from '@substra-hooks/core'

const dev = config.dev
if (dev) console.log('dev mode')

type GenericForm = {
	id: string
	purpose: string
	description: string
	cid: string
	amount: number
	duration: number
	proposer: string
	beneficiary: string
	voting_types: number
	[key: string]: any
}

const random_state = (accountPair, campaigns = []) => {
	// version 0.1
	// get a random campaign id
	// create a random purpose
	// create random voting duration from 7, 14, 30, 60 days
	// create random amount to pay
	// or
	// voting without withdrawal ==> amount == 0

	const id = campaigns[campaigns.length]
	const purpose = faker.company.catchPhrase()
	const description = faker.company.catchPhrase()
	const cid = ''
	const amount = rnd(10) * 100
	const duration = Number(data.project_durations[rnd(data.project_durations.length)].value)
	const proposer = accountPair.address
	const beneficiary = accountPair.address
	const voting_types = data.voting_types[rnd(data.voting_types.length)].value

	// TODO:
	// version > 0.2
	// create random additional data for ipfs
	// for proofs, extra info
	// select asset for withdrawal

	const gen: GenericForm = {
		id,
		purpose,
		description,
		cid,
		amount,
		duration,
		proposer,
		beneficiary,
		voting_types,
	}
	return gen
}

// proposal (flow)
// 0.1 -> withdrawal votings
// 0.2 -> organisational votings
// 0.3 -> surveys

export const Main = () => {
	const apiProvider = useApiProvider()

	const { accountPair, address } = useWallet()
	const [block, setBlock] = useState(0)

	const [loading, setLoading] = useState(false)
	const [refresh, setRefresh] = useState(true)

	const [formData, updateFormData] = useState({} as GenericForm)
	const [fileCID, updateFileCID] = useState()
	const [content, setContent] = useState({})

	// campaign or organisation?
	// user can choose whatever he belongs to.
	const [entities, setEntities] = useState([])

	useEffect(() => {
		if (!apiProvider || !address) return

		const query = async () => {
			try {
				const [memberships, contributions, successful] = await Promise.all([
					apiProvider.query.gameDaoControl.memberships(address),
					apiProvider.query.gameDaoCrowdfunding.campaignsContributed(address),
					apiProvider.query.gameDaoCrowdfunding.campaignsByState(3),
				])
				const new_entities = new Array()
					// .concat(...memberships.toHuman())
					.concat(...(contributions as any).toHuman())
					.concat(...(successful as any).toHuman())
					.map((h, i) => {
						return { key: i, text: h, value: h }
					})
				setEntities(new_entities)
			} catch (err) {
				console.error(err)
			}
		}
		query()
	}, [apiProvider, address])

	//
	//
	//

	const getFromAcct = async (accountPair) => {
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

	// form fields

	const handleOnChange = (e, { name, value }) => {
		const update = {
			...formData,
			[name]: value,
		}
		updateFormData(update)
	}

	// submit function

	const handleSubmit = (e) => {
		e.preventDefault()
		console.log('submit')

		setLoading(true)
		const content = {
			id: formData.id,
			description: formData.description,
		}

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
		getCID()

		// send it

		const sendTX = async (args) => {
			if (dev) console.log('2. send tx')

			const expiry = formData.duration * data.blockFactor + block // take current block as offset
			const { voting_type, id, purpose, cid, amount } = formData

			const payload = [voting_type, id, purpose, cid, amount, expiry]
			const from = await getFromAcct(accountPair)
			// TODO: refactor to have unified method name on module...
			const tx = apiProvider.tx.gameDaoGovernance.createProposal(...payload)
			const hash = await tx.signAndSend(from, ({ status, events }) => {
				if (events.length) {
					events.forEach((record) => {
						const { event } = record
						// const types = event.typeDef
						if (
							event.section === 'gameDaoGovernance' &&
							event.method === 'ProposalCreated'
						) {
							console.log('proposal created:', hash)
							setRefresh(true)
						}
					})
				}
			})
		}
	}

	useEffect(() => {}, [])

	useEffect(() => {
		if (!accountPair) return
		if (!refresh) return
		if (dev) console.log('refresh signal')
		updateFileCID(null)
		updateFormData(random_state(accountPair))
		setRefresh(false)
		setLoading(false)
	}, [accountPair, refresh])

	// const campaigns = availableCampaigns.map((c,i)=>{
	// 	return { key: data.orgs.length + i, text: c, value: data.orgs.length + i }
	// })
	// const entities = { ...data.orgs, ...campaigns }

	const SelectBox = ({ value, handleOnChange, label, options }) => {
		const ref = `${value.text}-label`
		return (
			<FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
				<InputLabel id={ref}>Age</InputLabel>
				<Select labelId={ref} value={value} onChange={handleOnChange} label="Age">
					<MenuItem value={null}></MenuItem>
					{options.map((item, index) => {
						;<MenuItem key={item.key} value={item.value}>
							{item.text}
						</MenuItem>
					})}
				</Select>
			</FormControl>
		)
	}

	// if (!formData) return null

	return (
		<React.Fragment>
			<Grid container spacing={2}>
				<Grid item>
					<Typography component="h2" variant="h3">
						General Information
					</Typography>
				</Grid>

				<Grid item>
					{/*
					<Form>
					<Select
						fluid
						required
						label="Organization / Campaign"
						placeholder="Please select"
						name="entity"
						options={entities}
						value={formData.entity}
						onChange={handleOnChange}
					/>

					<Group widths="equal">
						<Input fluid label="Proposal Title" placeholder="Title" name="purpose" value={formData.purpose} onChange={handleOnChange} required />
					</Group>

					<Group widths="equal">
						<TextArea
							label="Short Description"
							name="description"
							value={formData.description}
							placeholder="Tell us more"
							onChange={handleOnChange}
						/>
					</Group>

					<Group widths="equal">
						<Select
							fluid
							label="Voting Type"
							options={data.voting_types}
							name="voting_types"
							value={formData.voting_types}
							onChange={handleOnChange}
						/>
						<Select
							fluid
							label="Proposal Duration"
							options={data.project_durations}
							placeholder="Duration"
							name="duration"
							value={formData.duration}
							onChange={handleOnChange}
						/>
					</Group>

					<Group widths="equal">
						<Select
							fluid
							disabled
							label="Collateral Type"
							options={data.collateral_types}
							name="collateral_types"
							value={formData.collateral_types}
							onChange={handleOnChange}
						/>
						<Input
							fluid
							type="number"
							label="Collateral Amount"
							placeholder="amount"
							name="collateral_amount"
							value={formData.collateral_amount}
							onChange={handleOnChange}
							required
						/>
					</Group>

					<Divider clearing horizontal>
						For Withdrawals and Grants
					</Divider>

					<Group widths="equal">
						<Input
							fluid
							label="Amount to transfer on success"
							placeholder="amount"
							name="amount"
							value={formData.amount}
							onChange={handleOnChange}
						/>
						<Input
							fluid
							label="Beneficiary Account"
							placeholder="Beneficiary"
							name="beneficiary"
							value={formData.beneficiary}
							onChange={handleOnChange}
							required
						/>
					</Group>


					</Form>
				*/}
				</Grid>

				<Grid>
					<Button onClick={handleSubmit}>Publish Proposal</Button>
				</Grid>
			</Grid>
		</React.Fragment>
	)
}

export default function Module() {
	const apiProvider = useApiProvider()
	return apiProvider && apiProvider.query.gameDaoGovernance ? <Main /> : null
}

//
//
//
