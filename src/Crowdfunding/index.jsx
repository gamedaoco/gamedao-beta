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
import { TxButton } from '../substrate-lib/components'

import { Container, Menu, Label, Segment, Tab, Form, Input, Grid, Card, Statistic, Divider } from 'semantic-ui-react'

import Campaigns from './components/Campaigns'
import Create from './components/Create'

const Loader = text => <Dimmer active> <Loader size='small'>{text}</Loader> </Dimmer>

const Crowdfunding = props => {

	const { accountPair } = props
	const { api, keyring } = useSubstrate()
	const [ state, setState ] = useState({
		all: 0,
		owned: 0,
		contributed: 0,
	})

	useEffect(() => {

		if (!accountPair) return

		const asyncSubscription = async () => {

			let unsubscribe;
			let all, contributed, owned

			api.queryMulti([
				api.query.gameDao.allCampaignsCount,
				[api.query.gameDao.contributedCampaignsCount,accountPair.address],
				[api.query.gameDao.ownedCampaignsCount,accountPair.address],
			],([all,contributed,owned]) => {
				const _state = {
					...state,
					all: all.toNumber(),
					contributed: contributed.toNumber(),
					owned: owned.toNumber(),
				}
				setState(_state)
			}).then(unsub => {
				unsubscribe = unsub;
			}).catch(console.error);

			return () => unsubscribe && unsubscribe()

		}
		asyncSubscription()

	}, [api.query.gameDao, accountPair]);

	const panes = [
		{
			menuItem: (
				<Menu.Item key='campaigns'>
					All Campaigns<Label>{state.all}</Label>
				</Menu.Item>
			),
			render: () =>
				<Tab.Pane key="campaigns">
					<Campaigns accountPair={accountPair}/>
				</Tab.Pane>
		},
		{
			menuItem: (
				<Menu.Item key='contributions'>
					My Contributions<Label>{state.contributed}</Label>
				</Menu.Item>
			),
			render: () => null
			// 	<Tab.Pane key="contributions">
			// 		<Campaigns filter={'contributed'}/>
			// 	</Tab.Pane>
		},
		{
			menuItem: (
				<Menu.Item key=''>
					My Campaigns<Label>{state.owned}</Label>
				</Menu.Item>
			),
			render: () => null
			// 	<Tab.Pane key="requests">
			// 		<Campaigns filter={'owned'} />
			// 	</Tab.Pane>
		},
		{	menuItem: 'Create Campaign',
			render: () =>
				<Tab.Pane key="create">
					<Create />
				</Tab.Pane>
			,
		},
		{
			menuItem: (
				<Menu.Item key='nft'>
					NFT<Label></Label>
				</Menu.Item>
			),
			render: () => null
			// 	<Tab.Pane key="contributions">
			// 		<Campaigns filter={'contributed'}/>
			// 	</Tab.Pane>
		},
	]

	return (
		<Container>
			<Tab panes={ panes }/>
		</Container>
	)

}

export default Crowdfunding

//
//
//
