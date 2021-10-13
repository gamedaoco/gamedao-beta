import React, { useState, createRef } from 'react'
import { useSubstrate } from './substrate-lib'
import styled from 'styled-components'

// TODO: refactor to mui
// comment: full page dimmers are an anti pattern
import Loader from './components/Loader'
// TODO: refactor to mui
import ErrorMessage from './components/Message'


import { Grid } from './components';
import Layout from './layouts/default'
import { Router } from './Router'


const Wrapper = styled.div`
	.react-icon {
		margin-right: 1em;
		margin-top: 2px;
	}
`

export function App() {

	const { apiState, keyring, keyringState, apiError } = useSubstrate()
	const [accountAddress, setAccountAddress] = useState(null)
	const accountPair = accountAddress && keyringState === 'READY' && keyring.getPair(accountAddress)

	if (apiState === 'ERROR') return <ErrorMessage err={apiError} />
	else if (apiState !== 'READY') return <Loader text="Connecting Network" />
	if (keyringState !== 'READY') return <Loader text="Loading accounts" />

	const contextRef = createRef()

	return (
		<Wrapper context={contextRef}>
				<Layout setAccountAddress={setAccountAddress} accountPair={accountPair}>
						<Grid container spacing={1} columns={16}>
								<Grid direction="row" stretched>
									<Router accountPair={accountPair}/>
								</Grid>
							</Grid>
					</Layout>
		</Wrapper>
	)
}