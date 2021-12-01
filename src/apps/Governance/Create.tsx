import React, { useEffect, useState } from 'react'
import { useWallet } from 'src/context/Wallet'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useApiProvider } from '@substra-hooks/core'
import { gateway, pinJSONToIPFS } from '../lib/ipfs'
import config from '../../config'
import { data, rnd } from '../lib/data'

import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import MuiSelect from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { useNavigate } from 'react-router'

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
	proposal_type: number
	voting_type: number
	collateral_type: number
	collateral_amount: number
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
	const purpose = 'nice purpose'
	const description = 'cool description'
	const cid = ''
	const amount = rnd(10) * 100
	const duration = Number(data.project_durations[rnd(data.project_durations.length)].value)
	const proposer = account.address
	const beneficiary = account.address
	const voting_type = 0
	const proposal_type = 0
	const collateral_type = 0
	const collateral_amount = 1

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
		voting_type,
		proposal_type,
		collateral_type,
		collateral_amount,
	}
	return gen
}

// proposal (flow)
// 0.1 -> withdrawal votings
// 0.2 -> organisational votings
// 0.3 -> surveys

export const Main = ({ blockNumber }) => {
	const apiProvider = useApiProvider()
	const { account, address, signAndNotify } = useWallet()

	const [loading, setLoading] = useState(false)
	const [refresh, setRefresh] = useState(true)

	const [formData, updateFormData] = useState({} as GenericForm)
	const [fileCID, updateFileCID] = useState()
	const [content, setContent] = useState({})
	const navigate = useNavigate()

	const { bodies, queryMemberships, memberships } = useGameDaoControl()

	useEffect(() => {
		if (!address) return

		queryMemberships(address)
	}, [address])

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

		const sendTX = async (cid) => {
			if (dev) console.log('2. send tx')
			setLoading(true)

			const start = blockNumber // current block as start block
			console.log('🚀 ~ file: Create.tsx ~ line 184 ~ sendTX ~ start', start)

			// ToDo: Increase backend max proposal time limit of 60480 - else the request will ALWAYS fail
			const expiry = /* formData.duration * data.blockFactor */ 60480 + start // take current block as offset
			console.log('🚀 ~ file: Create.tsx ~ line 185 ~ sendTX ~ expiry', expiry)
			const { entity, purpose } = formData
			console.log('🚀 ~ file: Create.tsx ~ line 166 ~ sendTX ~ formData', formData)

			const payload = [entity, purpose, cid, start, expiry]

			signAndNotify(
				apiProvider.tx.gameDaoGovernance.generalProposal(...payload),
				{
					pending: 'Proposal creation in progress',
					success: 'Proposal created',
					error: 'Proposal creation failed',
				},
				(state, result) => {
					setLoading(false)
					setRefresh(true)

					if (state) {
						result.events.forEach(({ event: { data, method, section } }) => {
							if (section === 'gameDaoGovernance' && method === 'Proposal') {
								navigate(`/app/governance/${data[1].toHex()}`)
							}
						})
					}

					// TODO: 2075 Do we need error handling here if false?
				}
			)
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
										{(memberships?.[address] ?? []).map((e) => (
											<MenuItem key={e} value={e}>
												{bodies?.[e]?.name}
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
							<Grid item xs={12} md={3}>
								<FormControl fullWidth>
									<InputLabel>Proposal Type</InputLabel>
									<MuiSelect
										label={'Proposal Type'}
										name={'proposal_type'}
										value={formData.proposal_type}
										onChange={handleOnChange}
										fullWidth
									>
										{data.proposal_types.map((pt) => (
											<MenuItem key={pt.key} value={pt.value}>
												{pt.text}
											</MenuItem>
										))}
									</MuiSelect>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={3}>
								<FormControl fullWidth>
									<InputLabel>Voting Type</InputLabel>
									<MuiSelect
										label={'Voting Type'}
										name={'voting_type'}
										value={formData.voting_type}
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
							<Grid item xs={12} md={3}>
								<FormControl fullWidth>
									<InputLabel>Collateral Type</InputLabel>
									<MuiSelect
										label={'Collateral Type'}
										name={'collateral_types'}
										value={formData.collateral_type}
										onChange={handleOnChange}
										fullWidth
									>
										{data.collateral_types.map((ct, i) => (
											<MenuItem key={ct.key} value={ct.value}>
												{ct.text}
											</MenuItem>
										))}
									</MuiSelect>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={3}>
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
							<Grid item xs={12} md={6}>
								<FormControl fullWidth>
									<InputLabel>Start (now)</InputLabel>
									<MuiSelect
										label={'Start'}
										name={'start'}
										value={formData.start}
										onChange={handleOnChange}
										fullWidth
										disabled
									>
										<MenuItem key={1} value={0}>
											now
										</MenuItem>
									</MuiSelect>
								</FormControl>
							</Grid>

							<Grid item xs={12} md={6}>
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

							{formData.proposal_type !== 0 && (
								<>
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
								</>
							)}
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

export default function Module({ blockNumber }) {
	const apiProvider = useApiProvider()
	return apiProvider && apiProvider.query.gameDaoGovernance ? (
		<Main blockNumber={blockNumber} />
	) : null
}

//
//
//
