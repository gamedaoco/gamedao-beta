import React, { lazy, Suspense } from 'react'
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

export interface ComponentProps {
	children?: React.ReactNode
	path?: string
	exact?: boolean
	showFooter?: boolean
	showHeader?: boolean
	showSidebar?: boolean
}

const LayoutRoute = ({ children, path, exact, showFooter, showHeader, showSidebar }: ComponentProps) =>
	<Layout
		showHeader={ showHeader ? showHeader : null }
		showFooter={ showFooter ? showFooter : null }
		showSidebar={ showSidebar ? showSidebar : null }
		>
		<Route exact path={path}>
			<Suspense fallback={<Loader text="Loading..."></Loader>}>
				{children}
			</Suspense>
		</Route>
	</Layout>

const Router = (props) => {
	return (
		<>
			<Switch>
				<Route exact path="/">
					<Suspense fallback={<Loader text="Loading..."></Loader>}>
							<Home />
					</Suspense>
				</Route>

				<LayoutRoute exact path="/app" showHeader={true} showFooter={true}>
					<Dashboard/>
				</LayoutRoute>

				<Layout showHeader showFooter showSidebar >

					<Route exact path="/app/organisations">
						<Suspense fallback={<Loader text="Loading..."></Loader>}>
							<Organisations/>
						</Suspense>
					</Route>
					<Route exact path="/app/governance">
						<Suspense fallback={<Loader text="Loading..."></Loader>}>
							<Governance/>
						</Suspense>
					</Route>
					<Route exact path="/app/campaigns">
						<Suspense fallback={<Loader text="Loading..."></Loader>}>
							<Campaigns/>
						</Suspense>
					</Route>
					<Route exact path="/app/tangram">
						<Suspense fallback={<Loader text="Loading..."></Loader>}>
							<Tangram/>
						</Suspense>
					</Route>
					<Route exact path="/app/wallet">
						<Suspense fallback={<Loader text="Loading..."></Loader>}>
							<Wallet/>
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
