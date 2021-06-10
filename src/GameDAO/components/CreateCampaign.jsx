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

import { useSubstrate } from '../../substrate-lib'
import { TxButton } from '../../substrate-lib/components'

import {
	Container,
	Segment,
	Tab,
	Grid,
	Card,
	Statistic,
	Divider
} from 'semantic-ui-react'

import {
	Button,
	Checkbox,
	Dropdown,
	Form,
	Input,
	TextArea,
} from 'formik-semantic-ui';

//
//
//

export const Create = props => {

	const { api } = useSubstrate()
	const { accountPair, accountAddress } = props
	console.log( 'address', accountPair && accountPair.address )

	const [ status, setStatus ] = useState(true)

	const initialState = {
		// to ipfs
		applicant_name: '',
		applicant_type: '',
		country: '',
		usage: '',
		description: '',
		accept: false,
		// to contract
		campaign_name: '',
		protocol: '',
		deposit: '',
		target: '',
		duration: '',
		governance: false,
	}

	const [ formData, setFormData ] = useState(initialState)
	const { campaign_name, deposit, target, duration } = formData

	const handleSubmit = (values, formikApi) => {

	    console.log(values);

		const subscribe = async () => {

			console.log('create')

			const c = [
				accountPair.address,
	    		'test',
	    		10000,
	    		10,
	    		5000,
	    		1,
	    		1,
	    		0
	    	]

		    const campaign = api.tx.gameDaoCrowdfunding.create(...c)
		    const send = campaign.signAndSend(
		    	accountPair, ({ status, events }) => {
					if (status.isInBlock || status.isFinalized) {
						events.filter(({ event }) =>
							api.events.system.ExtrinsicFailed.is(event)
						)
						.forEach(({ event: { data: [error, info] } }) => {
							if (error.isModule) {
								const decoded = api.registry.findMetaError(error.asModule);
								const { documentation, method, section } = decoded;
								console.log(`${section}.${method}: ${documentation.join(' ')}`);
							} else {
								console.log(error.toString());
							}
						});
						formikApi.setSubmitting(false)
					}
				}
			)

		}
		subscribe()

		// setTimeout(() => {
		// 	Object.keys(values).forEach(key => {
		// 		formikApi.setFieldError(key, 'Some Error');
		// 	});
		// 	formikApi.setSubmitting(false);
		// }, 1000);
	};

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
				the funding protocol will determine, how funds are paid to you:<br/>
				- Grants pay immediately to you, the creator.<br/>
				- Prepaid campaigns release payments on a vesting schedule.<br/>
				- Loans will release immediately to you, the creator.<br/>
				- Shares will immediately release, but imply further regulatory requirements.<br/>
			</p>

			<Form
				initialValues={initialState}
				onSubmit={ handleSubmit }
				render={({ handleReset }) => (

					<Form.Children>

					{/* campaign name to be listed as */}

					<Form.Input
						fluid
						label='Campaign name' placeholder='Campaign name' name={campaign_name} />

					{/* legal body applying for the funding */}

					<Form.Group widths='equal'>
						<Form.Input
							fluid
							label='Applicant Name'
							placeholder='Applicant Name'
							name='applicant_name'
							/>
						<Form.Select
							fluid
							label='Applicant Type'
							options={legal_entities}
							placeholder='Applicant Type'
							name='applicant_type'
							/>
						<Form.Select
							fluid
							label='Country'
							selected={0}
							options={countries}
							placeholder='Country'
							name='country'
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
							/>
						<Form.Select
							fluid
							label='Protocol'
							options={protocol_types}
							placeholder='Protocol'
							name='protocol'
							/>

					</Form.Group>
						<Form.Checkbox
							label='DAO Governance'
							name='governance'
							/>

					{/*  */}

					<Form.Group widths='equal'>
						<Form.Input fluid label='Deposit (PLAY)' placeholder='Deposit'  name='deposit' />
						<Form.Input fluid label='Funding Target (PLAY)' placeholder='Cap'  name='target' />
						<Form.Input fluid label='Campaign Duration (blocks)' placeholder='blocks'  name='duration' />
					</Form.Group>

					<Form.TextArea label='Campaign Description' placeholder='Tell us more about your idea...'  name='description' />

					<Form.Checkbox label='I agree to the Terms and Conditions'  name='accept'/>

					<Container textAlign='right'>

						<Form.Button>Submit</Form.Button>

						{ accountPair &&
							// admin: T::AccountId,
							// name: Vec<u8>,
							// target: T::Balance,
							// deposit: T::Balance,
							// expiry: T::BlockNumber,
							// TODO:current block + duration
							// protocol: u8,
							// governance: bool
							<TxButton
								accountPair={ accountPair }
								label='Create'
								type='SIGNED-TX'
								setStatus={ setStatus }
								attrs={{
									palletRpc: 'gameDao',
									callable: 'create',
									inputParams: [
										accountPair.address,
										formData.campaign_name,
										formData.target,
										formData.deposit,
										formData.duration,
										formData.protocol,
										formData.governance,
									],
									paramFields: [
									true, true,
									true,true,true,true,true
									]
								}}
								/>
						}

					</Container>
				</Form.Children>
			)}/>

		</div>
	)

}

export default Create

//
//
//
