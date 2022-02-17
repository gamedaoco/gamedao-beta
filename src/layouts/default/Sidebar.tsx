import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { useApiProvider } from '@substra-hooks/core'
import { useThemeState } from 'src/context/ThemeState'
import { useCrowdfunding } from 'src/hooks/useCrowdfunding'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'

import { styled, useTheme } from '@mui/material/styles'

import { Divider, FontIcon, Link, Paper, Typography, useMediaQuery, Box, List, ListSubheader, ListItemIcon, ListItemButton, Badge, Select, MenuItem } from 'src/components'
import { ICON_MAPPING, Icons } from 'src/components/Icons'
import NetInfo from 'src/components/NetInfo'
import useHover from 'src/hooks/useHover'
import { useWallet } from '../../context/Wallet'

interface ComponentProps {	
	showNavigation?: boolean
}

const SidebarButton = styled(ListItemButton)<{ active?: string | boolean }>(
	({ theme, active }) => ({
		padding: theme.spacing(1),
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		marginTop: theme.spacing(0.5),
		marginBottom: theme.spacing(0.5),
		borderRadius: '2rem',
		color: active ? theme.palette.grey[500] : theme.palette.grey[500_48],
		backgroundColor: active ? theme.palette.grey[500_16] : 'transparent',
		'&:hover': {
			color: theme.palette.text.primary,
		},
	}),
)

const NavHeader = styled(ListSubheader)(({ theme }) => ({
	backgroundColor: 'transparent',
	textTransform: 'uppercase',
	color: theme.palette.text.primary,
}))

const NavBadge = styled(Badge)(({ theme }) => ({
	'& .MuiBadge-badge': {
		color: theme.palette.background.default,
		borderRadius: '2rem',
		right: 'initial',
	},
}))

