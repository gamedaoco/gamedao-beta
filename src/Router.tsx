import React, { Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Loader } from './components'
import Layout from './layouts/default'
import { BetaPage } from './apps/BetaPage/BetaPage'
import { useWallet } from './context/Wallet'
import { QuestPage } from './apps/QuestPage/QuestPage'

import Home from './apps/Home'
import Dashboard from './apps/Dashboard'
import Campaigns from './apps/Campaigns'
import Campaign from './apps/Campaigns/Campaign'

import Organisations from './apps/Organisations'
import OrganisationsDashboard from './apps/OrganisationsDashboard'
import DAOAdmin from './apps/Organisations/admin'

import Tangram from './apps/Tangram'
import Wallet from './apps/Wallet'
import Governance from './apps/Governance'
import GovernanceDetails from './apps/GovernanceInfo'

import { Starfield } from './apps/Rainbowmesh'
import { ScrollToTop } from './Providers'


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
	const { connected } = useWallet()

	return (
		<Suspense
			fallback={
				<LayoutRoute showSidebar showHeader showFooter element={<Loader text='' />} />
			}
		>
			<Routes>
				<Route path='/' element={<LayoutRoute showFooter element={<Home />} />}></Route>
				<Route
					path='/app'
					element={<LayoutRoute showHeader showFooter showSidebar={connected}
										  element={<BetaPage />} />}
				></Route>
				<Route
					path='/app/organisations'
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
					path='/app/dashboard'
					element={
						<LayoutRoute showSidebar showHeader showFooter element={<Dashboard />} />
					}
				></Route>
				<Route
					path='/app/governance'
					element={
						<LayoutRoute showSidebar showHeader showFooter element={<Governance />} />
					}
				></Route>
				<Route
					path='/app/governance/:proposalId'
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
					path='/app/campaigns/:id'
					element={
						<LayoutRoute showSidebar noContainer showFooter element={<Campaign />} />
					}
				></Route>
				<Route
					path='/app/campaigns'
					element={
						<LayoutRoute showSidebar showHeader showFooter element={<Campaigns />} />
					}
				></Route>
				<Route
					path='/app/tangram'
					element={
						<LayoutRoute showSidebar showHeader showFooter element={<Tangram />} />
					}
				></Route>
				<Route
					path='/app/quest'
					element={
						connected
						? <LayoutRoute showSidebar showHeader showFooter element={<QuestPage />} />
						: <Navigate to='/app' replace />
					}
				/>
				<Route
					path='/app/wallet'
					element={<LayoutRoute showSidebar showHeader showFooter element={<Wallet />} />}
				></Route>
				{}
				<Route
					path='/app/organisations/admin/:id'
					element={
						<LayoutRoute showSidebar showHeader showFooter element={<DAOAdmin />} />
					}
				></Route>
				<Route
					path='/app/organisations/:id'
					element={
						<LayoutRoute
							showSidebar
							showHeader
							showFooter
							element={<OrganisationsDashboard />}
						/>
					}
				></Route>
				<Route
					path='*'
					element={
						<LayoutRoute
							showSidebar
							showHeader
							showFooter
							element={<div style={{height: "90vh", textAlign: "center" }}>404 Not Found... Or Wallet Disconnected?<Starfield/><ScrollToTop/></div>}
						/>
					}
				></Route>
			</Routes>
		</Suspense>
	)
}

export default Router
