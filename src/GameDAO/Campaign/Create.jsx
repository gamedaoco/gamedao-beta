import React, { useEffect, useState } from 'react'
import { useSubstrate } from '../../substrate-lib'
import { web3FromSource } from '@polkadot/extension-dapp';

import {
	Container, Button, Form, Segment, Divider, Image, Dimmer
} from 'semantic-ui-react'

import faker from 'faker'
import { data, rnd } from '../lib/data'
import config from '../../config'

import {
	pinJSONToIPFS,
	pinFileToIPFS,
	gateway,
} from '../lib/ipfs'

const dev = config.dev
console.log(dev)

const random_state = ( accountPair ) => {

		const name = faker.name.findName()
		const email = faker.internet.email()
		const title = faker.commerce.productName()
		const description = faker.company.catchPhrase()
		const country = data.countries[ rnd(data.countries.length) ].value
		const entity = data.project_entities[ rnd(data.project_entities.length) ].value
		const usage = data.project_types[ rnd(data.project_types.length) ].value
		const accept = false
		const cap = rnd(100000)
		const deposit = rnd(100)
		const duration = data.project_durations[ rnd(data.project_durations.length) ].value
		const protocol = data.protocol_types[ rnd(data.protocol_types.length) ].value
		const governance = ( rnd(2) === 0 ) ? false : true
		const cid = ''
		const tags = ['dao','game']
		const org = null

		const admin = accountPair.address

		return {
			name, email, title, description, country, entity, usage, accept,
			cap, deposit, duration, protocol, governance,
			cid, tags, org, admin,
		}

}

