import React, { useState } from 'react'
import 'semantic-ui-css/semantic.min.css'

import { useSubstrate } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'

import { Grid } from 'semantic-ui-react'

import BlockNumber from './components/BlockNumber'
import Events from './components/Events'
import Interactor from './components/Interactor'
import Metadata from './components/Metadata'
import NodeInfo from './components/NodeInfo'

import Loader from './components/Loader'
import Message from './components/Message'

export const Network = () => {
	const [accountAddress] = useState(null)
	const { apiState, keyring, keyringState, apiError } = useSubstrate()
	const accountPair = accountAddress && keyringState === 'READY' && keyring.getPair(accountAddress)

	if (apiState === 'ERROR') return <Message err={apiError} />
	else if (apiState !== 'READY') return <Loader text="Connecting to ZERO.IO" />
	if (keyringState !== 'READY') return <Loader text="Loading accounts" />

	return (
		<React.Fragment>
			<Grid stackable columns="equal">
				<Grid.Row stretched>
					<NodeInfo />
					<Metadata />
					<BlockNumber />
					<BlockNumber finalized />
				</Grid.Row>

				<Grid.Row stretched>{/*<Balances />*/}</Grid.Row>

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
