import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import { useNavigate } from 'react-router'
import { useWallet } from 'src/context/Wallet'
import { useBlock } from 'src/hooks/useBlock'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useApiProvider } from '@substra-hooks/core'

import { gateway, pinJSONToIPFS } from '../../lib/ipfs'
import config from '../../../config'
import { blocksPerDay, data, proposal_types, voting_types } from '../../lib'
import { rnd } from '../../lib/data'

import { useDebouncedCallback } from 'src/hooks/useDebouncedCallback'

import { 
	Button,
	Divider,
	FormControl, 
	Grid, 
	InputLabel, 
	MenuItem, 
	Select, 
	TextField,
	FormSectionHeadline, 
	MarkdownEditor,
	FormHelperText,
	Loader
} from "src/components"


const dev = config.dev

const random_state = (account, campaigns = []) => {
	// version 0.1
	// get a random campaign id
	// create a random purpose
	// create random voting duration from 7, 14, 30, 60 days
	// create random amount to pay
	// or
	// voting without withdrawal ==> amount == 0

	const id = campaigns[campaigns.length]
	const purpose = ''
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

/*
	id: string
	purpose: string
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
*/

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

	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)
	const [refresh, setRefresh] = useState(true)

	const [initialState, setInitialState]	= useState()
	const [persistedData, setPersistedData] = useState()

	const [fileCID, updateFileCID] = useState()
	const [markdownValue, setMarkdownValue] = useState("# gamedao")

	//const [formData, updateFormData] = useState(INITIAL_STATE)

	const [activeMemberships, setActiveMemberships] = useState(null)
	const [campaigns, setCampaigns] = useState([])

	function handleMarkdownChange({ html, text }) {
		setMarkdownValue(text)
	}

	useEffect(() => {
		if (!address) return
		queryMemberships(address)
	}, [address])

	useEffect(() => {
		if (!account) return
		const ls =  localStorage.getItem("gamedao-form-create-governance")
		const mls = localStorage.getItem("gamedao-markdown-create-governance")
		if(mls){
			setMarkdownValue(mls)
		}
		if(ls){
			setPersistedData(JSON.parse(ls))
		}
		//@ts-ignore
		setInitialState(INITIAL_STATE)
	}, [account])


	// form fields

	/*
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
	*/

	// submit function

	const handleSubmit = (values, form) => {
		console.log('submit proposal')

		setLoading(true)
		console.log(values)

		const content = {
			id: values.id,
			description: markdownValue
		}

		console.log('content', content)
		//	CID

		const getCID = async () => {
			if (dev) console.log('1. upload content json')
			try {
				// TODO: pin...
				const cid = await pinJSONToIPFS(content)
				if (cid) {
					// setMarkdownValueCID(cid)
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

			const expiry = formik.values.duration * blocksPerDay + start // take current block as offset
			const { entity, campaign, title, amount, proposal_type } = formik.values

			console.log('🚀 ~ file: Create.tsx ~ line 189 ~ sendTX ~ formData', formik.values)
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

						// clear localstorage
						localStorage.removeItem("gamedao-form-create-governance")
					}

					// TODO: 2075 Do we need error handling here if false?
					// RES: Yes, we do
				},
			)
		}
	}

	useEffect(() => {}, [])

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: INITIAL_STATE,
		validate: (values) => {
			//setStepperState(1)
			const errors:Partial<GenericForm> = {}
			//console.log(values)

			if(!values.purpose || values.purpose === "") errors.purpose = "You must have a purpose."


			return errors
		},
		//validationSchema: validationSchema,
		onSubmit: handleSubmit
	});

	// campaign or organisation?
	// user can choose whatever he belongs to.
	const [entities, setEntities] = useState([])

	useEffect(() => {
		if (formik.values.proposal_type !== 3) return
		if (formik.values.entity === '') return
		if (!apiProvider || !address) return

		console.log('query available campaigns for', bodies?.[formik.values.entity]?.name)

		const query = async () => {

			try {
				const [
					_cam,
					// owned,
					_con,
					_suc,
				] = await Promise.all([
					apiProvider.query.gameDaoCrowdfunding.campaignsByBody(formik.values.entity),
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
				/* @ts-ignore */
				const cam = _cam.toHuman() as any
				/* @ts-ignore */
				const suc = _suc.toHuman() as any
				const availableCampaigns = cam.filter(c => suc.find(s => c === s))

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

				const campaigns = availableCampaigns?.map(
					(c, i) => ({
						key: i, text: c, value: c,
					}),
				) ?? []

				console.log('availableCampaigns', availableCampaigns)
				console.log('campaigns', campaigns)

				// TODO: only contributed/owned
				// setCampaigns(availableCampaigns)
				setCampaigns(campaigns)

			} catch (err) {
				console.error(err)
			}

		}
		query()

	}, [apiProvider, address, formik.values.entity, formik.values.proposal_type])

	useEffect(() => {
		if (!account) return
		if (!refresh) return
		if (dev) console.log('refresh')
		updateFileCID(null)
		// updateFormData(random_state(account))
		// resetForm()
		setRefresh(false)
		setLoading(false)
		// redirect
	}, [account, refresh])


	useEffect(() => {
		if (!bodyStates || !memberships) return

		setActiveMemberships(
			(memberships?.[address] ?? []).filter((bodyHash) => bodyStates?.[bodyHash] === '1'),
		)
	}, [bodyStates, memberships])


	// const campaigns = availableCampaigns.map((c,i)=>{
	// 	return { key: data.orgs.length + i, text: c, value: data.orgs.length + i }
	// })
	// const entities = { ...data.orgs, ...campaigns }

	if (!formik || !formik.values) return <Loader text="Create Proposal"/>

	return (
		<React.Fragment>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<form onSubmit={formik.handleSubmit}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Divider>Context</Divider>
							</Grid>
							<Grid item xs={12} md={6}>
								<FormControl fullWidth error={formik.touched.entity && Boolean(formik.errors.entity)}>
									<InputLabel>Organisation</InputLabel>
									<Select
										required
										label='Organisation *'
										fullWidth
										name="entity"
										value={formik.values.entity}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									>
										{activeMemberships?.map((e) => (
											<MenuItem key={e} value={e}>
												{bodies?.[e]?.name}
											</MenuItem>
										))}
									</Select>
									<FormHelperText>{formik.touched.entity && formik.errors.entity}</FormHelperText>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={6}>
								<FormControl fullWidth error={formik.touched.proposal_type && Boolean(formik.errors.proposal_type)}>
									<InputLabel>Proposal Type</InputLabel>
									<Select
										label={'Proposal Type'}
										name={'proposal_type'}
										value={`${formik.values.proposal_type}`}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										fullWidth
									>
										{proposal_types.map((pt) => (
											<MenuItem key={pt.key} value={pt.value}>
												{pt.text}
											</MenuItem>
										))}
									</Select>
									<FormHelperText>{formik.touched.proposal_type && formik.errors.proposal_type}</FormHelperText>
								</FormControl>
							</Grid>
	
							<Grid item xs={12} md={6}>
								{formik.values.proposal_type === 3 && campaigns.length > 0 &&
									<FormControl fullWidth error={formik.touched.campaign && Boolean(formik.errors.campaign)}>
										<InputLabel>Campaign</InputLabel>
										<Select
											required
											disabled={!campaigns.length}
											label='Campaign'
											fullWidth
											name='campaign'
											value={formik.values.campaign}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										>
											{campaigns && campaigns.map((e, i) => (
												<MenuItem key={i} value={campaigns[i].value}>
													{campaigns[i].text}
												</MenuItem>
											))}
										</Select>
										<FormHelperText>{formik.touched.campaign && formik.errors.campaign}</FormHelperText>
									</FormControl>
								}
							</Grid>

							<Grid item xs={12}>
								<Divider>Proposal</Divider>
							</Grid>

							<Grid item xs={12}>
								<TextField
									name={'title'}
									label={'Proposal Title'}
									placeholder={'Title'}
									value={formik.values.title}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={formik.touched.title && Boolean(formik.errors.title)}
									helperText={formik.touched.title && formik.errors.title}
									fullWidth
								/>
							</Grid>
		
							<Grid item xs={12}>
								<FormSectionHeadline paddingTop={'0 !important'} variant={'h6'}>
									Content Description
								</FormSectionHeadline>

								<MarkdownEditor
									value={markdownValue}
									onChange={handleMarkdownChange}
								/>
							</Grid>

							<Grid item xs={12} md={6}>
								<FormControl fullWidth error={formik.touched.voting_type && Boolean(formik.errors.voting_type)}>
									<InputLabel>Voting Type</InputLabel>
									<Select
										label={'Voting Type'}
										name={'voting_type'}
										value={`${formik.values.voting_type}`}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										fullWidth
									>
										{voting_types.map((vt) => (
											<MenuItem key={vt.key} value={vt.value}>
												{vt.text}
											</MenuItem>
										))}
									</Select>
									<FormHelperText>{formik.touched.voting_type && formik.errors.voting_type}</FormHelperText>
								</FormControl>
							</Grid>

							{formik.values.voting_type > 0

								? <>
									<Grid item xs={12} md={3}>
										<FormControl fullWidth error={formik.touched.collateral_type && Boolean(formik.errors.collateral_type)}>
											<InputLabel>Collateral Type</InputLabel>
											<Select
												label={'Collateral Type'}
												name={'collateral_type'}
												value={`${formik.values.collateral_type}`}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												fullWidth
											>
												{data.collateral_types.map((ct, i) => (
													<MenuItem key={ct.key} value={ct.value}>
														{ct.text}
													</MenuItem>
												))}
											</Select>
											<FormHelperText>{formik.touched.collateral_type && formik.errors.collateral_type}</FormHelperText>
										</FormControl>
									</Grid>

									<Grid item xs={12} md={3}>
										<TextField
											type={'number'}
											name={'collateral_amount'}
											value={formik.values.collateral_amount}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											error={formik.touched.collateral_amount && Boolean(formik.errors.collateral_amount)}
											helperText={formik.touched.collateral_amount && formik.errors.collateral_amount}
											fullWidth
											label={'Collateral Amount'}
											InputLabelProps={{ shrink: true }}
										/>
									</Grid>
								</>
								: <Grid item xs={12} md={6}></Grid>
							}
							<Grid item xs={12} md={6}>
								<FormControl fullWidth error={formik.touched.start && Boolean(formik.errors.start)}>
									<InputLabel>Start (now)</InputLabel>
									<Select
										label={'Start'}
										name={'start'}
										value={formik.values.start}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										fullWidth
										disabled
									>
										<MenuItem key={1} value={0}>
											now
										</MenuItem>
									</Select>
									<FormHelperText>{formik.touched.start && formik.errors.start}</FormHelperText>
								</FormControl>
							</Grid>

							<Grid item xs={12} md={6}>
								<FormControl fullWidth error={formik.touched.duration && Boolean(formik.errors.duration)}>
									<InputLabel>Duration</InputLabel>
									<Select
										label={'Duration'}
										name={'duration'}
										value={formik.values.duration}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										fullWidth
									>
										{data.project_durations.map((pd) => (
											<MenuItem key={pd.key} value={pd.value}>
												{pd.text}
											</MenuItem>
										))}
									</Select>
									<FormHelperText>{formik.touched.duration && formik.errors.duration}</FormHelperText>
								</FormControl>
							</Grid>

							{formik.values.proposal_type === 3 && (
								<>
									<Grid item xs={12}>
										<Divider>Transfer</Divider>
									</Grid>
									<Grid item xs={12} md={6}>
										<TextField
											type={'number'}
											name={'amount'}
											value={formik.values.amount}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											error={formik.touched.amount && Boolean(formik.errors.amount)}
											helperText={formik.touched.amount && formik.errors.amount}
											fullWidth
											label={'Amount to transfer on success'}
											InputLabelProps={{ shrink: true }}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<TextField
											type={'text'}
											name={'beneficiary'}
											value={formik.values.beneficiary}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											error={formik.touched.beneficiary && Boolean(formik.errors.beneficiary)}
											helperText={formik.touched.beneficiary && formik.errors.beneficiary}
											fullWidth
											label={'Beneficiary Account'}
											InputLabelProps={{ shrink: true }}
										/>
									</Grid>
								</>
							)}
							<Grid item xs={12}>
								<Button
									type="submit"
									variant={'contained'}
									fullWidth
									color={'primary'}
									size='large'
									// onClick={handleSubmit}
									disabled={loading || !formik.values.title || formik.values.title.length <= 5 || !formik.values.entity}
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
	return apiProvider && apiProvider.query.gameDaoGovernance
		? <Main />
		: null
}