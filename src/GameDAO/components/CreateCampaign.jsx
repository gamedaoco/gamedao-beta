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
import moment from 'moment'
import faker from 'faker'

import { useSubstrate } from '../../substrate-lib'
import { TxButton } from '../../substrate-lib/components'

import { Loader } from '../../components/Loader'
import {
	Container,
	Button,
	Segment,
	Tab,
	Grid,
	Card,
	Statistic,
	Divider,
	Form,
	Message
} from 'semantic-ui-react'

const jsonEndpoint = 'https://api.pinata.cloud/pinning/pinJSONToIPFS'

// dropdown content

const project_entities = [
	{ key: '0', text: 'DAO / DAC / LAO', value: 'dao' },
	{ key: '1', text: 'Cooperative / LVC', value: 'coop' },
	{ key: '2', text: 'AG / SA', value: 'ag' },
	{ key: '3', text: 'GmbH / SARL / LLC', value: 'gmbh' },
	{ key: '4', text: 'Individual', value: 'individual' },
	{ key: '5', text: 'other', value: 'other' },
]

const project_types = [
	{ key: '0', text: 'Game', value: 'game' },
	{ key: '1', text: 'Content', value: 'content' },
	{ key: '2', text: 'Team', value: 'team' },
	{ key: '3', text: 'Other', value: 'other' },
]

const protocol_types = [
	{ key: '0', text: 'Grant', value: 'grant' },
	{ key: '1', text: 'Prepaid', value: 'prepaid' },
	{ key: '2', text: 'Loan', value: 'loan' },
	{ key: '3', text: 'Shares', value: 'shares' },
]

const countries = [
	{ key: '0', flag: 'eu', text: 'Europe', value: 'eu' },
	{ key: '1', flag: 'de', text: 'Germany', value: 'de' },
	{ key: '2', flag: 'ch', text: 'Switzerland', value: 'ch' },
	{ key: '3', flag: 'li', text: 'Liechtenstein', value: 'li' },
]

const curve_function = [
	{ key: '0', text: 'linear', value: 'x=y' },
	{ key: '1', text: 'progressive', value: '1' },
]

// durations will be converted to blocks
// where 1 day == 3sec blocktime * 20 * 60 * 24 == 86400 blocks
const blockTime = 3
const blockFactor = blockTime * ( 60 / blockTime) * 60 * 24

const project_durations = [
	{ key: '0', text: '1 day', value: '1' },
	{ key: '1', text: '7 days', value: '7' },
	{ key: '2', text: '30 days', value: '30' },
	{ key: '3', text: '100 days', value: '100' },
	{ key: '4', text: '1 year', value: '365' },
]

const dataProvider = {
	jsonEndpoint,
	project_entities,
	project_types,
	protocol_types,
	countries,
	curve_function,
	project_durations,
	blockTime,
	blockFactor,
}

//

// export const generateState = () => {

// 	return {

// 		// general data (ipfs)
// 		name: faker.name.findName(),
// 		email: faker.internet.email(),
// 		title: faker.commerce.productName(),
// 		description: faker.company.catchPhrase(),

// 		country: countries[ Math.round( Math.random() * countries.length )].value,
// 		entity: project_entities[ Math.round( Math.random() * project_entities.length )].value,
// 		usage: project_types[ Math.round( Math.random() * project_types.length )].value,

// 		accept: false,

// 		// campaign data (network)
// 		cap: Math.round( Math.random() * 100000 ),
// 		deposit: Math.round( Math.random() * 10 ),
// 		duration: project_durations[ Math.round( Math.random() * project_durations.length )].value,

// 		protocol: protocol_types[ Math.round( Math.random() * protocol_types.length )].value,
// 		governance: ( Math.round( Math.random() * 1) === 0 ) ? false : true,

// 		// TODO
// 		// campaign cid should be a pinned
// 		// ipfs hash containing a json
// 		// with campaign data
// 		cid: 'cid',

// 		// TODO
// 		tags: ['dao','game'],
// 	}
// 	return g

// }

//

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

//
//
//

