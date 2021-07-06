import React, { useEffect, useState } from 'react'
import { useSubstrate } from '../../substrate-lib'
import { TxButton } from '../../substrate-lib/components'
import {
	Container, Form, Message, Divider, Segment, Image
} from 'semantic-ui-react'

import faker from 'faker'
import { data } from '../lib/data'

import {
	pinJSONToIPFS,
	pinFileToIPFS,
	gateway,
} from '../lib/ipfs'


export const Main = props => {

	const { accountPair } = props
	const [ status, setStatus ] = useState('')
	const [ loading, setLoading  ] = useState(false)

	// form
	const [ formData, updateFormData ] = useState()
	// files
	const [ fileCID, updateFileCID ] = useState()
	// json
	const [ content, setContent ] = useState()
	const [ contentCID, setContentCID ] = useState()

	//
	//
	//

	useEffect(()=>{

		if(!accountPair) return

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

		const _ = {
			name, body, creator, controller, treasury,
			access, member_limit, fee_model, fee,
			cid, gov_asset, pay_asset,
			email, website, repo, description
		}
		updateFormData( _ )

	},[accountPair, contentCID])

	useEffect(()=>{

		if (!content) return

		const req = async () => {

			try {
				const cid = await pinJSONToIPFS( content )
				console.log('cid', cid)
				if ( cid ) {
					setContentCID(cid)
					console.log('json',`${gateway}${cid}`)
				}
			} catch ( err ) {
				console.log('Error uploading file: ', err)
			}

		}
		req()

	}, [content, setContentCID]);


	useEffect(()=>{

		if(!fileCID) return

		const contentJSON = {
			name: formData.name,
			description: formData.description,
			website: formData.website,
			email: formData.email,
			logo: fileCID.logo,
			header: fileCID.header,
			repo: formData.repo,
		}
		setContent( contentJSON )

	}, [fileCID, formData]);

	async function onFileChange(e, { name }) {

		const file = e.target.files[0]

		try {
			const cid = await pinFileToIPFS( file )
			updateFileCID({ ...fileCID, [name]: cid })
			console.log('file',`${gateway}${cid}`)
		} catch (error) {
			console.log('Error uploading file: ', error)
		}

	}

	// handle form state

	const handleOnChange = (e, { name, value }) =>
	updateFormData({ ...formData, [name]: value })

	// filter state from tx button...lol

	useEffect(()=>{

		if ( !status ) return
		if ( status.indexOf('Finalized') > -1 ) {
			setLoading( false )
			setStatus( null )
		} else {
			setLoading( true )
		}

	},[ status, setStatus, setLoading ])

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
