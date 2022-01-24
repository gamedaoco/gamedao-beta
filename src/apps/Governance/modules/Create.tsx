import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useWallet } from 'src/context/Wallet'
import { useBlock } from 'src/hooks/useBlock'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useApiProvider } from '@substra-hooks/core'

import { gateway, pinJSONToIPFS } from '../../lib/ipfs'
import config from '../../../config'
import { blocksPerDay, data, proposal_types, voting_types } from '../../lib'

import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import MuiSelect from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { FormSectionHeadline, MarkdownEditor } from 'src/components'
import { useCrowdfunding } from '../../../hooks/useCrowdfunding'

const dev = config.dev

type GenericForm = {
	entity?: string
	campaign?: string
	title?: string
	description?: string
	cid?: string
	amount?: number
	duration?: number
	beneficiary?: string
	proposal_type?: number
	voting_type?: number
	collateral_type?: number
	collateral_amount?: number
	[key: string]: any
}

const INITIAL_STATE: GenericForm = {
	entity: '',
	campaign: '',
	title: '',
	description: '',
	cid: '',
	beneficiary: '',
	amount: 0,
	duration: 1,
	voting_type: 0,
	proposal_type: 0,
	collateral_type: 0,
	collateral_amount: 0,
}

// proposal (flow)
// 0.1 -> withdrawal votings
// 0.2 -> organisational votings
// 0.3 -> surveys

