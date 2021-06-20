/**
 _______________________________ ________
 \____    /\_   _____/\______   \\_____  \
	 /     /  |    __)_  |       _/ /   |   \
	/     /_  |        \ |    |   \/    |    \
 /_______ \/_______  / |____|_  /\_______  /
				 \/        \/         \/         \/
 Z  E  R  O  .  I  O     N  E  T  W  O  R  K
 © C O P Y R I O T   2 0 7 5   Z E R O . I O
**/

import React, { useEffect, useState } from 'react'
import faker from 'faker'

import { useSubstrate } from '../../substrate-lib'
import { TxButton } from '../../substrate-lib/components'

import {
	Container,
	Button,
	Form,
	Message,
} from 'semantic-ui-react'

import { data, rnd } from './lib'

// const generateIPFSBlob = () => {

// 	return {
// 		nonce: nonce,
// 		campaign_hash: null,
// 		creator_hash: accountPair.address,
// 		payload: formData,
// 		images: [
// 		// cids to images
// 		],
// 	}

// }

export const Main = props => {

	const { api } = useSubstrate()
	const { accountPair, finalized } = props
	const [ status, setStatus ] = useState('')
	const [ formData, updateFormData ] = useState()
	const [ nonce, updateNonce ] = useState(0)
	const [ block, setBlock ] = useState(0)
	const [ loading, setLoading  ] = useState(false)

	const bestBlock = finalized
		? api.derive.chain.bestNumberFinalized
		: api.derive.chain.bestNumber

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

	useEffect(() => {

		let unsubscribe = null

		api.query.gameDaoCrowdfunding.nonce(n => {
			if (n.isNone) {
				updateNonce('<None>')
			} else {
				updateNonce(n.toNumber())
			}
		}).then(unsub => {
			unsubscribe = unsub
		})
		.catch(console.error)

		return () => unsubscribe && unsubscribe()

	}, [api.query.gameDaoCrowdfunding])

	useEffect(()=>{

		updateFormData({
			name: faker.name.findName(),
			email: faker.internet.email(),
			title: faker.commerce.productName(),
			description: faker.company.catchPhrase(),
			country: data.countries[ rnd(data.countries.length) ].value,
			entity: data.project_entities[ rnd(data.project_entities.length) ].value,
			usage: data.project_types[ rnd(data.project_types.length) ].value,
			accept: false,
			cap: rnd(100000),
			deposit: rnd(10),
			duration: data.project_durations[ rnd(data.project_durations.length) ].value,
			protocol: data.protocol_types[ rnd(data.protocol_types.length) ].value,
			governance: ( rnd(1) === 0 ) ? false : true,
			// TODO: campaign json cid + should be a pinned
			// TODO: campaign image cid + should be a pinned
			cid: 'cid',
			// TODO campaign tags should be creatable
			tags: ['dao','game'],
		})

	}, [ nonce ] )

	const handleOnChange = e => {

		updateFormData({
			...formData,
			[e.target.name]: e.target.value
		})

	}

	const handleSubmit = e => {

		e.preventDefault()

		console.log('submit')
		setLoading(true)

		const campaign_end = ( formData.duration * data.blockFactor ) + block // take current block as offset
		console.log('campaign_end', campaign_end)

		const payload = [
			accountPair.address,
			formData.title,
			formData.cap,
			formData.deposit,
			campaign_end,
			formData.protocol,
			formData.governance,
			formData.cid
		]

		console.log('payload', payload)

		async function send () {
			const from = accountPair
			const tx = api.tx.gameDaoCrowdfunding.create(...payload)
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
			})
			console.log(hash)
		}
		send()

	}

	if ( !formData ) return null

	return (
		<div>

			<h1>Create Campaign</h1>

			<Form loading={loading}>

					{/* campaign name to be listed as */}

					<Form.Input
						fluid required
						label='Campaign name'
						placeholder='Campaign name'
						name='title'
						value={formData.title}
						onChange={handleOnChange}
						/>

					{/* legal body applying for the funding */}

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

					{/* usage of funding and protocol to initiate after successfully raising */}

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
							fluid required
							label='Protocol'
							name='protocol'
							placeholder='Protocol'
							options={data.protocol_types}
							value={formData.protocol}
							onChange={handleOnChange}
							/>
					</Form.Group>

					<Form.Checkbox
						label='DAO Governance'
						name='governance' required
						value={formData.governance}
						onChange={handleOnChange}
						/>

					<Form.Group widths='equal'>

						<Form.Input
							fluid
							label='Deposit (PLAY)'
							placeholder='Deposit'
							name='deposit'
							value={formData.deposit}
							onChange={handleOnChange}
							required
							/>

						<Form.Input
							fluid
							label='Funding Target (PLAY)'
							placeholder='Cap'
							name='target'
							value={formData.cap}
							onChange={handleOnChange}
							required
							/>

						<Form.Select
							fluid required
							label='Campaign Duration'
							options={data.project_durations}
							placeholder='Campaign Duration'
							name='duration'
							value={formData.duration}
							onChange={handleOnChange}
							/>
					</Form.Group>

{/*					<Form.TextArea label='Campaign Description' placeholder='Tell us more about your idea...' name='description' value={formData.description} onChange={handleOnChange} />
*/}

					<Form.Checkbox
						label='I agree to the Terms and Conditions'
						name='accept'
						value={formData.accept}
						onChange={handleOnChange}
						/>


					<Container textAlign='right'>
						<Button onClick={handleSubmit}>Create Campaign Manually</Button>
							<TxButton
								accountPair={accountPair}
								label='Create Campaign'
								type='SIGNED-TX'
								setStatus={setStatus}
								attrs={{
									palletRpc: 'gameDaoCrowdfunding',
									callable: 'create',
									inputParams: [
										accountPair.address,
										formData.title,
										formData.cap,
										formData.deposit,
										(( formData.duration * data.blockFactor ) + block),
										formData.protocol,
										( (formData.governance===false) ? 0 :  1),
										formData.cid
									],
									paramFields: [true,true,true,true,true,true,true,true]
								}}
							/>
							{ status &&
								<Message
									header='Transaction Status'
									content='{status}'
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
