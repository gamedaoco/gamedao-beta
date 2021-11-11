import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubHeader from '@mui/material/ListSubheader'
import { styled } from '@mui/material/styles'
import { BiArch, BiCoin, BiDiamond, BiGame, BiPyramid, BiWallet } from 'react-icons/bi'
import { SiDiscord, SiLinkedin, SiGithub } from 'react-icons/si'
import { NavLink } from 'react-router-dom'
import Badge from '@mui/material/Badge'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useThemeState } from 'src/Providers'
import { Divider, Paper, Typography } from 'src/components'
import { Icons, ICON_MAPPING } from 'src/components/Icons'
interface ComponentProps {
	showNavigation?: boolean
}

const SidebarButton = styled(ListItemButton)(({ theme }) => ({
	padding: theme.spacing(1),
	marginLeft: theme.spacing(1),
	marginRight: theme.spacing(1),
	marginTop: theme.spacing(0.5),
	marginBottom: theme.spacing(0.5),
	borderRadius: 22,
	color: theme.palette.text.secondary,
	['&:hover']: {
		color: theme.palette.text.primary,
	},
}))

const NavHeader = styled(ListSubHeader)(({ theme }) => ({
	backgroundColor: 'transparent',
	textTransform: 'uppercase',
	color: theme.palette.text.primary,
}))

const NavBadge = styled(Badge)(({ theme }) => ({
	flexGrow: 1,
	marginRight: theme.spacing(1),
	['& .MuiBadge-badge']: {
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
	return (
		<Box
			sx={{
				position: 'sticky',
				top: 0,
				width: '220px',
				display: 'flex',
				flexDirection: 'column',
				flex: 1,
				minHeight: '100%',
				borderRight: '1px solid #33383F',
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2, marginTop: 2 }}>
				<Icons src={darkmodeEnabled ? ICON_MAPPING.logoWhite : ICON_MAPPING.logo} alt={'GameDAO'} sx={{ width: '25%' }} />
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						marginLeft: '1rem',
					}}
				>
					<Typography variant="h5">Game</Typography>
					<Typography variant="h5">DAO</Typography>
				</Box>
			</Box>
			<List sx={{ display: 'flex', flex: 1, flexDirection: 'column', marginTop: '2.5rem' }}>
				<NavLink to="/app">
					<SidebarButton sx={{ padding: '0.8rem' }}>
						<ListItemIcon>
							<Icons
								src={ICON_MAPPING.dashboard}
								alt={'Dashboard'}
								sx={{ width: '1.75rem', filter: darkmodeEnabled ? 'invert(1)' : 'invert(0)' }}
							/>
						</ListItemIcon>
						<ListItemText>Dashboard</ListItemText>
					</SidebarButton>
				</NavLink>
				<NavLink to="/app/organisations">
					<SidebarButton sx={{ padding: '0.8rem' }}>
						<ListItemIcon>
							<Icons
								src={ICON_MAPPING.organizations}
								alt={'Organisations'}
								sx={{ width: '1.75rem', filter: darkmodeEnabled ? 'invert(1)' : 'invert(0)' }}
							/>
						</ListItemIcon>
						<ListItemText>Organisations</ListItemText>
					</SidebarButton>
				</NavLink>
				<NavLink to="/app/governance">
					<SidebarButton sx={{ padding: '0.8rem' }}>
						<ListItemIcon>
							<Icons src={ICON_MAPPING.voting} alt={'Votings'} sx={{ width: '1.75rem', filter: darkmodeEnabled ? 'invert(1)' : 'invert(0)' }} />
						</ListItemIcon>
						<ListItemText>Votings</ListItemText>
						<NavBadge badgeContent={5} color={'primary'} />
					</SidebarButton>
				</NavLink>
				<NavLink to="/app/campaigns">
					<SidebarButton sx={{ padding: '0.8rem' }}>
						<ListItemIcon>
							<Icons
								src={ICON_MAPPING.campains}
								alt={'Campaigns'}
								sx={{ width: '1.75rem', filter: darkmodeEnabled ? 'invert(1)' : 'invert(0)' }}
							/>
						</ListItemIcon>
						<ListItemText>Campaigns</ListItemText>
					</SidebarButton>
				</NavLink>
				<NavLink to="/app/tangram">
					<SidebarButton sx={{ padding: '0.8rem' }}>
						<ListItemIcon>
							<Icons src={ICON_MAPPING.tangram} alt={'Tangram'} sx={{ width: '1.75rem', filter: darkmodeEnabled ? 'invert(1)' : 'invert(0)' }} />
						</ListItemIcon>
						<ListItemText>Tangram</ListItemText>
					</SidebarButton>
				</NavLink>
				<NavLink to="/app/wallet">
					<SidebarButton sx={{ padding: '0.8rem' }}>
						<ListItemIcon>
							<Icons src={ICON_MAPPING.wallet} alt={'Wallet'} sx={{ width: '1.75rem', filter: darkmodeEnabled ? 'invert(1)' : 'invert(0)' }} />
						</ListItemIcon>
						<ListItemText>Wallet</ListItemText>
					</SidebarButton>
				</NavLink>
				<NavLink to="/">
					<SidebarButton sx={{ padding: '0.8rem' }}>
						<ListItemIcon>
							<Icons
								src={ICON_MAPPING.documentation}
								alt={'Wallet'}
								sx={{ width: '1.75rem', filter: darkmodeEnabled ? 'invert(1)' : 'invert(0)' }}
							/>
						</ListItemIcon>
						<ListItemText>Documentation</ListItemText>
					</SidebarButton>
				</NavLink>
				<Box sx={{ flex: 1 }} />
				<NavHeader>Social</NavHeader>
				<Box sx={{ paddingLeft: 2, paddingRight: 2, flexDirection: 'row', display: 'flex' }}>
					<SiDiscord size={'28px'} />
					<SiGithub size={'28px'} />
					<SiLinkedin size={'28px'} />
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
