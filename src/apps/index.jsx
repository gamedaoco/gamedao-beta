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

import { Menu, Label, Tab, Grid, Message, Modal, Button, Icon, Image } from 'semantic-ui-react'
import Loader from '../components/Loader'

import {
	BiJoystick,
	BiHomeCircle,
	BiListCheck,
	BiListPlus,
	BiCoinStack,
	BiCoin,
	BiPyramid,
	BiGame,
	BiPlus,
	BiDiamond,
} from "react-icons/bi";

const DAO = lazy( () => import ('./Organisations') )
// const CreateDAO = lazy( () => import ('./Organisations/Create') )
const Campaign = lazy( () => import ('./Campaigns') )
const CreateCampaign = lazy( () => import ('./Campaigns/Create') )
const Proposal = lazy( () => import ('./Governance') )
// const CreateProposal = lazy( () => import ( './Governance/Create' ) )
const Tangram = lazy( () => import ('./Tangram') )

const GameDAO = props => {

	const { accountPair } = props
	const { api } = useSubstrate()

	const [ open, setOpen ] = useState(true)
	const [ bodies, setBodies ] = useState(0)
	const [ campaigns, setCampaigns ] = useState(0)
	const [ proposals, setProposals ] = useState(0)
	const [ tangram, setTangram ] = useState(0)

	useEffect(()=>{

		let unsubscribe = null

		api.queryMulti([
			api.query.gameDaoControl.nonce,
			api.query.gameDaoCrowdfunding.nonce,
			api.query.gameDaoGovernance.nonce,
			// api.query.gameDaoTangram.nextTangramId
		],([ bodies, campaigns, proposals, creatures]) => {
			setBodies(bodies.toNumber())
			setCampaigns(campaigns.toNumber())
			setProposals(proposals.toNumber())
			// setTangram(tangram.toNumber())
		}).then( unsub => {
			unsubscribe = unsub
		}).catch( console.error )

		return () => unsubscribe && unsubscribe()

	},[api])

	const panes = [

		{
			menuItem: (
				<Menu.Item key='0'>
					<BiHomeCircle/> {' '}Organizations{ (bodies>0) && <Label circular color='pink'>{ bodies }</Label> }
				</Menu.Item>
			),
			render: () =>
				<Tab.Pane key='dao'>
					<DAO accountPair={accountPair} />
				</Tab.Pane>
			,
		},
		// {
		// 	menuItem: (<Menu.Item key='1'><BiPlus/> New Org </Menu.Item>),
		// 	render: () =>
		// 		<Tab.Pane key='create_dao'>
		// 			<CreateDAO accountPair={accountPair} />
		// 		</Tab.Pane>
		// 	,
		// },


//

		{
			menuItem: (
				<Menu.Item key='3'>
					<BiCoinStack />Campaigns{ (campaigns>0) && <Label circular color='blue'>{ campaigns }</Label> }
				</Menu.Item>
			),
			render: () =>
				<Tab.Pane key='campaigns'>
					<Campaign accountPair={accountPair}/>
				</Tab.Pane>
		},
		// {
		// 	menuItem: (<Menu.Item key='4'> <BiPlus/> New Campaign </Menu.Item>),
		// 	render: () =>
		// 		<Tab.Pane key='create_campaign'>
		// 			<CreateCampaign accountPair={accountPair} />
		// 		</Tab.Pane>
		// },

//

		{
			menuItem:
				<Menu.Item key='2'>
					<BiListCheck/> Proposals{ (proposals>0) && <Label circular color='teal'>{ proposals }</Label> }
				</Menu.Item>,
			render: () =>
				<Tab.Pane key='proposals'>
					<Proposal accountPair={accountPair} />
				</Tab.Pane>
		},
		// {
		// 	menuItem:
		// 		<Menu.Item key='create_proposal'>
		// 			<BiListPlus/> New Proposal
		// 		</Menu.Item>,
		// 	render: () =>
		// 	<Tab.Pane key='create_proposal'><CreateProposal accountPair={accountPair} /></Tab.Pane>
		// },

//

		{
			menuItem: (<Menu.Item key='5'> <BiDiamond/> Tangram </Menu.Item>),
			render: () =>
				<Tab.Pane key='tangram'>
					<Tangram accountPair={accountPair} />
				</Tab.Pane>
		},
	]

	return (
		<Grid.Column width={16}>
			<Suspense fallback={<Loader text="Loading..."></Loader>}>
				<Tab panes={ panes }/>
			</Suspense>

{/*			<Disclaimer open={open} setOpen={setOpen}/>*/}

		</Grid.Column>

	)

}

const Disclaimer = ({open,setOpen}) =>
	<Modal
		basic
		onClose={() => setOpen(false)}
		open={open}
		size='small'
		closeOnEscape={true}
		closeOnDimmerClick={false}
		>
		<Modal.Header>
			How it works
		</Modal.Header>
		<Modal.Content>
			GameDAO is built on zero network powered by <a href="substrate.dev" target="_blank">substrate</a>.
			To use it, you will need a running PolkadotJS Extension in your
			browser: <a href="https://polkadot.js.org/extension/" target="_blank">https://polkadot.js.org/extension/</a> as
			well as an address created inside of it.
			Furthermore you will need test token to do any transactions. We are running a faucet on
			our <a href="https://discord.gg/UJS4N85ukS" target="_blank">Discord Server</a>. Please join and say hello!
		</Modal.Content>
		<Modal.Actions>
			<Button color='green' inverted onClick={() => setOpen(false)}>
			<Icon name='checkmark' /> I understand
			</Button>
		</Modal.Actions>
	</Modal>

const Intro = props => {
	const [ open, setOpen ] = useState(true)
	return(
		<Disclaimer open={open} setOpen={setOpen}/>
	)
}

export default function Dapp (props) {

	const { accountPair } = props;
	const { api } = useSubstrate();

	return api && api.query.gameDaoCrowdfunding // && accountPair
		? <GameDAO {...props} />
		: <Intro />;

}

//
//
//
