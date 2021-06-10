import React, { useState, createRef } from 'react'
import 'semantic-ui-css/semantic.min.css'

import { SubstrateContextProvider, useSubstrate } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'

import { Container, Grid, Sticky } from 'semantic-ui-react'

import AccountSelector from './components/AccountSelector'
import Balances from './components/Balances'
import BlockNumber from './components/BlockNumber'
import Events from './components/Events'
import Interactor from './components/Interactor'
import Metadata from './components/Metadata'
import NodeInfo from './components/NodeInfo'
import TemplateModule from './components/TemplateModule'
import Transfer from './components/Transfer'
import Upgrade from './components/Upgrade'

import Loader from './components/Loader'
import Message from './components/Message'

export const Network = () => {

	const [ accountAddress, setAccountAddress ] = useState(null)
	const { apiState, keyring, keyringState, apiError } = useSubstrate()
	const accountPair =
		accountAddress &&
		keyringState === 'READY' &&
		keyring.getPair(accountAddress)

	if (apiState === 'ERROR') return (<Message err={apiError} />)
	else if (apiState !== 'READY') return (<Loader text='Connecting to ZERO.IO' />)
	if (keyringState !== 'READY') return (<Loader text='Loading accounts' />)

	return (
		<React.Fragment>
			<Grid stackable columns='equal'>

				<Grid.Row stretched>
					<NodeInfo />
					<Metadata />
					<BlockNumber />
					<BlockNumber finalized />
				</Grid.Row>

				<Grid.Row stretched>
					{/*<Balances />*/}
				</Grid.Row>

				<Grid.Row stretched>
					<Interactor accountPair={accountPair} />
				</Grid.Row>

				<Grid.Row stretched>
					<Events />
				</Grid.Row>

			</Grid>
			<DeveloperConsole />
		</React.Fragment>
	)
}

export default Network
