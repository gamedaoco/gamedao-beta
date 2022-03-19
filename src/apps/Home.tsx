import * as React from 'react'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {
	Avatar,
	Button,
	TextField,
	FormControlLabel,
	Checkbox,
	Link,
	Grid,
	Box,
	Typography,
	Container, Paper
} from '../components'
import { Rainbowmesh } from './Rainbowmesh'
import { Icons, ICON_MAPPING } from 'src/components/Icons'
import { useTheme } from '@mui/material/styles'

export default function SignIn() {

	const theme = useTheme()
	const bgPlain = { backgroundColor: '#201e1a' } //theme.palette.grey[500_16] }

	return (
		<>
			<Box
				sx={{
					backgroundColor: '#110',
					zIndex: '-1',
					position: 'absolute',
					width: '100%',
					height: '100vh',
					top: '0px',
					left: '0px',
				}}
			>
				<Rainbowmesh />
			</Box>

	<Container component="main" maxWidth="md">
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} mt={2}>
					<Icons src={ICON_MAPPING.logoWhite} alt={'GameDAO'} sx={{ height: '48px' }} />
					<a href="https://blog.gamedao.co/" target="_blank" rel="noreferrer">
						<Button size="large" color="primary" variant="outlined">
							Enter
						</Button>
					</a>
				</Box>
			</Grid>
			<Grid item xs={12}>
				<Box>
					<Paper elevation={10} sx={{ p: 4, ...bgPlain }}>
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
									Let the community manage your campaign Treasury via proposals
								</li>
							</ul>
						</Typography>
						<Box sx={{ display: 'flex', justifyContent: 'space-between' }} mt="2rem">
							<a href="https://blog.gamedao.co/" target="_blank" rel="noreferrer">
								<Button size="small" sx={{ mr: 2 }} color="primary">
									Read more in our Blog
								</Button>
							</a>
							<a
								href="/app"
							>
								<Button
									size="small"
									sx={{ borderRadius: '100px' }}
									variant="outlined"
									color="primary"
								>
									Enter GameDAO Beta
								</Button>
							</a>
						</Box>
					</Paper>
				</Box>
			</Grid>

			<Grid item xs={12}>
				<Paper elevation={10} sx={{ p: 4, ...bgPlain, height: '100%' }}>

					<Grid container spacing={4}>
						<Grid item xs={12}>
							<Typography
								variant="h3"
								sx={{
									background:
										'-webkit-linear-gradient(45deg, #ff00cc 30%, #ff9900 90%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									fontWeight: 800,
								}}
							>
								How to get started
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
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
								<br/><br/>
							</Typography>
							<Box sx={{ display: 'flex', justifyContent: 'space-between' }} mt="2rem">
								<a
									href="https://talisman.xyz/"
									target="_blank"
									rel="noreferrer"
								>
									<Button
										size="small"
										sx={{ borderRadius: '100px' }}
										variant="outlined"
										color="primary"
									>
										Get Talisman Wallet
									</Button>
								</a>
								<a
									href="https://polkadot.js.org/extension/"
									target="_blank"
									rel="noreferrer"
								>
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
						</Grid>
						<Grid item xs={12} md={6}>
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
									<Button size="small" sx={{ mr: 2 }} color="primary">
										GameDAO Docs
									</Button>
								</a>
								<a
									href="https://discord.gg/P7NHWGzJ7r"
									target="_blank"
									rel="noreferrer"
								>
									<Button
										size="small"
										sx={{ borderRadius: '100px' }}
										variant="outlined"
										color="primary"
									>
										Token Faucet
									</Button>
								</a>
							</Box>
						</Grid>
					</Grid>
				</Paper>
			</Grid>

		</Grid>

		{/*
		<Container component="main" maxWidth="xs">
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Icons src={ICON_MAPPING.logoWhite} alt={'GameDAO'} sx={{ height: '64px' }} />

					<Box style={{ position: 'absolute', bottom: '16vh' }}>
						<Link href="/app" variant="body2">
							<Button size="large" variant="contained">
								Enter Beta
							</Button>
						</Link>
					</Box>
				</Box>
		*/}
			</Container>

		</>
	)
}
