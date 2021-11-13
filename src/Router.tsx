import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Loader from './components/Loader'
import Layout from './layouts/default'

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
	element?: React.ReactNode
}

const LayoutRoute = ({ showFooter, showHeader, showSidebar, element }: ComponentProps) => (
	<Layout showHeader={showHeader ? showHeader : null} showFooter={showFooter ? showFooter : null} showSidebar={showSidebar ? showSidebar : null}>
		{element}
	</Layout>
)

const Router = (props) => {
	return (
		<Suspense fallback={<Loader text="Loading..."></Loader>}>
			<Routes>
				<Route path="/" element={<LayoutRoute showFooter element={<Home />} />}></Route>
				<Route path="/app" element={<LayoutRoute showSidebar showHeader showFooter element={<Dashboard />} />}></Route>
				<Route path="/app/organisations" element={<LayoutRoute showSidebar showHeader showFooter element={Organisations} />}></Route>
				<Route path="/app/governance" element={<LayoutRoute showSidebar showHeader showFooter element={<Governance />} />}></Route>
				<Route path="/app/campaigns" element={<LayoutRoute showSidebar showHeader showFooter element={<Campaigns />} />}></Route>
				<Route path="/app/tangram" element={<LayoutRoute showSidebar showHeader showFooter element={<Tangram />} />}></Route>
				<Route path="/app/wallet" element={<LayoutRoute showSidebar showHeader showFooter element={<Wallet />} />}></Route>
				<Route path="/app/designsystem" element={<LayoutRoute showSidebar showHeader showFooter element={<Designsystem />} />}></Route>
				<Route path="/app/organisations/admin/:id" element={<LayoutRoute showSidebar showHeader showFooter element={<DAOAdmin />} />}></Route>
				<Route path="/app/organisations/:id" element={<LayoutRoute showSidebar showHeader showFooter element={<DAODashboard />} />}></Route>
			</Routes>
		</Suspense>
	)
}

export default Router
