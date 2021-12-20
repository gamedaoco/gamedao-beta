import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import { useNavigate } from 'react-router'
import { useApiProvider } from '@substra-hooks/core'

import { gateway, pinJSONToIPFS } from '../lib/ipfs'
import config from '../../config'
import { data, rnd } from '../lib/data'

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

import { useWallet } from 'src/context/Wallet'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useDebouncedCallback } from 'src/hooks/useDebouncedCallback'


const dev = config.dev
if (dev) console.log('dev mode')

type GenericForm = {
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

// proposal (flow)
// 0.1 -> withdrawal votings
// 0.2 -> organisational votings
// 0.3 -> surveys

export const Main = ({ blockNumber }) => {
	const apiProvider = useApiProvider()
	const { account, address, signAndNotify } = useWallet()

	const [loading, setLoading] = useState(false)
	const [refresh, setRefresh] = useState(true)

	const [initialData, setInitialData] = useState()
	const [persistedData, setPersistedData] = useState()

	const [fileCID, updateFileCID] = useState()
	const [markdownValue, setMarkdownValue] = useState("# gamedao")
	const navigate = useNavigate()

	const { bodies, bodyStates, queryMemberships, memberships } = useGameDaoControl()

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
		setInitialData(random_state(account))
	}, [account])

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


	// submit function

	const handleSubmit = (values, form) => {
		console.log('submit')
		setLoading(true)
		console.log(values)

		const content = {
			id: values.id,
			description: markdownValue,
		}

		//

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

			const expiry = formik.values.duration * data.blocksPerDay + start // take current block as offset
			const { entity, purpose } = formik.values

			console.log('🚀 ~ file: Create.tsx ~ line 189 ~ sendTX ~ formData', formik.values)
			console.log('🚀 ~ file: Create.tsx ~ line 190 ~ sendTX ~ start', start)
			console.log('🚀 ~ file: Create.tsx ~ line 191 ~ sendTX ~ expiry', expiry)

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

						// clear localstorage
						localStorage.removeItem("gamedao-form-create-governance")
					}

					// TODO: 2075 Do we need error handling here if false?
				}
			)
		}
	}

	useEffect(() => {}, [])

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: initialData,
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

	useEffect(() => {
		if (!account) return
		if (!refresh) return
		if (dev) console.log('refresh signal')
		updateFileCID(null)
		//updateFormData(random_state(account))
		setRefresh(false)
		setLoading(false)
	}, [account, refresh])

	const [validMemberships, setValidMemberships] = useState([])

	useEffect(() => {
		if (!bodyStates || !memberships) return

		setValidMemberships(
			(memberships?.[address] ?? []).filter((bodyHash) => bodyStates?.[bodyHash] === '1')
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
								<Divider>General Information</Divider>
							</Grid>
							<Grid item xs={12}>
								<FormControl fullWidth error={formik.touched.entity && Boolean(formik.errors.entity)}>
									<InputLabel>Organization / Campaign</InputLabel>
									<Select
										required
										label="Organization / Campaign"
										fullWidth
										name="entity"
										value={formik.values.entity}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									>
										{validMemberships.map((e) => (
											<MenuItem key={e} value={e}>
												{bodies?.[e]?.name}
											</MenuItem>
										))}
									</Select>
									<FormHelperText>{formik.touched.entity && formik.errors.entity}</FormHelperText>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<TextField
									name={'purpose'}
									label={'Proposal Title'}
									placeholder={'Title'}
									value={formik.values.purpose}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={formik.touched.purpose && Boolean(formik.errors.purpose)}
									helperText={formik.touched.purpose && formik.errors.purpose}
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
							<Grid item xs={12} md={3}>
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
										{data.proposal_types.map((pt) => (
											<MenuItem key={pt.key} value={pt.value}>
												{pt.text}
											</MenuItem>
										))}
									</Select>
									<FormHelperText>{formik.touched.proposal_type && formik.errors.proposal_type}</FormHelperText>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={3}>
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
										{data.voting_types.map((vt) => (
											<MenuItem key={vt.key} value={vt.value}>
												{vt.text}
											</MenuItem>
										))}
									</Select>
									<FormHelperText>{formik.touched.voting_type && formik.errors.voting_type}</FormHelperText>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={3}>
								<FormControl fullWidth error={formik.touched.collateral_type && Boolean(formik.errors.collateral_type)}>
									<InputLabel>Collateral Type</InputLabel>
									<Select
										label={'Collateral Type'}
										name={'collateral_types'}
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

							{formik.values.proposal_type !== 0 && (
								<>
									<Grid item xs={12}>
										<Divider>For withdrawals and grants</Divider>
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
									disabled={loading}
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
