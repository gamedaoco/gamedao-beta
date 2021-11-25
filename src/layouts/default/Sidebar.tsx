import React from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import { useApiProvider } from '@substra-hooks/core'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListSubHeader from '@mui/material/ListSubheader'
import { useLocation } from 'react-router-dom'
import { styled } from '@mui/material/styles'

import { SiDiscord } from '@react-icons/all-files/si/SiDiscord'
import { SiLinkedin } from '@react-icons/all-files/si/SiLinkedin'
import { SiGithub } from '@react-icons/all-files/si/SiGithub'
import { SiTelegram } from '@react-icons/all-files/si/SiTelegram'
import { SiTwitter } from '@react-icons/all-files/si/SiTwitter'

import { NavLink } from 'react-router-dom'
import Badge from '@mui/material/Badge'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Divider, Paper, Typography, FontIcon, useMediaQuery, Link } from 'src/components'
import { Icons, ICON_MAPPING } from 'src/components/Icons'
import { useThemeState } from 'src/context/ThemeState'
import { useCrowdfunding } from 'src/hooks/useCrowdfunding'
import NetInfo from 'src/components/NetInfo'

interface ComponentProps {
	showNavigation?: boolean
}

const SidebarButton = styled(ListItemButton)<{ active?: boolean }>(({ theme, active }) => ({
	padding: theme.spacing(1),
	marginLeft: theme.spacing(1),
	marginRight: theme.spacing(1),
	marginTop: theme.spacing(0.5),
	marginBottom: theme.spacing(0.5),
	borderRadius: '2rem',
	color: active ? theme.palette.text.primary : theme.palette.text.secondary,
	backgroundColor: active ? theme.palette.background.neutral : 'transparent',
	'&:hover': {
		color: theme.palette.text.primary,
	},
}))

const NavHeader = styled(ListSubHeader)(({ theme }) => ({
	backgroundColor: 'transparent',
	textTransform: 'uppercase',
	color: theme.palette.text.primary,
}))

const NavBadge = styled(Badge)(({ theme }) => ({
	'& .MuiBadge-badge': {
		color: theme.palette.background.default,
		borderRadius: 6,
		right: 'initial',
	},
}))

function ThemeSwitcher() {
	const { darkmodeEnabled, setDarkmodeEnabled } = useThemeState()
	return (
		<Paper
			sx={{
				display: 'flex',
				justifyContent: 'space-evenly',
				alignItems: 'center',
				borderRadius: '8px',
				margin: 'auto',
				height: '100%',
			}}
		>
			<Icons
				src={ICON_MAPPING.moon}
				alt="moon"
				sx={{
					cursor: 'pointer',
					filter: darkmodeEnabled ? 'invert(0)' : 'invert(0.5)',
				}}
				onClick={() => setDarkmodeEnabled(true)}
			/>
			<Divider orientation="vertical" variant="middle" flexItem />

			<Icons
				src={ICON_MAPPING.sun}
				alt="sun"
				sx={{
					cursor: 'pointer',
					filter: darkmodeEnabled ? 'invert(0.5)' : 'invert(1)',
				}}
				onClick={() => setDarkmodeEnabled(false)}
			/>
		</Paper>
	)
}

