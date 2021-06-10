import React, { useState, createRef } from 'react'
import 'semantic-ui-css/semantic.min.css'

import { SubstrateContextProvider, useSubstrate } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'

import { Container, Grid, Sticky } from 'semantic-ui-react'
import AccountSelector from './components/AccountSelector'
import Loader from './components/Loader'
import Message from './components/Message'

import GameDAO from './GameDAO'

function Main () {

	const [sidebar, setSidebar] = useState(true)

	const [ accountAddress, setAccountAddress ] = useState(null)
	const { apiState, keyring, keyringState, apiError } = useSubstrate()
	const accountPair =
		accountAddress &&
		keyringState === 'READY' &&
		keyring.getPair(accountAddress)

	if (apiState === 'ERROR') return (<Message err={apiError} />)
	else if (apiState !== 'READY') return (<Loader text='Connecting to ZERO.IO' />)

	if (keyringState !== 'READY') return (<Loader text='Loading accounts' />)

	const contextRef = createRef()

	return (
		<React.Fragment>
			<div ref={contextRef}>

				<Sticky context={contextRef}>
					<AccountSelector setAccountAddress={setAccountAddress} />
				</Sticky>

				<Container>
					<Grid>
						<Grid.Row stretched>
							<GameDAO accountPair={accountPair}/>
						</Grid.Row>
					</Grid>
				</Container>

			</div>
		</React.Fragment>
	)
}

export default function App () {
	return (
		<SubstrateContextProvider>
			<Main />
		</SubstrateContextProvider>
	)
}
