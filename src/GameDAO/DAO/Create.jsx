import React, { useEffect, useState } from 'react'
import { useSubstrate } from '../../substrate-lib'
import { TxButton } from '../../substrate-lib/components'
import {
	Container, Form, Message, Divider, Segment, Image
} from 'semantic-ui-react'

import faker from 'faker'
import { data } from '../lib/data'
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

	const { accountPair } = props
	const [ status, setStatus ] = useState('')
	const [ loading, setLoading  ] = useState(false)
	const [ formData, updateFormData ] = useState()
	const [ fileCID, updateFileCID ] = useState()
	const [ content, setContent ] = useState()
	const [ contentCID, setContentCID ] = useState()

	useEffect(()=>{
		if(!accountPair) return
		if (dev) console.log('generate form data')
		const initial_state = random_state( accountPair )
		updateFormData( initial_state )
	},[accountPair])

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
		if (dev) console.log(contentJSON)
		setContent( contentJSON )
	}, [fileCID, formData]);

	useEffect(()=>{
		if (!content) return
		if (dev) console.log('upload content json')
		const req = async () => {
			try {
				const cid = await pinJSONToIPFS( content )
				if ( cid ) {
					setContentCID(cid)
					if (dev) console.log('json cid',`${gateway}${cid}`)
				}
			} catch ( err ) {
				console.log('Error uploading file: ', err)
			}
		}
		req()
	}, [content]);

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

	const handleOnChange = (e, { name, value }) =>
	updateFormData({ ...formData, [name]: value })

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
							required
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
{/*
						<Button onClick={handleSubmit}>Create DAO Manually</Button>
*/}

						{ !contentCID &&
							<span><i>enabled when ipfs hashes are ready:</i>&nbsp;&nbsp;&nbsp;</span>
						}
						<TxButton
							accountPair={accountPair}
							label='Create'
							type='SIGNED-TX'
							setStatus={setStatus}
							attrs={{
								palletRpc: 'gameDaoControl',
								callable: 'create',
								inputParams: [
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
								],
								paramFields: [true,true,true,true,true,true,true,true,true,true,true,true]
							}}
						/>
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
