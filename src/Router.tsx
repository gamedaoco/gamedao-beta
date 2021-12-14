import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Loader } from './components/Loader'
import Layout from './layouts/default'

import { GovernancePage } from './apps/Governance/GovernancePage'
import { GovernanceProposalInfoPage } from './apps/governanceProposalInfo/GovernanceProposalInfo'

const Home = lazy(() => import('./apps/Home'))
const Dashboard = lazy(() => import('./apps'))
const Campaigns = lazy(() => import('./apps/Campaigns'))
const Campaign = lazy(() => import('./apps/Campaigns/Campaign'))
const Organisations = lazy(() => import('./apps/Organisations'))
const DAOAdmin = lazy(() => import('./apps/Organisations/admin'))
const DAODashboard = lazy(() => import('./apps/Organisations/dashboard'))
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
	noContainer?: boolean
}

const LayoutRoute = ({
	showFooter,
	showHeader,
	showSidebar,
	element,
	noContainer,
}: ComponentProps) => (
	<Layout
		showHeader={showHeader ? showHeader : null}
		showFooter={showFooter ? showFooter : null}
		showSidebar={showSidebar ? showSidebar : null}
		noContainer={noContainer ? noContainer : null}
	>
		{element}
	</Layout>
)

const Router = (props) => {
	return (
		<Suspense
			fallback={
				<LayoutRoute showSidebar showHeader showFooter element={<Loader text="" />} />
			}
		>
			<Routes>
				<Route path="/" element={<LayoutRoute showFooter element={<Home />} />}></Route>
				<Route
					path="/app"
					element={
						<LayoutRoute showSidebar showHeader showFooter element={<Dashboard />} />
					}
				></Route>
				<Route
					path="/app/organisations"
					element={
						<LayoutRoute
							showSidebar
							showHeader
							showFooter
							element={<Organisations />}
						/>
					}
				></Route>
				<Route
					path="/app/governance"
					element={
						<LayoutRoute
							showSidebar
							showHeader
							showFooter
							element={<GovernancePage />}
						/>
					}
				></Route>
				<Route
					path="/app/governance/:proposalId"
					element={
						<LayoutRoute
							showSidebar
							showHeader
							showFooter
							element={<GovernanceProposalInfoPage />}
						/>
					}
				></Route>
				<Route
					path="/app/campaigns/:id"
					element={
						<LayoutRoute showSidebar noContainer showFooter element={<Campaign />} />
					}
				></Route>
				<Route
					path="/app/campaigns"
					element={
						<LayoutRoute showSidebar showHeader showFooter element={<Campaigns />} />
					}
				></Route>
				<Route
					path="/app/tangram"
					element={
						<LayoutRoute showSidebar showHeader showFooter element={<Tangram />} />
					}
				></Route>
				<Route
					path="/app/wallet"
					element={<LayoutRoute showSidebar showHeader showFooter element={<Wallet />} />}
				></Route>
				<Route
					path="/app/designsystem"
					element={
						<LayoutRoute showSidebar showHeader showFooter element={<Designsystem />} />
					}
				></Route>
				<Route
					path="/app/organisations/admin/:id"
					element={
						<LayoutRoute showSidebar showHeader showFooter element={<DAOAdmin />} />
					}
				></Route>
				<Route
					path="/app/organisations/:id"
					element={
						<LayoutRoute showSidebar showHeader showFooter element={<DAODashboard />} />
					}
				></Route>
			</Routes>
		</Suspense>
	)
}

export default Router
