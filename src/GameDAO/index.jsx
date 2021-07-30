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

import React, { useEffect, useState, lazy, Suspense } from 'react'
import { useSubstrate } from '../substrate-lib'

import { Menu, Label, Tab, Grid } from 'semantic-ui-react'
import Loader from '../components/Loader'

const DAO = lazy( () => import ('./DAO') )
const CreateDAO = lazy( () => import ('./DAO/Create') )
const Campaign = lazy( () => import ('./Campaign') )
const CreateCampaign = lazy( () => import ('./Campaign/Create') )

const Proposal = lazy( () => import ('./Proposal') )
import CreateProposal from './Proposal/Create'

const GameDAO = props => {

	const { accountPair } = props
	const { api } = useSubstrate()

	const [bodies, setBodies] = useState(null)
	const [campaigns, setCampaigns] = useState(null)
	const [proposals, setProposals] = useState(null)

	useEffect(()=>{

		let unsubscribe = null

		api.queryMulti([
			api.query.gameDaoControl.nonce,
			api.query.gameDaoCrowdfunding.nonce,
			api.query.gameDaoGovernance.nonce
		],([ bodies, campaigns, proposals ]) => {
			setBodies(bodies.toNumber())
			setCampaigns(campaigns.toNumber())
			setProposals(proposals.toNumber())
		}).then( unsub => {
			unsubscribe = unsub
		}).catch( console.error )

		return () => unsubscribe && unsubscribe()

	},[api])

	const panes = [

		{
			menuItem: (
				<Menu.Item key='2'>
					Organizations{ (bodies>0) && <Label circular color='pink'>{ bodies }</Label> }
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

//

		{
			menuItem:
				<Menu.Item key='proposals'>
					Proposals{ (proposals>0) && <Label circular color='teal'>{ proposals }</Label> }
				</Menu.Item>,
			render: () =>
				<Tab.Pane key='proposals'>
					<Proposal accountPair={accountPair} />
				</Tab.Pane>
		},
		{
			menuItem:
				<Menu.Item key='create_proposal'>
					Create Proposal
				</Menu.Item>,
			render: () =>
			<Tab.Pane key='create_proposal'><CreateProposal accountPair={accountPair} /></Tab.Pane>
		},

//

		{
			menuItem: (
				<Menu.Item key='4'>
					Campaigns{ (campaigns>0) && <Label circular color='blue'>{ campaigns }</Label> }
				</Menu.Item>
			),
			render: () =>
				<Tab.Pane key='campaigns'>
					<Campaign accountPair={accountPair}/>
				</Tab.Pane>
		},
		{
			menuItem: (<Menu.Item key='3'> Create Campaign </Menu.Item>),
			render: () =>
				<Tab.Pane key='create_campaign'>
					<CreateCampaign accountPair={accountPair} />
				</Tab.Pane>
			,
		},

	]

	return (
		<Grid.Column width={16}>
			<Suspense fallback={<Loader text="Loading..."></Loader>}>
				<Tab panes={ panes }/>
			</Suspense>
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