const ThemeSwitcher = () => {
	const { darkmodeEnabled, setDarkmodeEnabled } = useThemeState()
	const theme = useTheme()
	return (
		<Paper
			sx={{
				display: 'flex',
				justifyContent: 'space-evenly',
				alignItems: 'center',
				borderRadius: '1rem',
				border: '1px solid ' + theme.palette.grey[500_32],
				backgroundColor: 'transparent',
				margin: 'auto',
				height: '100%',
				p: '1rem',
				'*': { transitionTimingFunction: 'ease-in-out;', transitionDuration: '150ms' },
			}}
		>
			<Icons
				src={ICON_MAPPING.moon}
				alt='moon'
				sx={{
					cursor: 'pointer',
					filter: darkmodeEnabled ? 'invert(0)' : 'invert(0.5)',
				}}
				onClick={() => setDarkmodeEnabled(true)}
			/>
			<Divider orientation='vertical' variant='middle' flexItem />
			<Icons
				src={ICON_MAPPING.sun}
				alt='sun'
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
	const theme = useTheme()
	const { darkmodeEnabled } = useThemeState()
	const { pathname } = useLocation()

	const apiProvider = useApiProvider()
	const { campaignsCount } = useCrowdfunding()
	const { nonce } = useGameDaoControl()
	const { proposalsCount } = useGameDaoGovernance()
	const { connected } = useWallet()
	const isMobile = useMediaQuery('(max-width:1024px)')
	const sideBar = { fontSize: isMobile ? '2rem' : '3rem' }

	const [isHover, hoverProps] = useHover();

	return (
		<Box
			{...hoverProps} aria-describedby="overlay" // adds hover state on this elem
			sx={{
				position: 'sticky',
				top: 0,
				transition: "ease 0.2s all",
				marginLeft: (isMobile ) ? '-2rem' : 0,
				width: isMobile ? isHover ? '20rem' : '5rem' : '20rem',
				overflow: 'hidden',
				display: 'flex',
				flexDirection: 'column',
				flex: 1,
				minHeight: '100%',
				borderRight: '1px solid ' + theme.palette.grey[500_32],
			}}
		>
			<List sx={{ display: 'flex', flex: 1, flexDirection: 'column', marginTop: '1.5rem' }}>
				{/*
				<Link component={NavLink} to="/app">
					<SidebarButton active={pathname === '/app'} sx={{ mx: 4, py: 0 }}>
						<ListItemIcon>
							<FontIcon sx={{ ...sideBar }} name="dashboard" />
						</ListItemIcon>
						<Typography sx={{ fontSize: '1rem' }}>Dashboard</Typography>
					</SidebarButton>
				</Link>
				*/}
				{connected && <Link component={NavLink} to='/app/quest'>
					<SidebarButton active={pathname === '/app/quest'} sx={{ mx: 4, py: 0 }}>
						<ListItemIcon>
							<FontIcon sx={{ ...sideBar }} name='dashboard' />
						</ListItemIcon>
						<Typography sx={{ fontSize: '1rem' }}>Quests</Typography>
					</SidebarButton>
				</Link>}
				<Link component={NavLink} to='/app/organisations'>
					<SidebarButton
						active={!!pathname.match(/organisations/gi) ? 'active' : null}
						sx={{ mx: 4, py: 0 }}
					>
						<ListItemIcon>
							<FontIcon sx={{ ...sideBar }} name='organization' />
						</ListItemIcon>
						<Typography sx={{ fontSize: '1rem' }}>Organisations</Typography>
						{nonce > 0 && (
							<NavBadge
								sx={{ ml: '0.5rem' }}
								badgeContent={nonce}
								color={'success'}
								variant='dot'
							/>
						)}
					</SidebarButton>
				</Link>
				<Link component={NavLink} to='/app/governance'>
					<SidebarButton
						active={!!pathname.match(/governance/gi) ? 'active' : null}
						sx={{ mx: 4, py: 0 }}
					>
						<ListItemIcon>
							<FontIcon sx={{ ...sideBar }} name='voting' />
						</ListItemIcon>
						<Typography sx={{ fontSize: '1rem' }}>Votings</Typography>
						{proposalsCount > 0 && (
							<NavBadge
								sx={{ ml: '0.5rem' }}
								badgeContent={proposalsCount}
								color={'primary'}
								variant='dot'
							/>
						)}
					</SidebarButton>
				</Link>
				<Link component={NavLink} to='/app/campaigns'>
					<SidebarButton
						active={!!pathname.match(/campaigns/gi) ? 'active' : null}
						sx={{ mx: 4, py: 0 }}
					>
						<ListItemIcon>
							<FontIcon sx={{ ...sideBar }} name='campaign' />
						</ListItemIcon>
						<Typography sx={{ fontSize: '1rem' }}>Campaigns</Typography>
						{campaignsCount > 0 && (
							<NavBadge
								sx={{ ml: '0.5rem' }}
								badgeContent={campaignsCount}
								color={'info'}
								variant='dot'
							/>
						)}
					</SidebarButton>
				</Link>
				{/* TODO: Activate as soon as we work on the Tangram page  */}
				{false && (
					<Link component={NavLink} to='/app/tangram'>
						<SidebarButton
							active={!!pathname.match(/tangram/gi) ? 'active' : null}
							sx={{ mx: 4, py: 0 }}
						>
							<ListItemIcon>
								<FontIcon sx={{ ...sideBar }} name='tangram' />
							</ListItemIcon>
							<Typography sx={{ fontSize: '1rem' }}>Tangram</Typography>
						</SidebarButton>
					</Link>
				)}

				{/*				<Link component={NavLink} to="/app/wallet">
					<SidebarButton active={!!pathname.match(/wallet/gi) ? 'active' : null} sx={{ mx: 4, py: 0 }}>
						<ListItemIcon>
							<FontIcon sx={{ ...sideBar }} name="wallet" />
						</ListItemIcon>
						<Typography sx={{ fontSize: '1rem' }}>Wallet</Typography>
					</SidebarButton>
				</Link>*/}

				<List
					sx={{ display: 'flex', flex: 1, flexDirection: 'column', margin: '2.5rem 0' }}
				>
					<a
						target='_blank'
						rel='noreferrer'
						href='https://discord.gg/P7NHWGzJ7r'
						style={{
							color: 'transparent',
						}}
					>
						<SidebarButton sx={{ mx: 4, py: 0 }}>
							<ListItemIcon>
								<FontIcon sx={{ ...sideBar }} name='store' />
							</ListItemIcon>
							<Typography sx={{ fontSize: '1rem' }}>Faucet</Typography>
						</SidebarButton>
					</a>
					<Link href='https://docs.gamedao.co' target='_blank' rel='noreferrer'>
						<SidebarButton sx={{ mx: 4, py: 0 }}>
							<ListItemIcon>
								<FontIcon sx={{ ...sideBar }} name='document' />
							</ListItemIcon>
							<Typography sx={{ fontSize: '1rem' }}>Documentation</Typography>
						</SidebarButton>
					</Link>
				</List>

				<Box sx={{ flex: 1 }} />

				{!isMobile && (
					<Box sx={{ p: '2rem 0' }}>
						<NavHeader>Network Info</NavHeader>
						<Box sx={{ px: 2 }}>
							<NetInfo />
						</Box>
					</Box>
				)}

				{!isMobile && (
					<Box sx={{ display: 'flex', pb: '1rem', alignItems: 'center' }}>
						<Box sx={{ flex: 1, px: '1rem' }}>
							<Select value={'en'} sx={{ borderRadius: '1rem' }}>
								<MenuItem value={'en'}>EN</MenuItem>
								<MenuItem disabled value={'de'}>
									DE
								</MenuItem>
								<MenuItem disabled value={'jp'}>
									JP
								</MenuItem>
								<MenuItem disabled value={'es'}>
									ES
								</MenuItem>
							</Select>
						</Box>
						<Box sx={{ flex: 1, px: '1rem' }}>
							<ThemeSwitcher />
						</Box>
					</Box>
				)}
			</List>
		</Box>
	)
}

export default Main
