import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import MuiSelect from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { web3FromSource } from '@polkadot/extension-dapp'
import { useApiProvider } from '@substra-hooks/core'
import faker from 'faker'
import React, { useEffect, useState } from 'react'
import { useWallet } from 'src/context/Wallet'
import config from '../../config'
import { data, rnd } from '../lib/data'
import { gateway, pinJSONToIPFS } from '../lib/ipfs'

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

const random_state = (account, campaigns = []) => {
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
	const proposer = account.address
	const beneficiary = account.address
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
	const { account, address } = useWallet()
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

	const getFromAcct = async (account) => {
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

	// form fields

	const handleOnChange = (e) => {
		const { name, value } = e.target
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
			const from = await getFromAcct(account)
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
		if (!account) return
		if (!refresh) return
		if (dev) console.log('refresh signal')
		updateFileCID(null)
		updateFormData(random_state(account))
		setRefresh(false)
		setLoading(false)
	}, [account, refresh])

	// const campaigns = availableCampaigns.map((c,i)=>{
	// 	return { key: data.orgs.length + i, text: c, value: data.orgs.length + i }
	// })
	// const entities = { ...data.orgs, ...campaigns }

	if (!formData) return null

	return (
		<React.Fragment>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<form>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Divider>General Information</Divider>
							</Grid>
							<Grid item xs={12}>
								<FormControl fullWidth>
									<InputLabel>Organization / Campaign</InputLabel>
									<MuiSelect
										required
										label="Organization / Campaign"
										fullWidth
										name="entity"
										value={formData.entity}
										onChange={handleOnChange}
									>
										{entities.map((e) => (
											<MenuItem key={e.key} value={e.value}>
												{e.text}
											</MenuItem>
										))}
									</MuiSelect>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<TextField
									name={'purpose'}
									label={'Proposal Title'}
									placeholder={'Title'}
									InputLabelProps={{ shrink: true }}
									value={formData.purpose}
									onChange={handleOnChange}
									fullWidth
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									multiline
									fullWidth
									label={'Short Description'}
									value={formData.description}
									placeholder={'Tell us more'}
									onChange={handleOnChange}
									name={'description'}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<FormControl fullWidth>
									<InputLabel>Voting Type</InputLabel>
									<MuiSelect
										label={'Voting Type'}
										name={'voting_types'}
										value={formData.voting_types}
										onChange={handleOnChange}
										fullWidth
									>
										{data.voting_types.map((vt) => (
											<MenuItem key={vt.key} value={vt.value}>
												{vt.text}
											</MenuItem>
										))}
									</MuiSelect>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={4}>
								<FormControl fullWidth>
									<InputLabel>Duration</InputLabel>
									<MuiSelect
										label={'Duration'}
										name={'duration'}
										value={formData.duration}
										onChange={handleOnChange}
										fullWidth
									>
										{data.project_durations.map((pd) => (
											<MenuItem key={pd.key} value={pd.value}>
												{pd.text}
											</MenuItem>
										))}
									</MuiSelect>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={4}>
								<FormControl fullWidth>
									<InputLabel>Collateral Type</InputLabel>
									<MuiSelect
										label={'Collateral Type'}
										name={'collateral_types'}
										value={formData.collateral_types}
										onChange={handleOnChange}
										fullWidth
									>
										{data.collateral_types.map((ct) => (
											<MenuItem key={ct.key} value={ct.value}>
												{ct.text}
											</MenuItem>
										))}
									</MuiSelect>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<TextField
									type={'number'}
									name={'collateral_amount'}
									value={formData.collateral_amount}
									onChange={handleOnChange}
									fullWidth
									label={'Collateral Amount'}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12}>
								<Divider>For withdrawals and grants</Divider>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									type={'number'}
									name={'amount'}
									value={formData.amount}
									onChange={handleOnChange}
									fullWidth
									label={'Amount to transfer on success'}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									type={'text'}
									name={'beneficiary'}
									value={formData.beneficiary}
									onChange={handleOnChange}
									fullWidth
									label={'Beneficiary Account'}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12}>
								<Button
									variant={'contained'}
									fullWidth
									color={'primary'}
									onClick={handleSubmit}
								>
									Publish Proposal
								</Button>
							</Grid>
						</Grid>
					</form>
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
