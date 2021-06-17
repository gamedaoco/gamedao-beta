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
	Form
} from 'semantic-ui-react'

const jsonEndpoint = 'https://api.pinata.cloud/pinning/pinJSONToIPFS'

const generateState = () => {
	return {
		// general data (ipfs)
		title: faker.commerce.productName(),
		applicant_name: faker.name.findName(),
		applicant_email: faker.internet.email(),
		applicant_type: '',
		country: '',
		usage: '',
		description: faker.company.catchPhrase,
		accept: false,
		tags: ['dao','game'],
		// campaign data (network)
		cap: Math.round(Math.random()*100000),
		deposit: Math.round(Math.random()*10),
		duration: Math.round(Math.random()*100000),
		protocol: Math.round(Math.random()*5),
		governance: Math.round(Math.random()*1),
		// campaign cid should be a pinned
		// ipfs hash containing a json
		// with campaign data
		cid: 'cid',
	}
}

const initialState = generateState()

export const Main = props => {


	const { api } = useSubstrate()
	const { accountPair } = props
	const [ status, setStatus ] = useState('')
	const [ formData, updateFormData ] = useState(initialState)
	const [ nonce, updateNonce ] = useState(0)

	const generateIPFSBlob = () => { return {
		nonce: nonce,
		campaign_hash: null,
		creator_hash: accountPair.address,
		payload: formData,
		images: [
		// cids to images
		],
	}}

	useEffect(() => {

		let unsubscribe;

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

		const data = generateState()
		updateFormData({
			...formData,
			...data
		})

	},[nonce])

	const handleOnChange = e => {

		console.log( e.target.name, e.target.value )
		updateFormData({
			...formData,
			[e.target.name]: e.target.value
		})

	}

	const handleSubmit = e => {

		e.preventDefault()

		console.log('submit')

		const payload = [
			accountPair.address,
			formData.title,
			formData.cap,
			formData.deposit,
			formData.duration,
			formData.protocol,
			formData.governance,
			formData.cid
		]

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
			});
		}
		send()

	}

	// dropdown content

	const legal_entities = [
		{ key: '0', text: 'DAO / DAC / LAO', value: 'dao' },
		{ key: '1', text: 'Cooperative / LVC', value: 'coop' },
		{ key: '2', text: 'AG / SA', value: 'ag' },
		{ key: '3', text: 'GmbH / SARL / LLC', value: 'gmbh' },
		{ key: '4', text: 'Individual', value: 'individual' },
		{ key: '5', text: 'other', value: 'other' },
	]

	const application_entities = [
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
		{ key: '0', text: 'Europe', value: 'eu' },
		{ key: '1', text: 'Germany', value: 'de' },
		{ key: '2', text: 'Switzerland', value: 'ch' },
		{ key: '3', text: 'Liechtenstein', value: 'li' },
		{ key: '4', text: 'Austria', value: 'at' },
	]

	return (
		<div>

			<h1>Create Campaign</h1>

			<p>
				Fundraising is generally split into two phases:<br/><br/>
				1. the fundraising phase, where you promote your project and collect supporters with their funding.<br/>
				2. The project phase, where you need to decide in advance, how you want to release the raised funding:<br/><br/>
				Depending on the protocol ( Grant, Prepaid, Loan, Share ) the raised funds can be released in various ways,
				giving your supporters different types of guarantees and influence opportunity along the process of creating
				your project. If you choose to use DAO Governance, you will propose either milestones or deliverables
				which in turn release funds, when the DAO approves. If you don't utilise DAO Governance,
				the funding protocol will determine, how funds are paid to you:<br/><br/>
				A Grants pay immediately to you, the creator.<br/>
				B Prepaid campaigns release payments on a vesting schedule.<br/>
				(C Loans will release immediately to you, the creator.)<br/>
				(D Shares will immediately release, but imply further regulatory requirements.)<br/>
			</p>

			<Form>

					{/* campaign name to be listed as */}

					<Form.Input
						fluid
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
							label='Applicant Name'
							placeholder='Applicant Name'
							name='applicant_name'
							value={formData.applicant_name}
							onChange={handleOnChange}
							/>
						<Form.Input
							fluid
							label='Applicant Email'
							placeholder='Applicant Email'
							name='applicant_email'
							value={formData.applicant_email}
							onChange={handleOnChange}
							/>
					</Form.Group>

					<Form.Group widths='equal'>
						<Form.Select
							fluid
							label='Applicant Type'
							options={legal_entities}
							placeholder='Applicant Type'
							name='applicant_type'
							selected={formData.applicant_type}
							onChange={handleOnChange}
							/>
						<Form.Select
							fluid
							label='Country'
							selected={0}
							options={countries}
							placeholder='Country'
							name='country'
							selected={formData.country}
							onChange={handleOnChange}
							/>
					</Form.Group>

					{/* usage of funding and protocol to initiate after successfully raising */}

					<Form.Group widths='equal'>
						<Form.Select
							fluid
							label='Use of funds'
							options={application_entities}
							placeholder='Usage'
							name='usage'
							selected={formData.usage}
							onChange={handleOnChange}

							/>
						<Form.Select
							fluid
							label='Protocol'
							options={protocol_types}
							placeholder='Protocol'
							name='protocol'
							selected={formData.protocol}
							onChange={handleOnChange}
							/>
					</Form.Group>

					<Form.Checkbox
						label='DAO Governance'
						name='governance'
						selected={formData.governance}
						onChange={handleOnChange}
						/>

					<Form.Group widths='equal'>
						<Form.Input fluid label='Deposit (PLAY)' placeholder='Deposit' name='deposit' value={formData.deposit} onChange={handleOnChange} />
						<Form.Input fluid label='Funding Target (PLAY)' placeholder='Cap' name='target' value={formData.cap} onChange={handleOnChange} />
						<Form.Input fluid label='Campaign Duration (blocks)' placeholder='blocks' name='duration' value={formData.duration} onChange={handleOnChange} />
					</Form.Group>

{/*					<Form.TextArea label='Campaign Description' placeholder='Tell us more about your idea...' name='description' value={formData.description} onChange={handleOnChange} />
*/}
					<Form.Checkbox label='I agree to the Terms and Conditions' name='accept' selected={formData.accept} onChange={handleOnChange} />

					<Container textAlign='right'>
						{ accountPair && <Button onClick={handleSubmit}>Create Campaign Manually</Button> }
						{ accountPair &&
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
										formData.duration,
										formData.protocol,
										formData.governance,
										formData.cid
									],
									paramFields: [true,true,true,true,true,true,true,true]
								}}
							/>
						}
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
