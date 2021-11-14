import React, { lazy, Suspense } from 'react'
import { Switch, Route } from 'react-router-dom'
import Loader from './components/Loader'
import Layout from './layouts/default'

const Home = lazy(() => import('./apps/Home'))
const Dashboard = lazy(() => import('./apps'))
const Campaigns = lazy(() => import('./apps/Campaigns'))
const Campaign = lazy(() => import('./apps/Campaigns/Campaign'))
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
	noContainer?: boolean
}

const LayoutRoute = ({ children, path, exact, showFooter, showHeader, showSidebar, noContainer }: ComponentProps) => (
	<Layout showHeader={showHeader ? showHeader : null} showFooter={showFooter ? showFooter : null} noContainer={noContainer ? noContainer : null} showSidebar={showSidebar ? showSidebar : null}>
		<Route exact path={path}>
			<Suspense fallback={<Loader text="Loading..."></Loader>}>{children}</Suspense>
		</Route>
	</Layout>
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

			<LayoutRoute exact path="/app/organisations" showSidebar showHeader showFooter>
				<Organisations />
			</LayoutRoute>
			<LayoutRoute exact path="/app/governance" showSidebar showHeader showFooter>
				<Governance />
			</LayoutRoute>
			<LayoutRoute exact path="/app/campaigns" showSidebar showHeader showFooter>
				<Campaigns />
			</LayoutRoute>
			<LayoutRoute exact path="/app/campaign/:id" showSidebar noContainer showFooter>
				<Campaign />
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