export const Main = () => {
	const apiProvider = useApiProvider()
	const blockNumber = useBlock()
	const { account, address, signAndNotify } = useWallet()
	const { bodies, bodyStates, queryMemberships, memberships } = useGameDaoControl()
	const { campaigns: campaignsList, campaignContributors } = useCrowdfunding()

	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)
	const [refresh, setRefresh] = useState(true)
	const [markdownState, setMarkdownState] = useState('')

	const [formData, updateFormData] = useState(INITIAL_STATE)
	const [fileCID, updateFileCID] = useState()
	const [content, setContent] = useState({})

	const [activeMemberships, setActiveMemberships] = useState(null)
	const [campaigns, setCampaigns] = useState([])

	useEffect(() => {
		if (!address) return
		queryMemberships(address)
	}, [address])

	useEffect(() => {
		if (formData.proposal_type !== 3) return
		if (formData.entity === '') return
		if (!apiProvider || !address) return

		console.log('query available campaigns for', bodies?.[formData.entity]?.name)

		const query = async () => {
			try {
				const [
					_cam,
					// owned,
					_con,
					_suc,
				] = await Promise.all([
					apiProvider.query.gameDaoCrowdfunding.campaignsByBody(formData.entity),
					// apiProvider.query.gameDaoCrowdfunding.campaignsOwnedArray(address),
					apiProvider.query.gameDaoCrowdfunding.campaignsContributed(address),
					apiProvider.query.gameDaoCrowdfunding.campaignsByState(3),
				])

				// console.log(
				// 	'campaigns', _cam.toHuman(),
				// 	// 'owned', owned.toHuman(),
				// 	'contributed', _con.toHuman(),
				// 	'successful', _suc.toHuman(),
				// )

				// get successful campaigns for a body
				const cam = _cam.toHuman() as any
				const suc = _suc.toHuman() as any
				const availableCampaigns = cam.filter((c) => suc.find((s) => c === s))

				// merge contributed and owned
				// const con = _con.toHuman() as any
				// const own = _own.toHuman() as any
				// const userCampaigns = own.concat(con.filter( c => own.find( o => c !== o ) )

				// const campaigns = new Array()
				// 	.concat(...(successful as any).toHuman())
				// 	// .filter((c) => c.org === formData.entity)
				// 	.map((h, i) => {
				// 		console.log('available campaigns', h)
				// 		return { key: i, text: h, value: h }
				// 	})

				const campaigns =
					availableCampaigns?.map((c, i) => {
						return {
							key: i,
							text: campaignsList?.[c].name ?? c,
							value: c,
						}
					}) ?? []

				// TODO: only contributed/owned
				// setCampaigns(availableCampaigns)
				setCampaigns(campaigns)
			} catch (err) {
				console.error(err)
			}
		}
		query()
	}, [apiProvider, address, formData.entity, formData.proposal_type])

	// form fields

	const handleOnChange = (e) => {
		const { name, value } = e.target
		const update = {
			...formData,
			[name]: value,
		}
		updateFormData(update)
	}

	const handleEntityChange = (e) => {
		const { name, value } = e.target
		const update = {
			...formData,
			campaign: null,
			[name]: value,
		}
		updateFormData(update)
	}

	// submit function

	const handleSubmit = (e) => {
		e.preventDefault()
		console.log('submit proposal')

		setLoading(true)
		const content = {
			id: formData.id,
			description: markdownState || '',
		}

		console.log('content', content)
		//	CID

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

			const expiry = formData.duration * blocksPerDay + start // take current block as offset
			const { entity, campaign, title, amount, proposal_type } = formData

			console.log('🚀 ~ file: Create.tsx ~ line 189 ~ sendTX ~ formData', formData)
			console.log('🚀 ~ file: Create.tsx ~ line 190 ~ sendTX ~ start', start)
			console.log('🚀 ~ file: Create.tsx ~ line 191 ~ sendTX ~ expiry', expiry)

			let query, payload

			console.log(proposal_type)

			switch (proposal_type) {
				case 0:
					query = apiProvider.tx.gameDaoGovernance.generalProposal
					payload = [entity, title, cid, start, expiry]
					break
				case 3:
					query = apiProvider.tx.gameDaoGovernance.withdrawProposal
					payload = [campaign, title, cid, amount, start, expiry]
					break
				default:
					new Error('Unknown proposal type!')
					break
			}

			console.log(query, payload)

			signAndNotify(
				query(...payload),
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
					// RES: Yes, we do
				}
			)
		}
	}

	useEffect(() => {
		if (!account) return
		if (!refresh) return
		if (dev) console.log('refresh')
		updateFileCID(null)
		// resetForm()
		setRefresh(false)
		setLoading(false)
		// redirect
	}, [account, refresh])

	useEffect(() => {
		if (!bodyStates || !memberships) return

		setActiveMemberships(
			(memberships?.[address] ?? []).filter((bodyHash) => bodyStates?.[bodyHash] === '1')
		)
	}, [bodyStates, memberships])

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
								<Divider>Context</Divider>
							</Grid>
							<Grid item xs={12} md={6}>
								<FormControl fullWidth>
									<InputLabel>Organisation</InputLabel>
									<MuiSelect
										required
										label="Organisation *"
										fullWidth
										name="entity"
										value={formData.entity}
										onChange={handleEntityChange}
										error={!formData.entity}
									>
										{activeMemberships?.map((e) => (
											<MenuItem key={e} value={e}>
												{bodies?.[e]?.name}
											</MenuItem>
										))}
									</MuiSelect>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={6}>
								<FormControl fullWidth>
									<InputLabel>Proposal Type</InputLabel>
									<MuiSelect
										label={'Proposal Type'}
										name={'proposal_type'}
										value={`${formData.proposal_type}`}
										onChange={handleOnChange}
										fullWidth
									>
										{proposal_types.map((pt) => (
											<MenuItem key={pt.key} value={pt.value}>
												{pt.text}
											</MenuItem>
										))}
									</MuiSelect>
								</FormControl>
							</Grid>

							<Grid item xs={12} md={6}>
								{formData.proposal_type === 3 && campaigns.length > 0 && (
									<FormControl fullWidth>
										<InputLabel>Campaign</InputLabel>
										<MuiSelect
											required
											disabled={!campaigns.length}
											label="Campaign"
											fullWidth
											name="campaign"
											value={formData.campaign}
											onChange={handleOnChange}
										>
											{campaigns &&
												campaigns.map((e, i) => (
													<MenuItem key={i} value={campaigns[i].value}>
														{campaigns[i].text}
													</MenuItem>
												))}
										</MuiSelect>
									</FormControl>
								)}
							</Grid>
							<Grid item xs={12}>
								<Divider>Proposal</Divider>
							</Grid>
							<Grid item xs={12}>
								<TextField
									name={'title'}
									label={'Proposal Title *'}
									placeholder={'Title'}
									value={formData.title}
									onChange={handleOnChange}
									error={
										formData.title?.length > 0 &&
										(!formData.title || formData.title.length <= 5)
									}
									fullWidth
								/>
							</Grid>
							<Grid item xs={12}>
								<FormSectionHeadline paddingTop={'0 !important'} variant={'h6'}>
									Content Description
								</FormSectionHeadline>

								<MarkdownEditor
									value={markdownState}
									onChange={({ _html, text }) => setMarkdownState(text)}
								/>
							</Grid>

							<Grid item xs={12} md={6}>
								<FormControl fullWidth>
									<InputLabel>Voting Type</InputLabel>
									<MuiSelect
										label={'Voting Type'}
										name={'voting_type'}
										value={`${formData.voting_type}`}
										onChange={handleOnChange}
										fullWidth
									>
										{voting_types.map((vt) => (
											<MenuItem key={vt.key} value={vt.value}>
												{vt.text}
											</MenuItem>
										))}
									</MuiSelect>
								</FormControl>
							</Grid>

							{formData.voting_type > 0 ? (
								<>
									<Grid item xs={12} md={3}>
										<FormControl fullWidth>
											<InputLabel>Collateral Type</InputLabel>
											<MuiSelect
												label={'Collateral Type'}
												name={'collateral_types'}
												value={`${formData.collateral_type}`}
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
								</>
							) : (
								<Grid item xs={12} md={6}></Grid>
							)}
							<Grid item xs={12} md={6}>
								<FormControl fullWidth>
									<InputLabel>Start (now)</InputLabel>
									<MuiSelect
										label={'Start'}
										name={'start'}
										value={0}
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

							{formData.proposal_type === 3 && (
								<>
									<Grid item xs={12}>
										<Divider>Transfer</Divider>
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
									size="large"
									onClick={handleSubmit}
									disabled={
										loading ||
										!formData.title ||
										formData.title.length <= 5 ||
										!formData.entity
									}
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
