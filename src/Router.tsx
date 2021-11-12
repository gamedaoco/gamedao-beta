import React, { lazy, Suspense } from 'react'
import { Switch, Route } from 'react-router-dom'
import Loader from './components/Loader'
import LayoutDefault from './layouts/default'

const Home = lazy(() => import('./apps/Home'))
const Dashboard = lazy(() => import('./apps'))
const Campaigns = lazy(() => import('./apps/Campaigns'))
const Organisations = lazy(() => import('./apps/Organisations'))
const DAOAdmin = lazy(() => import('./apps/Organisations/admin'))
const DAODashboard = lazy(() => import('./apps/Organisations/dashboard'))
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

const LayoutRoute = ({ children, path, exact, showFooter, showHeader, showSidebar }: ComponentProps) => (
	<LayoutDefault showHeader={showHeader ? showHeader : null} showFooter={showFooter ? showFooter : null} showSidebar={showSidebar ? showSidebar : null}>
		<Route exact path={path}>
			<Suspense fallback={<Loader text="Loading..."></Loader>}>{children}</Suspense>
		</Route>
	</LayoutDefault>
)

const Router = (props) => {
	return (
		<Switch>
			<LayoutRoute exact path="/" showFooter>
				<Home />
			</LayoutRoute>

			<LayoutRoute exact path="/app" showSidebar showHeader showFooter>
				<Dashboard />
			</LayoutRoute>

			<LayoutRoute path="/app/organisations/admin/:id" showSidebar showHeader showFooter>
				<DAOAdmin />
			</LayoutRoute>
			<LayoutRoute path="/app/organisations/:id" showSidebar showHeader showFooter>
				<DAODashboard />
			</LayoutRoute>
			<LayoutRoute exact path="/app/organisations" showSidebar showHeader showFooter>
				<Organisations />
			</LayoutRoute>

			<LayoutRoute exact path="/app/governance" showSidebar showHeader showFooter>
				<Governance />
			</LayoutRoute>
			<LayoutRoute exact path="/app/campaigns" showSidebar showHeader showFooter>
				<Campaigns />
			</LayoutRoute>
			<LayoutRoute exact path="/app/tangram" showSidebar showHeader showFooter>
				<Tangram />
			</LayoutRoute>
			<LayoutRoute exact path="/app/wallet" showSidebar showHeader showFooter>
				<Wallet />
			</LayoutRoute>

			<LayoutRoute exact path="/designsystem" showSidebar showHeader showFooter>
				<Designsystem />
			</LayoutRoute>
		</Switch>
	)
}

export default Router
