import React from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import { useApiProvider } from '@substra-hooks/core'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListSubHeader from '@mui/material/ListSubheader'
import { useLocation } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { SiDiscord, SiLinkedin, SiGithub, SiTelegram, SiTwitter } from 'react-icons/si'
import { NavLink } from 'react-router-dom'
import Badge from '@mui/material/Badge'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Divider, Paper, Typography, FontIcon } from 'src/components'
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
				width: '275px',
				display: 'flex',
				flexDirection: 'column',
				flex: 1,
				minHeight: '100%',
				borderRight: '1px solid #33383F',
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 4, marginTop: 1.5 }}>
				<Icons
					src={darkmodeEnabled ? ICON_MAPPING.logoWhite : ICON_MAPPING.logo}
					alt={'GameDAO'}
					sx={{ height: '45.4px' }}
				/>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						marginLeft: '1rem',
					}}
				>
					<Typography variant="h4">GAME</Typography>
					<Typography sx={{ marginTop: '-10px' }} variant="h3">
						DAO
					</Typography>
				</Box>
			</Box>
			<List sx={{ display: 'flex', flex: 1, flexDirection: 'column', marginTop: '2.5rem' }}>
				<NavLink to="/app">
					<SidebarButton active={pathname === '/app'} sx={{ mx: 3, py: 0 }}>
						<ListItemIcon>
							<FontIcon sx={{ fontSize: '4rem' }} name="dashboard" />
						</ListItemIcon>
						<Typography variant="h5">Dashboard</Typography>
					</SidebarButton>
				</NavLink>
				<NavLink to="/app/organisations">
					<SidebarButton
						active={!!pathname.match(/organisations/gi)}
						sx={{ mx: 3, py: 0 }}
					>
						<ListItemIcon>
							<FontIcon sx={{ fontSize: '4rem' }} name="organization" />
						</ListItemIcon>
						<Typography variant="h5">Organisations</Typography>
						{organisationCount > 0 ? (
							<>
								<Box />
								<NavBadge badgeContent={organisationCount} color={'primary'} />
							</>
						) : null}
					</SidebarButton>
				</NavLink>
				<NavLink to="/app/governance">
					<SidebarButton active={!!pathname.match(/governance/gi)} sx={{ mx: 3, py: 0 }}>
						<ListItemIcon>
							<FontIcon sx={{ fontSize: '4rem' }} name="voting" />
						</ListItemIcon>
						<Typography variant="h5">Votings</Typography>
						{votingCount > 0 ? (
							<>
								<Box />
								<NavBadge badgeContent={votingCount} color={'primary'} />
							</>
						) : null}
					</SidebarButton>
				</NavLink>
				<NavLink to="/app/campaigns">
					<SidebarButton active={!!pathname.match(/campaigns/gi)} sx={{ mx: 3, py: 0 }}>
						<ListItemIcon>
							<FontIcon sx={{ fontSize: '4rem' }} name="campaign" />
						</ListItemIcon>
						<Typography variant="h5">Campaigns</Typography>
						{campaignsCount > 0 ? (
							<>
								<Box />
								<NavBadge badgeContent={campaignsCount} color={'primary'} />
							</>
						) : null}
					</SidebarButton>
				</NavLink>
				{/* TODO: Activate as soon as we work on the Tangram page  */}
				{false && (
					<NavLink to="/app/tangram">
						<SidebarButton active={!!pathname.match(/tangram/gi)} sx={{ mx: 3, py: 0 }}>
							<ListItemIcon>
								<FontIcon sx={{ fontSize: '4rem' }} name="tangram" />
							</ListItemIcon>
							<Typography variant="h5">Tangram</Typography>
						</SidebarButton>
					</NavLink>
				)}
				<NavLink to="/app/wallet">
					<SidebarButton active={!!pathname.match(/wallet/gi)} sx={{ mx: 3, py: 0 }}>
						<ListItemIcon>
							<FontIcon sx={{ fontSize: '4rem' }} name="wallet" />
						</ListItemIcon>
						<Typography variant="h5">Wallet</Typography>
					</SidebarButton>
				</NavLink>
				<a href="https://docs.gamedao.co" target="_blank" rel="noreferrer">
					<SidebarButton sx={{ mx: 3, py: 0 }}>
						<ListItemIcon>
							<FontIcon sx={{ fontSize: '4rem' }} name="document" />
						</ListItemIcon>
						<Typography variant="h5">Documentation</Typography>
					</SidebarButton>
				</a>
				<Box sx={{ flex: 1 }} />
				<NavHeader>Network Info</NavHeader>
				<Box sx={{ px: 2 }}>
					<NetInfo />
				</Box>
				<NavHeader>Social</NavHeader>
				<Box
					sx={{ paddingLeft: 2, paddingRight: 2, flexDirection: 'row', display: 'flex' }}
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
