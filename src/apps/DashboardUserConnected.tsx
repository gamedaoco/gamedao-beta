import React, { useEffect, useState } from 'react'
import { useWallet } from '../context/Wallet'
import { useCrowdfunding } from 'src/hooks/useCrowdfunding'
import { useApiProvider, useEncodedAddress } from '@substra-hooks/core'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'

import HeartIcon from '@mui/icons-material/FavoriteBorder'

import MiniStats from './components/MiniStats'
import AppWebsiteVisits from './components/dashboard/AppWebsiteVisits'
import AppCurrentVisits from './components/dashboard/AppCurrentVisits'
import AppConversionRates from './components/dashboard/AppConversionRates'
import AppCurrentSubject from './components/dashboard/AppCurrentSubject'
import AppNewsUpdate from './components/dashboard/AppNewsUpdate'
import AppOrderTimeline from './components/dashboard/AppOrderTimeline'
import SingleChart from '../components/chart/SingleChart'

import { Icons, ICON_MAPPING } from 'src/components/Icons'

import { Button, Grid, Typography, Box, Stack, Divider, Card } from 'src/components'

import VerifiedIcon from '@mui/icons-material/Verified'

const Dashboard = (props) => {
	const apiProvider = useApiProvider()
	const { allowConnect, updateWalletState, account, address } = useWallet()
	const crowdfunding = useCrowdfunding()
	const { nonce } = useGameDaoControl()
	const { proposalsCount } = useGameDaoGovernance()

	// TODO: externalise and adopt to connected network
	const convertedAddress = useEncodedAddress( address, 25 ) || ''

	return (
		<>
			<Grid container spacing={4}>

				<Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'start' }}>
					<Stack direction="row">
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: '#292B2D',
								borderRadius: '50%',
								marginRight: 2,
								height: '3.5rem',
								width: '3.5rem',
							}}
						>
							<HeartIcon />
						</Box>
						<Stack>
							{ account &&
							<Typography variant="h5">
								{account.meta.name} <VerifiedIcon fontSize="small" sx={{ color: '#f0f'}}/>
							</Typography>
							}
							<Typography sx={{ fontWeight: '100' }} variant="body2">
								{account &&
									`${convertedAddress.substring(
										0,
										5
									)}...${convertedAddress.substring(convertedAddress.length - 5)}`}
							</Typography>
						</Stack>
					</Stack>
				</Grid>

				<Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'end' }}>
					<Stack direction="row">
						<Stack>
							<Typography sx={{ fontWeight: '100' }} variant="body2">
								Trust
							</Typography>
							<Typography variant="overline">Level 2</Typography>
						</Stack>
						<Divider
							sx={{ mx: 2, mt: 1, height: '60%' }}
							orientation="vertical"
							flexItem
						/>
						<Typography></Typography>
						<Stack>
							<Typography sx={{ fontWeight: '100' }} variant="body2">
								Rep
							</Typography>
							<Typography variant="overline">530</Typography>
						</Stack>
						<Divider sx={{ mx: 2, height: '100%' }} orientation="vertical" flexItem />
						<Stack>
							<Typography sx={{ fontWeight: '100' }} variant="body2">
								XP
							</Typography>
							<Typography variant="overline">1120</Typography>
						</Stack>
					</Stack>
				</Grid>

				<Grid item xs={12} sx={{ display: 'flex', justifyContent: 'start' }}>
					<Typography variant="h5">Dashboard</Typography>
				</Grid>

				<Grid item xs={12} sm={6} md={4}>
					<Card sx={{ height: '160px' }}>
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
							<Typography>Total Value Locked</Typography>
							<Typography variant="h3">32'603.435</Typography>
							<Typography>GAME</Typography>
						</Stack>
					</Card>
				</Grid>

				<Grid item sm={12} md={4}>
					<Card sx={{ height: '160px' }}>
						<Stack justifyContent="space-evenly" alignItems="center" spacing={2} mt={2}>
							<Typography>Votings</Typography>
							<Typography variant="h3">{proposalsCount ?? 'Loading...'}</Typography>
							<Typography>Open Votings</Typography>
						</Stack>
					</Card>
				</Grid>

				<Grid item xs={12} sm={6} md={4}>
					<Card sx={{ height: '160px' }}>
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
					<Card>
						<Box sx={{ justifyContent: 'space-between', display: 'flex', p: 4 }}>
							<Typography variant="h5">Organizations</Typography>
							<Typography variant="h5">Sort by ^</Typography>
						</Box>
					</Card>
				</Grid>

				<Grid item xs={12} sx={{ display: 'flex', justifyContent: 'start' }}>
					<Typography variant="h5">Campaigns</Typography>
				</Grid>

				<Grid item xs={12}>
					<Card>
						<Box sx={{ justifyContent: 'space-between', display: 'flex', p: 4 }}>
							<Typography variant="h5">My Campaigns</Typography>
						</Box>
					</Card>
				</Grid>

				<Grid item xs={12}>
					<Card>
						<SingleChart />
					</Card>
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
