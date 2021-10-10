import React, { useState, createRef, lazy, Suspense } from 'react'
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";

import { SubstrateContextProvider, useSubstrate } from './substrate-lib'

import 'semantic-ui-css/semantic.min.css'
import { Container, Grid, Segment } from 'semantic-ui-react'
import styled from 'styled-components'
import { IconContext } from "react-icons"

import Loader from './components/Loader'
import ErrorMessage from './components/Message'
import Footer from './components/Footer'
import Header from './components/Header'

import Transfer from './components/Transfer'
import Template from './components/TemplateModule'

const Dashboard = lazy( () => import ('./apps') )
const Campaigns = lazy( () => import ('./apps/Campaigns') )
const Organisations = lazy( () => import ('./apps/Organisations') )
const Governance = lazy( () => import ('./apps/Governance') )
const Tangram = lazy( () => import ('./apps/Tangram') )
const Wallet = lazy( () => import ('./apps/Wallet') )

const DEV = (process.env.NODE_ENV!=='production')

const Wrapper = styled.div`
	.react-icon {
		margin-right: 1em;
		margin-top:2px;
	}
`

// const RouteWithSubRoutes = (route) => {
//   return (
//     <Route
//       path={route.path}
//       render={props => (
//         // pass the sub-routes down to keep nesting
//         <route.component {...props} routes={route.routes} />
//       )}
//     />
//   );
// }

function Main () {

	const { apiState, keyring, keyringState, apiError } = useSubstrate()
	const [ accountAddress, setAccountAddress ] = useState(null)
	const accountPair =
		accountAddress &&
		keyringState === 'READY' &&
		keyring.getPair(accountAddress)

	if (apiState === 'ERROR') return (<ErrorMessage err={apiError} />)
	else if (apiState !== 'READY') return (<Loader text='Connecting Network' />)
	if (keyringState !== 'READY') return (<Loader text='Loading accounts' />)

	const contextRef = createRef()

	// const routes = [{
	// 	path: "/",
	// 	component: Dashboard
	// },{
	// 	path: "/app",
	// 	component: Dashboard,
	// 	routes: [{
	// 		path: "/app/organisations",
	// 		component: Organisations
	// 	},{
	// 		path: "/app/governance",
	// 		component: Governance
	// 	},{
	// 		path: "/app/campaigns",
	// 		component: Campaigns
	// 	},{
	// 		path: "/app/tangram",
	// 		component: Tangram
	// 	}]
	// }];

	return (
		<Wrapper context={contextRef}>
			<IconContext.Provider value={{
				color: "black",
				className: "react-icon"
			}}>

				<Router>
					<Header
						setAccountAddress={setAccountAddress}
						accountPair={accountPair}
						/>
					<Segment vertical style={{ minHeight: '95vh', padding: '5em 0em', backgroundColor:'#f0f0f0' }}>
						<Container>
							<Grid>
								<Grid.Row stretched>
									<Switch>
{/*										{routes.map((route, i) => (
											<Suspense key={i} fallback={<Loader text="Loading..."></Loader>}>
												<RouteWithSubRoutes accountPair={accountPair} {...route} />
											</Suspense>
										))}*/}
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
								</Grid.Row>
							</Grid>
						</Container>
					</Segment>
			</Router>

			{ DEV &&
				<Segment vertical style={{ padding: '5em 1em', backgroundColor:'#999' }}>
					<Container>
							<Grid>
								<Grid.Row stretched>
									<Transfer
										accountPair={accountPair}
										accountAddress={accountAddress}
										setAccountAddress={setAccountAddress}
										/>
									<Template
										accountPair={accountPair}
										accountAddress={accountAddress}
										setAccountAddress={setAccountAddress}
										/>
								</Grid.Row>
							</Grid>
					</Container>
				</Segment>
			}

			<Footer/>

		</IconContext.Provider>
		</Wrapper>
	)
}

export default function App () {
	return (
		<SubstrateContextProvider>
			<Main />
		</SubstrateContextProvider>
	)
}
