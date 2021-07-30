import React, { useEffect, useState } from 'react'

import { useSubstrate } from '../../substrate-lib'
import { web3FromSource } from '@polkadot/extension-dapp';

import {
	Container, Form, Divider, Segment, Image, Button
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
	const access = 0
	const member_limit = '10'
	const fee_model = 0
	const fee = '10'

	const cid = ''
	const gov_asset = 0
	const pay_asset = 0

	// collect curve settings
	// tbd storage

	const token_buy_fn  = 1 // 1:1 price over t, vol
	const token_sell_fn = 1 // 1:1 price over t, vol
	const reward_fn     = 1 // reward token to token volume per cycle
	const reward_cycle  = 1 //

	const entity = data.project_entities[ rnd(data.project_entities.length) ].value
	const country = data.countries[ rnd(data.countries.length) ].value

	return {
		name, body, creator, controller, treasury,
		access, member_limit, fee_model, fee,
		cid, gov_asset, pay_asset,
		email, website, repo, description,
		country, entity
	}
}

export const Main = props => {

	const { api } = useSubstrate()

	const { accountPair } = props
	// const [ status, setStatus ] = useState('')
	const [ loading, setLoading  ] = useState(false)
	const [ refresh, setRefresh  ] = useState(true)

	const [ formData, updateFormData ] = useState()
	const [ fileCID, updateFileCID ] = useState()
	const [ content, setContent ] = useState()
	// const [ contentCID, setContentCID ] = useState()

	// const [ submitState, setSubmitState ] = useState(0)

	// this is taken from txbutton

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

		// send it

		const sendTX = async cid => {

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
				formData.member_limit
			]
			const from = await getFromAcct()
			const tx = api.tx.gameDaoControl.create(...payload)
			const hash = await tx.signAndSend( from, ({ status, events }) => {
				if(events.length) {
					events.forEach((record) => {
						const { event } = record
						// const types = event.typeDef
						if (
							event.section === 'gameDaoControl' &&
							event.method === 'BodyCreated'
						) {
							console.log('body created:', hash)
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

						<Button onClick={handleSubmit}>Create Organization</Button>

					</Container>

			</Form>

		</Segment>
	)

}

export default function Module (props) {

	const { accountPair } = props
	const { api } = useSubstrate()

	return api && api.query.gameDaoControl && accountPair
		? <Main {...props} />
		: null

}

//
//
//