export const Main = props => {

	const { api } = useSubstrate()
	const { accountPair, finalized } = props
	const [ block, setBlock ] = useState(0)
	const [ nonce, updateNonce ] = useState(0)
	const [ orgHashes, updateOrgHashes ] = useState([])
	const [ orgs, updateOrgs ] = useState([])

	const [ formData, updateFormData ] = useState()
	const [ fileCID, updateFileCID ] = useState()
	const [ content, setContent ] = useState()

	const [ loading, setLoading  ] = useState(false)
	const [ refresh, setRefresh  ] = useState(true)

	const getFromAcct = async () => {
		const {
			address,
			meta: { source, isInjected }
		} = accountPair
		let fromAcct
		if (isInjected) {
			const injected = await web3FromSource(source)
			fromAcct = address
			api.setSigner(injected.signer)
		} else {
			fromAcct = accountPair
		}
		return fromAcct
	}

	const bestBlock = finalized
		? api.derive.chain.bestNumberFinalized
		: api.derive.chain.bestNumber

	useEffect(() => {
		let unsubscribe = null
		api.query.gameDaoCrowdfunding.nonce(n => {
			if (n.isNone) {
				updateNonce(0)
			} else {
				updateNonce(n.toNumber())
			}
		}).then(unsub => {
			unsubscribe = unsub
		})
		.catch(console.error)
		return () => unsubscribe && unsubscribe()
	}, [api.query.gameDaoCrowdfunding])

	useEffect(() => {
		let unsubscribe = null
		bestBlock(number => {
			setBlock(number.toNumber())
		})
		.then(unsub => {
			unsubscribe = unsub
		})
		.catch(console.error)
		return () => unsubscribe && unsubscribe()
	}, [bestBlock])

//

	useEffect(() => {
		let unsubscribe = null
		api.query.gameDaoControl.controlledBodies(accountPair.address, b => {
			if ( b.isNone || b.length === 0 ) return
			const hashes = [ ...new Set( b.toHuman().map(_=>_) )]
			updateOrgHashes(hashes)
			console.log(hashes)
		}).then(unsub => {
			unsubscribe = unsub
		})
		.catch(console.error)
		return () => unsubscribe && unsubscribe()
	}, [accountPair,api.query.gameDaoControl])

//

	useEffect(() => {
		if ( orgHashes.length === 0 ) return
		const req = [ ...orgHashes ]
		const query = async args => {
			const res = await api.query.gameDaoControl.bodies.multi( req ).then(_=>_.map(_h=>_h.toHuman()))
			const _ = res.map( ( body, i ) => {
				const org = {
					key: i,
					value: body.id,
					text: body.name
				}
				return org
			})
			updateOrgs(_)
		}
		query()
	}, [orgHashes,accountPair,api.query.gameDaoControl])

	useEffect(()=>{
		if (orgs.length===0) return
		const initial_state = random_state( accountPair )
		updateFormData( initial_state )
	}, [ orgs ] )

	// handle form state

	const handleOnChange = (e, { name, value }) =>
	updateFormData({ ...formData, [name]: value })

	useEffect(()=>{
		if(!formData) return
		if (dev) console.log('update content json')
		const contentJSON = {
			name: formData.name,
			email: formData.email,
			title: formData.title,
			description: formData.description,
			...fileCID
		}
		// if (dev) console.log(contentJSON)
		setContent( contentJSON )
	}, [fileCID, formData]);

	async function onFileChange(e, { name }) {
		const file = e.target.files[0]
		if (dev) console.log('upload image')
		try {
			const cid = await pinFileToIPFS( file )
			updateFileCID({ ...fileCID, [name]: cid })
			if (dev) console.log('file cid',`${gateway}${cid}`)
		} catch (error) {
			console.log('Error uploading file: ', error)
		}
	}

	// submit

	const handleSubmit = e => {

		e.preventDefault()
		console.log('submit')
		setLoading(true)

		//

		const getCID = async () => {
			if (dev) console.log('1. upload content json')
			try {
				// TODO: pin...
				const cid = await pinJSONToIPFS( content )
				if ( cid ) {
					// setContentCID(cid)
					if (dev) console.log('json cid',`${gateway}${cid}`)
					sendTX(cid)
				}
			} catch ( err ) {
				console.log('Error uploading file: ', err)
			}
		}

		//

		const sendTX = async cid => {

			const campaign_end = ( formData.duration * data.blockFactor ) + block // take current block as offset
			console.log('campaign_end', campaign_end)

			console.log()
			const target = formData.cap * 1000000000000
			const deposit = formData.deposit * 1000000000000

			const payload = [
				// accountPair.address,
				formData.org,
				formData.admin,
				formData.title,
				target,
				deposit,
				campaign_end,
				formData.protocol,
				( formData.governance === true ) ? 1 : 0,
				cid,
				'PLAY',
				'Play Coin',
			]
			console.log('payload', payload)

			const from = await getFromAcct()
			const tx = api.tx.gameDaoCrowdfunding.create(...payload)
			const hash = await tx.signAndSend( from, ({ status, events }) => {
				if(events.length) {
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

	useEffect(()=> {
		if(!refresh) return
		if (dev) console.log('refresh signal')
		updateFileCID(null)
		updateFormData( random_state( accountPair ) )
		setRefresh(false)
		setLoading(false)
	},[accountPair, refresh])

	if ( !formData ) return null

	return (
		<Segment vertical loading={loading}>

			<h1>Create Campaign</h1>

			<Form>

					<br/>
					<Divider clearing horizontal>General</Divider>
					<br/>

					<Form.Select
						fluid
						required
						label='Organization'
						placeholder='Organization'
						name='org'
						options={orgs}
						value={formData.org}
						onChange={handleOnChange}
						/>

					<Form.Input
						fluid required
						label='Campaign name'
						placeholder='Campaign name'
						name='title'
						value={formData.title}
						onChange={handleOnChange}
						/>

					<Form.TextArea
						label='Campaign Description'
						placeholder='Tell us more about your idea...'
						name='description'
						value={formData.description}
						onChange={handleOnChange}
						/>

					<br/>
					<Divider clearing horizontal>Content</Divider>
					<br/>

			{ fileCID &&
				<Image.Group size='tiny'>
					{fileCID.logo && <Image alt={formData.title} src={gateway+fileCID.logo} />}
					{fileCID.header && <Image alt={formData.title} src={gateway+fileCID.header} />}
				</Image.Group>
			}

					<Form.Group widths='equal'>
						<Form.Input
							type="file"
							label='Logo Graphic'
							name='logo'
							onChange={onFileChange}
							/>
						<Form.Input
							type="file"
							label='Header Graphic'
							name='header'
							onChange={onFileChange}
							/>
					</Form.Group>


					{/* legal body applying for the funding */}

					<br/>
					<Divider clearing horizontal>Public Representative</Divider>
					<br/>

					<Form.Group widths='equal'>
						<Form.Input
							fluid
							label='Name'
							placeholder='Name'
							name='name'
							value={formData.name}
							onChange={handleOnChange}
							/>
						<Form.Input
							fluid
							label='Email'
							placeholder='Email'
							name='email'
							value={formData.email}
							onChange={handleOnChange}
							/>
					</Form.Group>

					<br/>
					<Divider clearing horizontal>Campaign Settings</Divider>
					<br/>

					<Container>
						This section is already covered during org creation,
						currently only a placeholder / reminder.
					</Container>

					<Form.Group widths='equal'>
						<Form.Select
							fluid
							label='Legal Entity'
							placeholder='Legal Entity'
							name='entity'
							options={data.project_entities}
							value={formData.entity}
							onChange={handleOnChange}
							/>
						<Form.Select
							fluid
							label='Country'
							name='country'
							placeholder='Country'
							options={data.countries}
							value={formData.country}
							onChange={handleOnChange}
							/>
					</Form.Group>

					<br/>
					<Divider clearing horizontal></Divider>
					<br/>
					{/* usage of funding and protocol to initiate after successfully raising */}

					<Form.Group widths='equal'>
						<Form.Input
							fluid
							label='Admin Account'
							placeholder='Admin'
							name='admin'
							value={formData.admin}
							onChange={handleOnChange}
							required
							/>
					</Form.Group>

					<Form.Group widths='equal'>
						<Form.Select
							fluid
							label='Use of funds'
							name='usage'
							placeholder='Usage'
							options={data.project_types}
							value={formData.usage}
							onChange={handleOnChange}

							/>
						<Form.Select
							fluid
							label='Protocol'
							name='protocol'
							placeholder='Protocol'
							options={data.protocol_types}
							value={formData.protocol}
							onChange={handleOnChange}
							/>
					</Form.Group>


					<Form.Group widths='equal'>

						<Form.Input
							fluid
							label='Deposit (PLAY)'
							placeholder='Deposit'
							name='deposit'
							value={formData.deposit}
							onChange={handleOnChange}

							/>

						<Form.Input
							fluid
							label='Funding Target (PLAY)'
							placeholder='Cap'
							name='cap'
							value={formData.cap}
							onChange={handleOnChange}

							/>

						<Form.Select
							fluid
							label='Campaign Duration'
							options={data.project_durations}
							placeholder='Campaign Duration'
							name='duration'
							value={formData.duration}
							onChange={handleOnChange}
							/>
					</Form.Group>

					<Form.Checkbox
						label='DAO Governance'
						name='governance'
						checked={formData.governance}
						onChange={handleOnChange}
						/>
					<Form.Checkbox
						label='I agree to the Terms and Conditions'
						name='accept'
						checked={formData.accept}
						onChange={handleOnChange}
						/>

					<Container textAlign='right'>
						<Button onClick={handleSubmit}>Create Campaign</Button>
					</Container>

			</Form>

		</Segment>
	)

}

export default function Module (props) {

	const { accountPair } = props
	const { api } = useSubstrate()

	return api && api.query.gameDaoCrowdfunding && accountPair
		? <Main {...props} />
		: null

}

//
//
//
