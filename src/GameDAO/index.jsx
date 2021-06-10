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
// import Loader from '../components/Loader'
import Campaigns from './components/Campaigns'
import CreateCampaign from './components/Create'

const GameDAO = props => {

	const { accountPair, accountAddress } = props
	const { api, keyring } = useSubstrate()
	const [ state, setState ] = useState({
		campaigns: 0,
		proposals: 0,
	})

	useEffect(() => {
		if (!accountPair) return
		let unsubscribe = null
		api.query.gameDaoGovernance.nonce(number => {
			setState({
				...state,
				proposals: number.toNumber()
			})
		}).then( unsub => {
			unsubscribe = unsub
		}).catch( console.error )
		return () => unsubscribe && unsubscribe()
	}, [accountPair])

	useEffect(() => {
		if (!accountPair) return
		let unsubscribe = null
		api.query.gameDaoCrowdfunding.nonce(number => {
			setState({
				...state,
				campaigns: number.toNumber()
			})
		}).then( unsub => {
			unsubscribe = unsub
		}).catch( console.error )
		return () => unsubscribe && unsubscribe()
	}, [accountPair])

	const panes = [

		{
			menuItem: (
				<Menu.Item key='campaigns'>
					All Campaigns<Label>{state.campaigns}</Label>
				</Menu.Item>
			),
			render: () =>
				<Tab.Pane key='campaigns'>
					<Campaigns accountPair={accountPair}/>
				</Tab.Pane>
		},
		{
			menuItem: 'Create Campaign',
			render: () =>
				<Tab.Pane key='create_campaign'>
					<CreateCampaign
						accountPair={accountPair}
						accountAddress={accountAddress}
						/>
				</Tab.Pane>
			,
		},
		{
			menuItem:
				<Menu.Item key='proposals'>
					Proposals<Label>{state.proposals}</Label>
				</Menu.Item>,
			render: () =>
				<Tab.Pane key='proposals'><div>Proposals</div></Tab.Pane>
		},
		{
			menuItem:
				<Menu.Item key='create_proposal'>
					Create Proposal
				</Menu.Item>,
			render: () =>
			<Tab.Pane key='create_proposal'><div>Create Proposal</div></Tab.Pane>
		},
	]

	return (
		<Grid.Column width={16}>
			<Tab panes={ panes }/>
		</Grid.Column>
	)

}

export default GameDAO

//
//
//
