import React, { useEffect, useState } from 'react'
import { useWallet } from '../context/Wallet'
import { useIdentity } from 'src/hooks/useIdentity'
import { useCrowdfunding } from 'src/hooks/useCrowdfunding'
import { useApiProvider } from '@substra-hooks/core'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { Button, Grid, Typography } from 'src/components'

import MiniStats from './components/MiniStats'
import AppWebsiteVisits from './components/dashboard/AppWebsiteVisits'
import AppCurrentVisits from './components/dashboard/AppCurrentVisits'
import AppConversionRates from './components/dashboard/AppConversionRates'
import AppCurrentSubject from './components/dashboard/AppCurrentSubject'
import AppNewsUpdate from './components/dashboard/AppNewsUpdate'
import AppOrderTimeline from './components/dashboard/AppOrderTimeline'

import { Icons, ICON_MAPPING } from 'src/components/Icons'

const Dashboard = (props) => {
	const apiProvider = useApiProvider()
	const { address, signAndNotify } = useWallet()
	const identity = useIdentity(address)
	const crowdfunding = useCrowdfunding()
	const { nonce } = useGameDaoControl()
	const { proposalsCount } = useGameDaoGovernance()
	const [name, setName] = useState('')

	useEffect(() => {
		setName(identity?.toHuman()?.info?.display?.Raw ?? '')
	}, [identity])

	return (
		<>
			<Grid container spacing={3}>
				{/*				<Grid item xs={12} sx={{display: "flex", justifyContent: "center"}}>
					<Icons
						src={ICON_MAPPING.logo}
						alt={'GameDAO'}
						sx={{ height: '64px' }}
					/>
				</Grid>*/}

				<Grid item xs={12} sm={4} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
					<Typography variant="h3">DAOs: {nonce ?? 'Loading...'}</Typography>
				</Grid>
				<Grid item xs={12} sm={4} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
					<Typography variant="h3">
						Campaigns: {crowdfunding.campaignsCount ?? 'Loading...'}
					</Typography>
				</Grid>
				<Grid item xs={12} sm={4} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
					<Typography variant="h3">
						Proposals: {proposalsCount ?? 'Loading...'}
					</Typography>
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
			{/*<Button
				onClick={() => {
					const tx = apiProvider.tx.balances.transfer(
						'3RaiU4xRF24Q2qwc3H1TWYXrh11po34WoSaQAADszHshRbYJ',
						1
					)

					signAndNotify(
						tx,
						{
							pending: 'Money transfer pending',
							success: 'Money transfer successful',
							error: 'Money transfer failed',
						},
						(state) => {
							if (state) {
								console.log('Fin success')
							} else {
								console.log('Fin error')
							}
						}
					)
				}}
			>
				Send MY Money To Andre
			</Button>*/}
		</>
	)
}

export default function Dapp(props) {
	const apiProvider = useApiProvider()
	return apiProvider ? <Dashboard {...props} /> : null
}
