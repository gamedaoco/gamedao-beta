import React, { lazy, Suspense, useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import Loader from './components/Loader'
import Layout from './layouts/default'

const Home = lazy(() => import('./apps/Home'))
const Dashboard = lazy(() => import('./apps'))
const Campaigns = lazy(() => import('./apps/Campaigns'))
const Organisations = lazy(() => import('./apps/Organisations'))
const Governance = lazy(() => import('./apps/Governance'))
const Tangram = lazy(() => import('./apps/Tangram'))
const Wallet = lazy(() => import('./apps/Wallet'))
const Designsystem = lazy(() => import('./apps/Designsystem'))

interface ComponentProps {
	children?: React.ReactNode
	path?: string
	exact?: boolean
	showFooter?: boolean
	showHeader?: boolean
}

const LayoutRoute = ({ children, path, exact, showFooter, showHeader }: ComponentProps) =>
	<Layout
		showHeader={ showHeader ? showHeader : null }
		showFooter={ showFooter ? showFooter : null }
		>
		<Route exact path={path}>
			<Suspense fallback={<Loader text="Loading..."></Loader>}>
				{children}
			</Suspense>
		</Route>
	</Layout>

const Router = (props) => {

	const [ accountPair, setAccountPair ] = useState(null)

	return (
		<>
			<Switch>
				<Route exact path="/">
					<Suspense fallback={<Loader text="Loading..."></Loader>}>
							<Home />
					</Suspense>
				</Route>

				<LayoutRoute exact path="/app" showHeader={true} showFooter={true}>
					<Dashboard accountPair={accountPair} />
				</LayoutRoute>

				<Layout showHeader={true} showFooter={true} >


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

					<Route exact path="/designsystem">
						<Suspense fallback={<Loader text="Loading..."></Loader>}>
							<Designsystem />
						</Suspense>
					</Route>

				</Layout>

			</Switch>
		</>
	)
}

export default Router