export const Main = props => {

	const { api } = useSubstrate()
	const { accountPair } = props
	const { finalized } = props;
	const [ status, setStatus ] = useState('')
	const [ formData, updateFormData ] = useState(null)
	const [ nonce, updateNonce ] = useState(0)
	const [ block, setBlock ] = useState(0);
	const [ loading, setLoading  ] = useState(false)

	const bestBlock = finalized
		? api.derive.chain.bestNumberFinalized
		: api.derive.chain.bestNumber;

	// useEffect(()=>{
	// 	if ( formData ) return
	// 	updateFormData( generateState() )
	// },[formData])

	useEffect(() => {

		let unsubscribe = null;

		bestBlock(number => {
			setBlock(number.toNumber());
		})
		.then(unsub => {
			unsubscribe = unsub;
		})
		.catch(console.error);

		return () => unsubscribe && unsubscribe();
	}, [bestBlock]);

	useEffect(() => {

		let unsubscribe = null;

		api.query.gameDaoCrowdfunding.nonce(n => {
			if (n.isNone) {
				updateNonce('<None>');
			} else {
				updateNonce(n.toNumber());
			}
		}).then(unsub => {
			unsubscribe = unsub;
		})
		.catch(console.error);

		return () => unsubscribe && unsubscribe();

	}, [api.query.gameDaoCrowdfunding.nonce]);

	useEffect(()=>{

		const rnd = top => Math.round( Math.random() * top )

		updateFormData({
			// ...formData,
			// general data (ipfs)
			name: faker.name.findName(),
			email: faker.internet.email(),
			title: faker.commerce.productName(),
			description: faker.company.catchPhrase(),

			country: countries[ rnd(countries.length) ].value,
			entity: project_entities[ rnd(project_entities.length) ].value,
			usage: project_types[ rnd(project_types.length) ].value,

			accept: false,

			// campaign data (network)
			cap: rnd(100000),
			deposit: rnd(10),
			duration: project_durations[ rnd(project_durations.length) ].value,

			protocol: protocol_types[ rnd(protocol_types.length) ].value,
			governance: ( rnd(1) === 0 ) ? false : true,

			// TODO
			// campaign cid should be a pinned
			// ipfs hash containing a json
			// with campaign data
			cid: 'cid',

			// TODO
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

		const campaign_end = ( formData.duration * blockTime ) + block // take current block as offset
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
					console.log(`\nReceived ${events.length} events:`);
					events.forEach((record) => {
						// Extract the phase, event and the event types
						const { event, phase } = record;
						const types = event.typeDef;

						// Show what we are busy with
						console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
						console.log(`\t\t${event.meta.documentation.toString()}`);

						// Loop through each of the parameters, displaying the type and data
						event.data.forEach((data, index) => {
							console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
						});
					});
				}

				if (status.isInBlock || status.isFinalized) {
					events
					.filter(({ event }) => api.events.system.ExtrinsicFailed.is(event) )
					.forEach(({ event: { data: [error, info] } }) => {
						if (error.isModule) {
							const decoded = api.registry.findMetaError(error.asModule);
							const { documentation, method, section } = decoded;
							console.log(`${section}.${method}: ${documentation.join(' ')}`);
						} else {
							console.log(error.toString());
						}
						console.log(info)
					});
				}
				setLoading(false)
			});
		}
		send()

	}

	if ( formData === null ) return null

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
							options={project_entities}
							value={formData.entity}
							onChange={handleOnChange}
							/>
						<Form.Select
							fluid
							label='Country'
							name='country'
							placeholder='Country'
							options={countries}
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
							options={project_types}
							value={formData.usage}
							onChange={handleOnChange}

							/>
						<Form.Select
							fluid required
							label='Protocol'
							name='protocol'
							placeholder='Protocol'
							options={protocol_types}
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
							options={project_durations}
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

{/*					<Message
						header='Form Completed'
						content='You're all set and the campaign is scheduled.'
						/>
*/}

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
										(( formData.duration * blockTime ) + block),
										formData.protocol,
										( (formData.governance===false) ? 0 :  1),
										formData.cid
									],
									paramFields: [true,true,true,true,true,true,true,true]
								}}
							/>

        			</Container>

			</Form>

		</div>
	)

}

export default function Module (props) {

	const { accountPair } = props;
	const { api } = useSubstrate();

	return api && api.query.gameDaoCrowdfunding && accountPair
		? <Main {...props} />
		: null;

}

//
//
//