function Main({ showNavigation }: ComponentProps) {
	const { darkmodeEnabled } = useThemeState()
	const { campaignsCount } = useCrowdfunding()
	const [organisationCount, setOrganisationCount] = React.useState(0)
	const [votingCount, setVotingCount] = React.useState(0)
	const apiProvider = useApiProvider()
	const { pathname } = useLocation()

	const isMobile = useMediaQuery('(max-width:320px)')

	React.useEffect(() => {
		let unsubscribe = null
		if (!apiProvider) return
		apiProvider?.query?.gameDaoControl
			.nonce((n) => {
				if (!n.isNone) {
					setOrganisationCount(n.toNumber())
				}
			})
			.then((unsub) => {
				unsubscribe = unsub
			})
			.catch(console.error)
		return () => unsubscribe && unsubscribe()
	}, [apiProvider?.query?.gameDaoControl])

	React.useEffect(() => {
		let unsubscribe = null
		if (!apiProvider) return
		apiProvider?.query?.gameDaoGovernance
			.nonce((n) => {
				if (!n.isNone) {
					setVotingCount(n.toNumber())
				}
			})
			.then((unsub) => {
				unsubscribe = unsub
			})
			.catch(console.error)
		return () => unsubscribe && unsubscribe()
	}, [apiProvider?.query?.gameDaoGovernance])

	return (
		<Box
			sx={{
				position: 'sticky',
				top: 0,
				width: isMobile ? '90px' : '275px',
				overflow: 'hidden',
				display: 'flex',
				flexDirection: 'column',
				flex: 1,
				minHeight: '100%',
				borderRight: '1px solid #33383F',
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 4, marginTop: 2 }}>
				<Link component={NavLink} to="/">
					<Icons
						src={darkmodeEnabled ? ICON_MAPPING.logoWhite : ICON_MAPPING.logo}
						alt={'GameDAO'}
						sx={{ height: '45.4px' }}
					/>
				</Link>
			</Box>
			<List sx={{ display: 'flex', flex: 1, flexDirection: 'column', marginTop: '2.5rem' }}>
				<Link component={NavLink} to="/app">
					<SidebarButton active={pathname === '/app'} sx={{ mx: 4, py: 0 }}>
						<ListItemIcon>
							<FontIcon sx={{ fontSize: '3rem' }} name="dashboard" />
						</ListItemIcon>
						<Typography sx={{ fontSize: '1rem' }}>Dashboard</Typography>
					</SidebarButton>
				</Link>
				<Link component={NavLink} to="/app/organisations">
					<SidebarButton
						active={!!pathname.match(/organisations/gi)}
						sx={{ mx: 4, py: 0 }}
					>
						<ListItemIcon>
							<FontIcon sx={{ fontSize: '3rem' }} name="organization" />
						</ListItemIcon>
						<Typography sx={{ fontSize: '1rem' }}>Organisations</Typography>
						{organisationCount > 0 ? (
							<>
								<Box />
								<NavBadge badgeContent={organisationCount} color={'primary'} />
							</>
						) : null}
					</SidebarButton>
				</Link>
				<Link component={NavLink} to="/app/governance">
					<SidebarButton active={!!pathname.match(/governance/gi)} sx={{ mx: 4, py: 0 }}>
						<ListItemIcon>
							<FontIcon sx={{ fontSize: '3rem' }} name="voting" />
						</ListItemIcon>
						<Typography sx={{ fontSize: '1rem' }}>Votings</Typography>
						{votingCount > 0 ? (
							<NavBadge badgeContent={votingCount} color={'primary'} />
						) : null}
					</SidebarButton>
				</Link>
				<Link component={NavLink} to="/app/campaigns">
					<SidebarButton active={!!pathname.match(/campaigns/gi)} sx={{ mx: 4, py: 0 }}>
						<ListItemIcon>
							<FontIcon sx={{ fontSize: '3rem' }} name="campaign" />
						</ListItemIcon>
						<Typography sx={{ fontSize: '1rem' }}>Campaigns</Typography>
						{campaignsCount > 0 ? (
							<>
								<Box />
								<NavBadge badgeContent={campaignsCount} color={'primary'} />
							</>
						) : null}
					</SidebarButton>
				</Link>
				{/* TODO: Activate as soon as we work on the Tangram page  */}
				{false && (
					<Link component={NavLink} to="/app/tangram">
						<SidebarButton active={!!pathname.match(/tangram/gi)} sx={{ mx: 4, py: 0 }}>
							<ListItemIcon>
								<FontIcon sx={{ fontSize: '3rem' }} name="tangram" />
							</ListItemIcon>
							<Typography sx={{ fontSize: '1rem' }}>Tangram</Typography>
						</SidebarButton>
					</Link>
				)}
				<Link component={NavLink} to="/app/wallet">
					<SidebarButton active={!!pathname.match(/wallet/gi)} sx={{ mx: 4, py: 0 }}>
						<ListItemIcon>
							<FontIcon sx={{ fontSize: '3rem' }} name="wallet" />
						</ListItemIcon>
						<Typography sx={{ fontSize: '1rem' }}>Wallet</Typography>
					</SidebarButton>
				</Link>
				<List
					sx={{ display: 'flex', flex: 1, flexDirection: 'column', margin: '2.5rem 0' }}
				>
					<a
						target="_blank"
						rel="noreferrer"
						href="https://discord.gg/P7NHWGzJ7r"
						style={{
							color: 'transparent',
						}}
					>
						<SidebarButton active={pathname === '/app'} sx={{ mx: 4, py: 0 }}>
							<ListItemIcon>
								<FontIcon sx={{ fontSize: '3rem' }} name="store" />
							</ListItemIcon>
							<Typography sx={{ fontSize: '1rem' }}>Faucet</Typography>
						</SidebarButton>
					</a>
					<Link href="https://docs.gamedao.co" target="_blank" rel="noreferrer">
						<SidebarButton sx={{ mx: 4, py: 0 }}>
							<ListItemIcon>
								<FontIcon sx={{ fontSize: '3rem' }} name="document" />
							</ListItemIcon>
							<Typography sx={{ fontSize: '1rem' }}>Documentation</Typography>
						</SidebarButton>
					</Link>
				</List>
				<Box sx={{ flex: 1 }} />
				<Box sx={{ margin: '2.5rem 0' }}>
					<NavHeader>Network Info</NavHeader>
					<Box sx={{ px: 2 }}>
						<NetInfo />
					</Box>
				</Box>
				<NavHeader>Social</NavHeader>
				<Box
					sx={{
						paddingLeft: 2,
						paddingRight: 2,
						flexDirection: 'row',
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<a target="_blank" rel="noreferrer" href="https://discord.gg/P7NHWGzJ7r">
						<SiDiscord size={'20px'} />
					</a>
					<a target="_blank" rel="noreferrer" href="https://t.me/gamedaoco">
						<SiTelegram size={'20px'} />
					</a>
					<a target="_blank" rel="noreferrer" href="https://twitter.com/gamedaoco">
						<SiTwitter size={'20px'} />
					</a>
					<a target="_blank" rel="noreferrer" href="https://github.com/gamedaoco">
						<SiGithub size={'20px'} />
					</a>
					<a
						target="_blank"
						rel="noreferrer"
						href="https://www.linkedin.com/company/gamedaoco"
					>
						<SiLinkedin size={'20px'} />
					</a>
				</Box>
				<Box sx={{ height: '40px' }} />
				<NavHeader>Settings</NavHeader>

				<Box sx={{ display: 'flex' }}>
					<Box sx={{ flex: 1, paddingLeft: 2, paddingRight: 2 }}>
						<Select value={'en'} sx={{ borderRadius: 22 }}>
							<MenuItem value={'en'}>EN</MenuItem>
							<MenuItem value={'de'}>DE</MenuItem>
							<MenuItem value={'es'}>ES</MenuItem>
						</Select>
					</Box>

					<Box sx={{ flex: 1, paddingLeft: 2, paddingRight: 2 }}>
						<ThemeSwitcher />
					</Box>
				</Box>
			</List>
		</Box>
	)
}

export default Main
