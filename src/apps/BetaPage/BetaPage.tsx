import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { gateway } from '../lib/ipfs'
import { IPFS_IMAGE_CID } from '../QuestPage/modules/IPFS_IMAGE_CID'
import { useWallet } from '../../context/Wallet'
import { useStore } from '../../context/Store'
import { useTheme } from '@mui/material/styles'
import { Box, CardContent } from '@mui/material'
import { Button, Card, Paper, Stack, Typography, useMediaQuery } from '../../components'
import './textOverride.css'

export function BetaPage() {
	const theme = useTheme()
	const isMobile = useMediaQuery('(min-width:800px)')
	const { updateWalletState, connected } = useWallet()
	const { updateStore, allowConnection } = useStore()
	const navigate = useNavigate()

	useEffect(()=>{
		if(connected) navigate('/app/quest')
	},[connected, navigate])

	const handleConnect = useCallback(
		(e) => {
			e.stopPropagation()
			if (allowConnection) {
				updateWalletState({ allowConnect: true })
			} else {
				updateStore({ allowConnection: true })
			}
		},
		[allowConnection, updateWalletState, updateStore],
	)

	return (
		<Stack spacing={4}>
			<Box
				component={'img'}
				alt='hero'
				src={`${gateway}${IPFS_IMAGE_CID['header7']}`}
				sx={{
					width: '100%',
				}}
			/>
			<Card>
				<CardContent>
					<Stack spacing={4} padding={4}>
						<Typography className='beta-page__title-color'>
							UNLOCK THE GATES TO GAMEDAO
						</Typography>
						<Typography>
							GameDAO is a fundraising, coordination and ownership protocol for video
							games, creators and teams building in the dotsama ecosystem. You can use
							it in almost any way you want.
							This is the closed beta to build and test together with you.
						</Typography>
						<Typography>
							In order to access the beta of GameDAO you need to do 2 things:
						</Typography>
					</Stack>
				</CardContent>
			</Card>

			<Stack spacing={4} direction={isMobile ? 'row' : 'column'} width={'100%'}>
				<Paper sx={{ flex: '1' }}>
					<Box width='100%' padding={4}>
						<Stack direction='row' spacing={4} alignItems='center'>
							<div className='beta-page__ellipse beta-page__ellipse--1' />
							<Typography>Create your own polkadot wallet</Typography>
						</Stack>
						<ol style={{ paddingLeft: '7.2rem' }}>
							<li>
								<Typography>
									Follow the steps in our{' '}
									<a style={{ color: theme.palette.text.primary }} target='_blank' rel="noreferrer"
									   href={'https://docs.gamedao.co/guides/installing-your-wallet'}>
										documentation.
									</a>
									<br />
									<span style={{ fontStyle: 'italic', whiteSpace: 'pre-line' }}>
										 <br />
										Already have your own polkadot wallet? Go to step 2.
									</span>
								</Typography>
							</li>
						</ol>
					</Box>
				</Paper>
				<Paper sx={{ flex: '1' }}>
					<Box width='100%' padding={4}>
						<Stack direction='row' spacing={4} alignItems='center'>
							<div className='beta-page__ellipse beta-page__ellipse--2' />
							<Typography>Get your personal tangram key</Typography>
						</Stack>
						<ol style={{ paddingLeft: '7.2rem' }}>
							<li>
								<Typography>
									Join our{' '}
									<a style={{ color: theme.palette.text.primary }} target='_blank' rel="noreferrer"
									   href={'https://discord.gg/YZT2QANG5m'}>
										discord server
									</a>
								</Typography>
							</li>
							<li>
								<Typography>
									Follow the guides in the channel #gamedao-beta-invite
								</Typography>
							</li>
						</ol>
					</Box>
				</Paper>
			</Stack>

			{!connected && (
				<Stack
					component={Paper}
					padding={4}
					direction='row'
					spacing={4}
					alignItems='center'
					justifyContent='space-between'
				>
					<Typography>
						<strong>All done?</strong> Let’s get started by connecting your wallet!
					</Typography>
					<Button variant='contained' className='beta-page__button'
							onClick={handleConnect}>
						Connect Wallet
					</Button>
				</Stack>
			)}
		</Stack>
	)
}
