import React, { useState, createRef, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { SubstrateContextProvider, useSubstrate } from './substrate-lib'

// TODO: remove when all semantic deps are gone
import 'semantic-ui-css/semantic.min.css'

import { Container, Grid } from '@mui/material';
import styled from 'styled-components'
import { IconContext } from 'react-icons'

//

// TODO: refactor to mui
import Loader from './components/Loader'
// TODO: refactor to mui
import ErrorMessage from './components/Message'

import Layout from './layouts/default'

import Transfer from './components/Transfer'
import Template from './components/TemplateModule'

// pages

const Home = lazy(() => import('./apps/Home'))
const Dashboard = lazy(() => import('./apps'))
const Campaigns = lazy(() => import('./apps/Campaigns'))
const Organisations = lazy(() => import('./apps/Organisations'))
const Governance = lazy(() => import('./apps/Governance'))
const Tangram = lazy(() => import('./apps/Tangram'))
const Wallet = lazy(() => import('./apps/Wallet'))

//

const DEV = process.env.NODE_ENV !== 'production'

const Wrapper = styled.div`
	.react-icon {
		margin-right: 1em;
		margin-top: 2px;
	}
`

function Main() {

	const { apiState, keyring, keyringState, apiError } = useSubstrate()
	const [accountAddress, setAccountAddress] = useState(null)
	const accountPair = accountAddress && keyringState === 'READY' && keyring.getPair(accountAddress)

	if (apiState === 'ERROR') return <ErrorMessage err={apiError} />
	else if (apiState !== 'READY') return <Loader text="Connecting Network" />
	if (keyringState !== 'READY') return <Loader text="Loading accounts" />

	const contextRef = createRef()

	return (
		<Wrapper context={contextRef}>

			<IconContext.Provider
				value={{
					color: 'black',
					className: 'react-icon',
				}}
			>
			<Router>
				<Layout setAccountAddress={setAccountAddress} accountPair={accountPair}>
						<Grid container spacing={1} columns={16}>
								<Grid direction="row" stretched>

									<Switch>

										<Route exact path="/">
											<Suspense fallback={<Loader text="Loading..."></Loader>}>
												<Home/>
											</Suspense>
										</Route>
										<Route exact path="/app">
											<Suspense fallback={<Loader text="Loading..."></Loader>}>
												<Dashboard accountPair={accountPair} />
											</Suspense>
										</Route>
										<Route exact path="/app/organisations">
											<Suspense fallback={<Loader text="Loading..."></Loader>}>
												<Organisations accountPair={accountPair} />
											</Suspense>
										</Route>
										<Route exact path="/app/governance">
											<Suspense fallback={<Loader text="Loading..."></Loader>}>
												<Governance accountPair={accountPair} />
											</Suspense>
										</Route>
										<Route exact path="/app/campaigns">
											<Suspense fallback={<Loader text="Loading..."></Loader>}>
												<Campaigns accountPair={accountPair} />
											</Suspense>
										</Route>
										<Route exact path="/app/tangram">
											<Suspense fallback={<Loader text="Loading..."></Loader>}>
												<Tangram accountPair={accountPair} />
											</Suspense>
										</Route>
										<Route exact path="/app/wallet">
											<Suspense fallback={<Loader text="Loading..."></Loader>}>
												<Wallet accountPair={accountPair} />
											</Suspense>
										</Route>

									</Switch>

								</Grid>
							</Grid>
					</Layout>
				</Router>
			</IconContext.Provider>
		</Wrapper>
	)
}

export default function App() {
	return (
		<SubstrateContextProvider>
			<Main />
		</SubstrateContextProvider>
	)
}
