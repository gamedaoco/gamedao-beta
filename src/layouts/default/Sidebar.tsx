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

const imageURL = `${process.env.PUBLIC_URL}/assets/gamedao_tangram.svg`

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
		color: theme.palette.text.primary,
		borderRadius: 6,
		right: 'initial',
	},
}))

function Main({ showNavigation }: ComponentProps) {
	return (
		<Box sx={{ position: 'sticky', top: 0, width: '220px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
			<Box component={'img'} src={imageURL} alt={'GameDAO'} sx={{ width: '25%', marginLeft: 2, marginTop: 2 }} />
			<List sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
				<NavHeader>Navigation</NavHeader>
				<NavLink to="/app">
					<SidebarButton>
						<ListItemIcon>
							<BiGame size={'28px'} />
						</ListItemIcon>
						<ListItemText>Dashboard</ListItemText>
					</SidebarButton>
				</NavLink>
				<NavLink to="/app/organisations">
					<SidebarButton>
						<ListItemIcon>
							<BiPyramid size={'28px'} />
						</ListItemIcon>
						<ListItemText>Organisations</ListItemText>
					</SidebarButton>
				</NavLink>
				<NavLink to="/app/governance">
					<SidebarButton>
						<ListItemIcon>
							<BiArch size={'28px'} />
						</ListItemIcon>
						<ListItemText>Governance</ListItemText>
						<NavBadge badgeContent={5} color={'primary'} />
					</SidebarButton>
				</NavLink>
				<NavLink to="/app/campaigns">
					<SidebarButton>
						<ListItemIcon>
							<BiCoin size={'28px'} />
						</ListItemIcon>
						<ListItemText>Campaigns</ListItemText>
					</SidebarButton>
				</NavLink>
				<NavLink to="/app/tangram">
					<SidebarButton>
						<ListItemIcon>
							<BiDiamond size={'28px'} />
						</ListItemIcon>
						<ListItemText>Tangram</ListItemText>
					</SidebarButton>
				</NavLink>
				<NavLink to="/app/wallet">
					<SidebarButton>
						<ListItemIcon>
							<BiWallet size={'28px'} />
						</ListItemIcon>
						<ListItemText>Wallet</ListItemText>
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
				<Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
					<Select value={'en'} sx={{ borderRadius: 22 }}>
						<MenuItem value={'en'}>EN</MenuItem>
						<MenuItem value={'de'}>DE</MenuItem>
						<MenuItem value={'es'}>ES</MenuItem>
					</Select>
				</Box>
			</List>
		</Box>
	)
}

export default Main
