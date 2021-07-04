import React, { useEffect, useState } from 'react'
import { useSubstrate } from '../../substrate-lib'
import { TxButton } from '../../substrate-lib/components'
import {
	Container, Button, Form, Message,
} from 'semantic-ui-react'

import faker from 'faker'
import { data, rnd } from '../lib/data'

import { create } from 'ipfs-http-client'
const client = create('https://ipfs.infura.io:5001/api/v0')

export const Main = props => {

	const { api } = useSubstrate()
	const { accountPair, finalized } = props
	const [ status, setStatus ] = useState('')
	const [ loading, setLoading  ] = useState(false)

	// content
	const [ formData, updateFormData ] = useState()
	const [ fileURL, updateFileURL ] = useState(``)
	const [ contentCID, setContentCID ] = useState('')
	const [ content, setContent ] = useState({})

	//
	//
	//

	useEffect(()=>{

		if(!accountPair) return

		const name = faker.commerce.productName()
		const body = 0

		const creator = accountPair.address
		const controller = accountPair.address
		const treasury = accountPair.address

		const access = 1
		const member_limit = '100'
		const fee_model = 2
		const fee = '10'

		const cid = contentCID
		const gov_asset = 0
		const pay_asset = 0

		const _ = {
			name, body, creator, controller, treasury,
			access, member_limit, fee_model, fee,
			cid, gov_asset, pay_asset,
		}
		updateFormData( _ )

	},[accountPair])

	const updateContent = () => {
		const contentJSON = {
			logoImage: fileURL,
			name: formData.name,
			description: formData.description,
		}
		setContent( contentJSON )
	}

	// handle form state
	const handleOnChange = (e, { name, value }) =>
	updateFormData({ ...formData, [name]: value })

	const handleSubmit = e => {

		e.preventDefault()
		console.log('submit')
		setLoading(true)

	}

	// upload files handler

	async function onFileChange(e) {

		const file = e.target.files[0]

		try {

			const added = await client.add(file)
			const url = `https://ipfs.infura.io/ipfs/${added.path}`
			updateFileURL(url)
			setContentCID(added.path)
			updateContent()

		} catch (error) {

			console.log('Error uploading file: ', error)

		}

	}

	//

	if ( !formData ) return null

	return (
		<div>

			<h1>Create Organization</h1>

			<p>Note: In case you want to create a DAO,
			the controller must be the organization.</p>

			{fileURL && <><img src={fileURL} width="128px" /><br/><br/></> }

			<Form loading={loading}>

					<Form.Group widths='equal'>
						<Form.Input
							type="file"
							label='Logo'
							onChange={onFileChange}
							/>
						<Form.Input
							fluid
							label='Name'
							placeholder='Name'
							name='name'
							value={formData.name}
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

					<Form.Group widths='equal'>
						<Form.Input
							fluid
							label='Controller'
							placeholder='Controller'
							name='controller'
							value={formData.controller}
							onChange={handleOnChange}
							/>
						<Form.Input
							fluid
							label='Treasury'
							placeholder='Tresury'
							name='treasury'
							value={formData.treasury}
							onChange={handleOnChange}
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
							/>
						<Form.Input
							fluid
							label='Member Limit'
							placeholder='100'
							name='member_limit'
							value={formData.member_limit}
							onChange={handleOnChange}
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
							/>
						<Form.Input
							fluid
							label='Membership Fee'
							placeholder='10'
							name='fee'
							value={formData.fee}
							onChange={handleOnChange}
							/>

					</Form.Group>

					<Container textAlign='right'>
						<Button onClick={handleSubmit}>Create DAO Manually</Button>
						<TxButton
							accountPair={accountPair}
							label='Create DAO'
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

		</div>
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
