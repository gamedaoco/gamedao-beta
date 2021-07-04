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
import { useSubstrate } from '../substrate-lib'

import { Menu, Label, Tab, Grid } from 'semantic-ui-react'

import DAO from './DAO'
import CreateDAO from './DAO/Create'
import Campaign from './Campaign'
import CreateCampaign from './Campaign/Create'
// import Proposal from './Proposal'
// import CreateProposal from './Proposal/Create'

const GameDAO = props => {

	const { accountPair } = props
	const { api } = useSubstrate()

	const [bodies, setBodies] = useState(null)
	const [campaigns, setCampaigns] = useState(null)
	const [proposals, setProposals] = useState(null)

	useEffect(() => {

		let unsubscribe = null

		api.query.gameDaoControl.nonce(n => {
			setBodies(n.toNumber())
		}).then( unsub => {
			unsubscribe = unsub
		}).catch( console.error )

		return () => unsubscribe && unsubscribe()

	}, [api.query.gameDaoControl])

	useEffect(() => {

		let unsubscribe = null

		api.query.gameDaoCrowdfunding.nonce(n => {
			setCampaigns(n.toNumber())
		}).then( unsub => {
			unsubscribe = unsub
		}).catch( console.error )

		return () => unsubscribe && unsubscribe()

	}, [api.query.gameDaoCrowdfunding])

	const panes = [

		{
			menuItem: (
				<Menu.Item key='2'>
					Organizations{ (bodies>0) && <Label>{ bodies }</Label> }
				</Menu.Item>
			),
			render: () =>
				<Tab.Pane key='dao'>
					<DAO accountPair={accountPair} />
				</Tab.Pane>
			,
		},
		{
			menuItem: (<Menu.Item key='1'> Create Organization </Menu.Item>),
			render: () =>
				<Tab.Pane key='create_dao'>
					<CreateDAO accountPair={accountPair} />
				</Tab.Pane>
			,
		},


		{
			menuItem: (<Menu.Item key='3'> Create Campaign </Menu.Item>),
			render: () =>
				<Tab.Pane key='create_campaign'>
					<CreateCampaign
						accountPair={accountPair}
						/>
				</Tab.Pane>
			,
		},

		{
			menuItem: (
				<Menu.Item key='4'>
					Campaigns{ (campaigns>0) && <Label>{ campaigns }</Label> }
				</Menu.Item>
			),
			render: () =>
				<Tab.Pane key='campaigns'>
					<Campaign accountPair={accountPair}/>
				</Tab.Pane>
		},

		// {
		// 	menuItem:
		// 		<Menu.Item key='proposals'>
		// 			Proposals{ (proposals>0) && <Label>{ proposals }</Label> }
		// 		</Menu.Item>,
		// 	render: () =>
		// 		<Tab.Pane key='proposals'><div>Proposals</div></Tab.Pane>
		// },
		// {
		// 	menuItem:
		// 		<Menu.Item key='create_proposal'>
		// 			Create Proposal
		// 		</Menu.Item>,
		// 	render: () =>
		// 	<Tab.Pane key='create_proposal'><div>Create Proposal</div></Tab.Pane>
		// },
	]

	return (
		<Grid.Column width={16}>
			<Tab panes={ panes }/>
		</Grid.Column>
	)

}

export default function Dapp (props) {

	const { accountPair } = props;
	const { api } = useSubstrate();

	return api && api.query.gameDaoCrowdfunding && accountPair
		? <GameDAO {...props} />
		: null;

}

//
//
//
