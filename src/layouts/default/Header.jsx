import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { styled } from '@mui/material/styles'
// import { BiJoystick, BiHomeCircle, BiListCheck, BiListPlus, BiCoinStack, BiCoin, BiPyramid, BiGame, BiPlus, BiDiamond } from "react-icons/bi";

import HomeIcon from '@mui/icons-material/Home'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { useTheme } from '@mui/styles'

import { Stack, Box, Typography } from '../../components'
import AccountSelector from 'src/components/AccountSelector'

const StyledLink = styled(NavLink)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	color: 'white',
	'& > p': {
		paddingLeft: '2rem',
	},
}))

const imageURL = `${process.env.PUBLIC_URL}/assets/gamedao_tangram.svg`

function Main({ accountPair, setAccountAddress }) {
	const theme = useTheme()
	const linkActiveColor = theme.palette.secondary.main
	const [isSidebarOpen, setSidebarOpen] = React.useState(false)

	function toggleSidebar() {
		setSidebarOpen(!isSidebarOpen)
	}

	return (
		<AppBar color="secondary" position="sticky">
			<Toolbar
				onMouseEnter={toggleSidebar}
				onMouseLeave={toggleSidebar}
				sx={{
					justifyContent: 'start',
					alignItems: 'start',
					py: '2rem',
					px: '2rem !important',
					height: '100vh',
					width: isSidebarOpen ? '18rem' : '6rem',
					overflow: 'hidden',
					transition: 'all 0.5s ease;',
				}}
			>
				<Stack direction="column" justifyContent="start" alignItems="left" spacing={4}>
					<StyledLink activeStyle={{ color: linkActiveColor }} to="/">
						<img style={{ height: '2rem' }} alt="GameDAO" src={imageURL} height={32} />
					</StyledLink>
					<AccountSelector setAccountAddress={setAccountAddress} />
					<StyledLink to="/app">
						<HomeIcon fontSize="large" /> <Typography>Dashboard</Typography>
					</StyledLink>
					<StyledLink activeStyle={{ color: linkActiveColor }} to="/app/organisations">
						<HomeIcon fontSize="large" /> <Typography>Organisations</Typography>
					</StyledLink>
					<StyledLink activeStyle={{ color: linkActiveColor }} to="/app/governance">
						<HomeIcon fontSize="large" /> <Typography>Governance</Typography>
					</StyledLink>
					<StyledLink activeStyle={{ color: linkActiveColor }} to="/app/campaigns">
						<HomeIcon fontSize="large" /> <Typography>Campaigns</Typography>
					</StyledLink>
					<StyledLink activeStyle={{ color: linkActiveColor }} to="/app/tangram">
						<HomeIcon fontSize="large" /> <Typography>Tangram</Typography>
					</StyledLink>
					<StyledLink activeStyle={{ color: linkActiveColor }} to="/app/wallet">
						<HomeIcon fontSize="large" /> <Typography>Wallet</Typography>
					</StyledLink>
				</Stack>
			</Toolbar>
		</AppBar>
	)
}

export default Main
