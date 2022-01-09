import React, { useEffect, useState } from 'react'
import { useApiProvider } from '@substra-hooks/core'
import { useIdentity } from 'src/hooks/useIdentity'
import { useCrowdfunding } from 'src/hooks/useCrowdfunding'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { useWallet } from '../context/Wallet'

import { alpha, useTheme } from '@mui/material/styles'

import { Button, Grid, Typography } from 'src/components'
import SingleChart from 'src/components/chart/SingleChart'
import { Icons, ICON_MAPPING } from 'src/components/Icons'
import { Box, Stack, Divider, Card } from 'src/components'

import MiniStats from './components/MiniStats'

import AppWebsiteVisits from './components/dashboard/AppWebsiteVisits'
import AppCurrentVisits from './components/dashboard/AppCurrentVisits'
import AppConversionRates from './components/dashboard/AppConversionRates'
import AppCurrentSubject from './components/dashboard/AppCurrentSubject'
import AppNewsUpdate from './components/dashboard/AppNewsUpdate'
import AppOrderTimeline from './components/dashboard/AppOrderTimeline'

import DashboardUserConnected from './DashboardUserConnected'


const Dashboard = (props) => {

	const apiProvider = useApiProvider()
	const crowdfunding = useCrowdfunding()
	const { nonce } = useGameDaoControl()
	const { proposalsCount } = useGameDaoGovernance()

	const theme = useTheme()
	const bgPlain = { backgroundColor: theme.palette.grey[500_16] }

	return (
		<Grid container spacing={3}>

			<Grid item xs={12} sx={{ display: 'flex', justifyContent: 'start' }}>
				<Typography variant="h5">Global Dashboard</Typography>
			</Grid>

			<Grid item xs={12} sm={6} md={4}>
				<Card sx={{ ...bgPlain, height: '160px' }}>
					<Box
						sx={{
							position: 'absolute',
							top: '0px',
							left: '-0.5rem',
							width: '115%',
						}}
					>
						<SingleChart />
					</Box>
					<Stack justifyContent="space-evenly" alignItems="center" spacing={2} mt={2}>
						<Typography>Total Value Locked (Global)</Typography>
						<Typography variant="h3">32'603'000'444.435</Typography>
						<Typography>GAME</Typography>
					</Stack>
				</Card>
			</Grid>

			<Grid item sm={12} md={4}>
				<Card sx={{ ...bgPlain, height: '160px' }}>
					<Stack justifyContent="space-evenly" alignItems="center" spacing={2} mt={2}>
						<Typography>DAOs</Typography>
						<Typography variant="h3">{nonce ?? 'Loading...'}</Typography>
						<Typography></Typography>
					</Stack>
				</Card>
			</Grid>

			<Grid item xs={12} sm={6} md={4}>
				<Card sx={{ ...bgPlain, height: '160px' }}>
					<Box
						sx={{
							position: 'absolute',
							top: '0px',
							left: '-0.5rem',
							width: '115%',
						}}
					>
						<SingleChart />
					</Box>
					<Stack justifyContent="space-evenly" alignItems="center" spacing={2} mt={2}>
						<Typography>Total contributions</Typography>
						<Typography variant="h3">1005.00</Typography>
						<Typography>aUSD</Typography>
					</Stack>
				</Card>
			</Grid>

			<Grid item xs={12}>
				<Card sx={{ ...bgPlain, height: '160px' }}>
					<Box sx={{ justifyContent: 'space-between', display: 'flex', p: 4 }}>
						<Typography variant="h5">Organization Updates:</Typography>
						<Typography variant="h5">filter</Typography>
					</Box>
				</Card>
			</Grid>

			<Grid item xs={12} sx={{ display: 'flex', justifyContent: 'start' }}>
				<Typography variant="h5">
					{crowdfunding.campaignsCount ?? 'Loading...'} Campaigns
				</Typography>
			</Grid>

			<Grid item xs={12}>
				<Card sx={{ ...bgPlain, height: '160px' }}>
					<Box sx={{ justifyContent: 'space-between', display: 'flex', p: 4 }}>
						<Typography variant="h5">Active Campaigns</Typography>
					</Box>
				</Card>
			</Grid>

			<Grid item xs={12} sx={{ display: 'flex', justifyContent: 'start' }}>
				<Typography variant="h5">{proposalsCount ?? 'Loading...'} Proposals</Typography>
			</Grid>

			<Grid item xs={12}>
				<Card sx={{ ...bgPlain, height: '160px' }}>
					<Box sx={{ justifyContent: 'space-between', display: 'flex', p: 4 }}>
						<Typography variant="h5">Votings Closing Soon</Typography>
					</Box>
				</Card>
			</Grid>

			<Grid item xs={12} md={6} lg={4}>
				<AppCurrentVisits />
			</Grid>

			<Grid item xs={12} md={6} lg={4}>
				<AppOrderTimeline />
			</Grid>

			<Grid item xs={12} md={6} lg={4}>
				<AppCurrentSubject />
			</Grid>

			<Grid item xs={12}>
				<AppWebsiteVisits />
			</Grid>

			<Grid item xs={12}>
				<AppConversionRates />
			</Grid>
		</Grid>
	)
}

export default function Dapp(props) {
	const apiProvider = useApiProvider()
	const { address, connected } = useWallet()
	const { identities } = useIdentity(address)
	const [name, setName] = useState('')

	useEffect(() => {
		setName(identities?.[address]?.toHuman()?.info?.display?.Raw ?? '')
	}, [ connected, address, identities ])

	if (!apiProvider) return null
	return ( address && connected)
		? <DashboardUserConnected />
		: <Dashboard />
}
