import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { DEV } from './config'
import { Loader } from './components'
import Layout from './layouts/default'

const Home = lazy(() => import('./apps/Home'))
const App = lazy(() => import('./apps/'))

const Dashboard = lazy(() => import('./apps/Dashboard'))

const Campaigns = lazy(() => import('./apps/Campaigns'))
const Campaign = lazy(() => import('./apps/Campaigns/Campaign'))

const Organisations = lazy(() => import('./apps/Organisations'))
const OrganisationsDashboard = lazy(() => import('./apps/OrganisationsDashboard'))
const DAOAdmin = lazy(() => import('./apps/Organisations/admin'))

const Tangram = lazy(() => import('./apps/Tangram'))
const Wallet = lazy(() => import('./apps/Wallet'))

const Designsystem = DEV && lazy(() => import('./apps/Designsystem'))

const Governance = lazy(() => import('./apps/Governance'))
const GovernanceDetails = lazy(() => import('./apps/GovernanceInfo'))

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
					element={<LayoutRoute showSidebar showHeader showFooter element={<App />} />}
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
						<LayoutRoute showSidebar showHeader showFooter element={<Governance />} />
					}
				></Route>
				<Route
					path="/app/governance/:proposalId"
					element={
						<LayoutRoute
							showSidebar
							showHeader
							showFooter
							element={<GovernanceDetails />}
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
				{}
				{DEV && (
					<Route
						path="/app/designsystem"
						element={
							<LayoutRoute
								showSidebar
								showHeader
								showFooter
								element={<Designsystem />}
							/>
						}
					></Route>
				)}
				<Route
					path="/app/organisations/admin/:id"
					element={
						<LayoutRoute showSidebar showHeader showFooter element={<DAOAdmin />} />
					}
				></Route>
				<Route
					path="/app/organisations/:id"
					element={
						<LayoutRoute
							showSidebar
							showHeader
							showFooter
							element={<OrganisationsDashboard />}
						/>
					}
				></Route>
			</Routes>
		</Suspense>
	)
}

export default Router
