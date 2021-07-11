import React, { useEffect, useState } from 'react'

import { useSubstrate } from '../../substrate-lib'
import { web3FromSource } from '@polkadot/extension-dapp';
import { TxButton } from '../../substrate-lib/components'

import {
	Container, Form, Message, Divider, Segment, Image, Button
} from 'semantic-ui-react'

import faker from 'faker'
import { data } from '../lib/data'
// import config from '../../config'

import {
	pinJSONToIPFS,
	pinFileToIPFS,
	gateway,
} from '../lib/ipfs'

const dev = true // config.dev
if (dev) console.log('dev mode')

const random_state = ( accountPair ) => {
	const name = faker.commerce.productName()
	const email = faker.internet.email()
	const website = faker.internet.url()
	const repo = faker.internet.url()
	const description = faker.company.catchPhrase()

	const creator = accountPair.address
	const controller = accountPair.address
	const treasury = accountPair.address

	const body = 0
	const access = 1
	const member_limit = '100'
	const fee_model = 1
	const fee = '10'

	const cid = ''
	const gov_asset = 0
	const pay_asset = 0

	return {
		name, body, creator, controller, treasury,
		access, member_limit, fee_model, fee,
		cid, gov_asset, pay_asset,
		email, website, repo, description
	}
}

export const Main = props => {

	const { api } = useSubstrate()

	const { accountPair } = props
	const [ status, setStatus ] = useState('')
	const [ loading, setLoading  ] = useState(false)
	const [ formData, updateFormData ] = useState()
	const [ fileCID, updateFileCID ] = useState()
	const [ content, setContent ] = useState()
	const [ contentCID, setContentCID ] = useState()

	const [ submitState, setSubmitState ] = useState(0)

	// this is taken from txbutton

	const getFromAcct = async () => {
		const {
			address,
			meta: { source, isInjected }
		} = accountPair

		console.log(address, source, isInjected)

		let fromAcct

		// signer is from Polkadot-js browser extension
		if (isInjected) {
			const injected = await web3FromSource(source)
			fromAcct = address
			console.log(injected.signer)
			api.setSigner(injected.signer)
		} else {
			fromAcct = accountPair
		}
		return fromAcct
	}

	// generator for the demo

	useEffect(()=>{
		if(!accountPair) return
		if (dev) console.log('generate form data')
		const initial_state = random_state( accountPair )
		updateFormData( initial_state )
	},[accountPair])

	// update json payload from form data

	useEffect(()=>{
		if(!formData) return
		if (dev) console.log('update content json')
		const contentJSON = {
			name: formData.name,
			description: formData.description,
			website: formData.website,
			email: formData.email,
			repo: formData.repo,
			...fileCID
		}
		// if (dev) console.log(contentJSON)
		setContent( contentJSON )
	}, [fileCID, formData]);

	// upload temp json to ipfs (to be changed)

	useEffect(()=>{
		// if (!content) return
		// if (dev) console.log('upload content json')
		// const req = async () => {
		// 	try {
		// 		const cid = await pinJSONToIPFS( content )
		// 		if ( cid ) {
		// 			setContentCID(cid)
		// 			if (dev) console.log('json cid',`${gateway}${cid}`)
		// 		}
		// 	} catch ( err ) {
		// 		console.log('Error uploading file: ', err)
		// 	}
		// }
		// req()
	}, [content]);

	// handle file uploads to ipfs

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

	// manual tx state for tx button...

	useEffect(()=>{
		console.log('filter tx state')
		if ( !status ) return
		if ( status.indexOf('Finalized') > -1 ) {
			setLoading( false )
			setStatus( null )
			if (dev) console.log('reset form')
			updateFileCID(null)
			updateFormData( random_state( accountPair ) )
		} else {
			setLoading( true )
		}
	},[ status, setStatus, setLoading, accountPair ])

	// form fields

	const handleOnChange = (e, { name, value }) =>
	updateFormData({ ...formData, [name]: value })

	//
	// submit function
	//

	const handleSubmit = e => {

		e.preventDefault()
		console.log('submit')
		setLoading(true)

		//


		const getCID = async () => {
			if (dev) console.log('1. upload content json')
			try {
				const cid = await pinJSONToIPFS( content )
				if ( cid ) {
					setContentCID(cid)
					if (dev) {
						console.log('json cid',`${gateway}${cid}`)
						sendTX()
					}
				}
			} catch ( err ) {
				console.log('Error uploading file: ', err)
			}
		}
		getCID()

		//

		const payload = [
			accountPair.address,
			formData.controller,
			formData.treasury,
			formData.name,
			contentCID,
			formData.body,
			formData.access,
			formData.fee_model,
			formData.fee,
			0,
			0,
			formData.member_limit
		]


		// send it

		const sendTX = async () => {

			const from = await getFromAcct()
			if (dev) console.log('2. send tx', from)
			const tx = api.tx.gameDaoControl.create(...payload)
			const hash = await tx.signAndSend( from, ({ status, events }) => {

				if(events.length) {
					console.log(`\nReceived ${events.length} events:`)
					events.forEach((record) => {
						// Extract the phase, event and the event types
						const { event, phase } = record
						const types = event.typeDef

						// Show what we are busy with
						console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`)
						console.log(`\t\t${event.meta.documentation.toString()}`)

						// Loop through each of the parameters, displaying the type and data
						event.data.forEach((data, index) => {
							console.log(`\t\t\t${types[index].type}: ${data.toString()}`)
						})
					})
				}

				if (status.isInBlock || status.isFinalized) {
					events
					.filter(({ event }) => api.events.system.ExtrinsicFailed.is(event) )
					.forEach(({ event: { data: [error, info] } }) => {
						if (error.isModule) {
							const decoded = api.registry.findMetaError(error.asModule)
							const { documentation, method, section } = decoded
							console.log(`${section}.${method}: ${documentation.join(' ')}`)
						} else {
							console.log(error.toString())
						}
						console.log(info)
					})
				}
				setLoading(false)
				console.log('completed!')
			})
			console.log(hash)
		}

	}

	if ( !formData ) return null

	return (
		<Segment vertical loading={loading}>

			<h1>Create Organization</h1>

			<Form>
					<br/>
					<Divider clearing horizontal>General Information</Divider>
					<br/>

					<Form.Group widths='equal'>

						<Form.Input
							fluid
							label='Name'
							placeholder='Name'
							name='name'
							value={formData.name}
							onChange={handleOnChange}
							required
							/>
						<Form.Input
							fluid
							label='Contact Email'
							placeholder='email'
							name='email'
							value={formData.email}
							onChange={handleOnChange}
							/>

						<Form.Select
							fluid
							label='Organizational Body'
							name='body'
							options={data.dao_bodies}
							value={formData.body}
							onChange={handleOnChange}
							/>
					</Form.Group>

			{ fileCID &&
				<Image.Group size='tiny'>
					{fileCID.logo && <Image alt={formData.name} src={gateway+fileCID.logo} />}
					{fileCID.header && <Image alt={formData.name} src={gateway+fileCID.header} />}
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

					<Form.Group widths='equal'>
						<Form.TextArea
							label='Short Description'
							name='description'
							value={formData.description}
							placeholder='Tell us more'
							onChange={handleOnChange}
							/>
					</Form.Group>


					<Form.Group widths='equal'>
						<Form.Input
							fluid
							label='Website'
							placeholder='https://your.website.xyz'
							name='website'
							value={formData.website}
							onChange={handleOnChange}
							/>
						<Form.Input
							fluid
							label='Code Repository'
							placeholder='repo'
							name='repo'
							value={formData.repo}
							onChange={handleOnChange}
							/>
					</Form.Group>

					<br/>
					<Divider clearing horizontal>Controller Settings</Divider>
					<br/>

					<p>Note: In case you want to create a DAO,
					the controller must be the organization.</p>

					<Form.Group widths='equal'>
						<Form.Input
							fluid
							label='Controller Account'
							placeholder='Controller'
							name='controller'
							value={formData.controller}
							onChange={handleOnChange}
							required
							/>
						<Form.Input
							fluid
							label='Treasury Account'
							placeholder='Tresury'
							name='treasury'
							value={formData.treasury}
							onChange={handleOnChange}
							required
							/>
					</Form.Group>

					<Form.Group widths='equal'>
						<Form.Select
							fluid
							label='Member Access Control'
							options={data.dao_member_governance}
							name='access'
							value={formData.access}
							onChange={handleOnChange}
							required
							/>
						<Form.Input
							fluid
							label='Member Limit'
							placeholder='100'
							name='member_limit'
							value={formData.member_limit}
							onChange={handleOnChange}
							required
							/>
					</Form.Group>

					<Form.Group widths='equal'>
						<Form.Select
							fluid
							label='Fee Model'
							options={data.dao_fee_model}
							name='fee_model'
							value={formData.fee_model}
							onChange={handleOnChange}
							required
							/>
						<Form.Input
							fluid
							label='Membership Fee'
							placeholder='10'
							name='fee'
							value={formData.fee}
							onChange={handleOnChange}
							required
							/>

					</Form.Group>

					<Container textAlign='right'>

						<Button onClick={handleSubmit}>Create Campaign</Button>

						{
							// <TxButton
							// 	accountPair={accountPair}
							// 	label='Create'
							// 	type='SIGNED-TX'
							// 	setStatus={setStatus}
							// 	attrs={{
							// 		palletRpc: 'gameDaoControl',
							// 		callable: 'create',
							// 		inputParams: [
							// 			accountPair.address,
							// 			formData.controller,
							// 			formData.treasury,
							// 			formData.name,
							// 			contentCID,
							// 			formData.body,
							// 			formData.access,
							// 			formData.fee_model,
							// 			formData.fee,
							// 			0,
							// 			0,
							// 			formData.member_limit
							// 		],
							// 		paramFields: [true,true,true,true,true,true,true,true,true,true,true,true]
							// 	}}
							// />
						}

						{ status &&
							<Message
								header='Transaction Status'
								content={status}
								/>
						}
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
