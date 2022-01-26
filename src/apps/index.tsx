import React, { useEffect, useState } from 'react'
import { useApiProvider } from '@substra-hooks/core'
import { useIdentity } from 'src/hooks/useIdentity'
import { useCrowdfunding } from 'src/hooks/useCrowdfunding'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { useWallet } from '../context/Wallet'
import { DEV } from '../config'
import { useTheme } from '@mui/material/styles'

import { Button, Grid, Typography, Box, Stack, Divider, Card, Paper } from 'src/components'
import SingleChart from 'src/components/chart/SingleChart'
import { Icons, ICON_MAPPING } from 'src/components/Icons'

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
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Box>
					<Paper elevation={10} sx={{ my: 2, p: 4, ...bgPlain }}>
						<Typography
							variant="h3"
							sx={{
								mb: 2,
								background:
									'-webkit-linear-gradient(45deg, #ff00cc 30%, #ff9900 90%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								fontWeight: 800,
							}}
						>
							The Art of GameDAO
						</Typography>
						<Typography variant="body1">
							GameDAO is a fundraising, coordination and ownership protocol for video
							games, creators and teams building in the dotsama ecosystem. You can use
							it in almost any way you want. This is the public beta to build and test
							together with you.
							<br />
							<br />
							Our current roadmap is based on the following features:
							<ul>
								<li>Create unstoppable DAO for your project and community</li>
								<li>
									Let the community become a member of your DAO based on your
									preferences
								</li>
								<li>Manage your DAO Treasury together via proposals</li>
								<li>Create fundraising Campaigns</li>
								<li>
									Let the community manage your campaigns Treasury via proposals
								</li>
							</ul>
						</Typography>
						<Box sx={{ display: 'flex', justifyContent: 'space-between' }} mt="2rem">
							<a href="https://blog.gamedao.co/" target="_blank" rel="noreferrer">
								<Button size="small" sx={{ mr: 2 }} color="secondary">
									Read more about the why and how in our Blog
								</Button>
							</a>
						</Box>
					</Paper>
				</Box>
			</Grid>

			<Grid item xs={12}>
				<Box>
					<Paper elevation={10} sx={{ my: 2, p: 4, ...bgPlain }}>
						<Typography
							variant="h3"
							sx={{
								mb: 2,
								background:
									'-webkit-linear-gradient(45deg, #ff00cc 30%, #ff9900 90%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								fontWeight: 800,
							}}
						>
							How to get started
						</Typography>

						<Typography
							variant="h4"
							sx={{
								mb: 2,
								background:
									'-webkit-linear-gradient(45deg, #ff3300 30%, #ff9900 90%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								fontWeight: 800,
							}}
						>
							Wallet
						</Typography>
						<Typography variant="body1">
							Getting started involves two parts, the first is a general setup for
							your browser, where you simply follow the five steps below. Make sure to
							take note of your recovery phrase as nobody else will do this for you.
							<ol>
								<li>Get the Polkadot browser wallet</li>
								<li>Create an account on this wallet</li>
								<li>Connect your wallet to the GameDAO DApp (in the top right)</li>
								<li>
									Get free token through the Faucet link in the sidebar (links to
									our Discord)
								</li>
								<li>
									Try it out and give feedback on our Discord, we are building
									this for you!
								</li>
							</ol>
						</Typography>

						<Box sx={{ display: 'flex', justifyContent: 'end' }} mt="2rem">
							<a href="https://polkadot.js.org/extension/" target="_blank" rel="noreferrer">
								<Button
									size="small"
									sx={{ borderRadius: '100px' }}
									variant="outlined"
									color="primary"
								>
									Get Polkadot Wallet
								</Button>
							</a>
						</Box>
						<Typography
							variant="h4"
							sx={{
								mb: 2,
								background:
									'-webkit-linear-gradient(45deg, #ff3300 30%, #ff9900 90%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								fontWeight: 800,
							}}
						>
							Token
						</Typography>
						<Typography variant="body1">
							GameDAO works, depending on the network you are connected to, with three
							types of tokens:
							<ol>
								<li>GAME Token is the access and governance token.</li>
								<li>
									A stable token, depending on the network, like aUSD, kUSD, DAI,
									PLAY for the settlement of payments, e.g. what people contribute
									to a fundraising campaign.
								</li>
								<li>
									A network token, like ZERO on zero network (where this beta
									runs), to pay transaction fees.
								</li>
							</ol>
							During beta you will get all of these through a faucet on Discord,
							therefore for experimenting no real value is used to do transactions.
							<br />
							<br />
						</Typography>

						<Box sx={{ display: 'flex', justifyContent: 'space-between' }} mt="2rem">
							<a href="https://docs.gamedao.co/" target="_blank" rel="noreferrer">
								<Button size="small" sx={{ mr: 2 }} color="secondary">
									Learn more in the GameDAO Docs
								</Button>
							</a>
							<a href="https://discord.gg/P7NHWGzJ7r" target="_blank" rel="noreferrer">
								<Button
									size="small"
									sx={{ borderRadius: '100px' }}
									variant="outlined"
									color="primary"
								>
									Get Free Test Token
								</Button>
							</a>
						</Box>
					</Paper>
				</Box>
			</Grid>

			{DEV && (
				<>
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
							<Stack
								justifyContent="space-evenly"
								alignItems="center"
								spacing={2}
								mt={2}
							>
								<Typography>Total Value Locked (Global)</Typography>
								<Typography variant="h3">32'603'000'444.435</Typography>
								<Typography>GAME</Typography>
							</Stack>
						</Card>
					</Grid>

					<Grid item sm={12} md={4}>
						<Card sx={{ ...bgPlain, height: '160px' }}>
							<Stack
								justifyContent="space-evenly"
								alignItems="center"
								spacing={2}
								mt={2}
							>
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
							<Stack
								justifyContent="space-evenly"
								alignItems="center"
								spacing={2}
								mt={2}
							>
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
				</>
			)}
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
	}, [connected, address, identities])

	if (!apiProvider) return null
	return <Dashboard />
}
