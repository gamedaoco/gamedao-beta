import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { useTheme } from '@mui/styles'

import HomeIcon from '@mui/icons-material/Home'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'


import { BiWallet, BiJoystick, BiHomeCircle, BiListCheck, BiListPlus, BiCoinStack, BiCoin, BiPyramid, BiGame, BiPlus, BiDiamond } from "react-icons/bi";

import { Stack, Box, Typography } from 'src/components'
import AccountSelector from 'src/components/AccountSelector'

const StyledLink = styled(NavLink)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	color: 'white',
	'& > p': {
		paddingLeft: '2rem',
	},
	minHeight: '24px',
}))

const imageURL = `${process.env.PUBLIC_URL}/assets/gamedao_tangram.svg`

interface ComponentProps {
	showNavigation?: boolean
}

function Main({ showNavigation }: ComponentProps) {
	const theme = useTheme()
	// const linkActiveColor = theme.palette.secondary.main

	const [ isSidebarOpen, setSidebarOpen ] = React.useState(false)
	const toggleSidebar = () => setSidebarOpen(!isSidebarOpen)

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
					transition: 'all 0.1s ease;',
				}}
			>
				<Stack direction="column" justifyContent="start" alignItems="left" spacing={4}>
					<StyledLink activeStyle={{ color: 'white' }} to="/">
						<img style={{ height: '2rem' }} alt="GameDAO" src={imageURL} height={32} />
					</StyledLink>

					<StyledLink to="/app">
						<BiGame color="white" /> <Typography>Dashboard</Typography>
					</StyledLink>
					<StyledLink activeStyle={{ color: 'white' }} to="/app/organisations">
						<BiPyramid color="white" /> <Typography>Organisations</Typography>
					</StyledLink>
					<StyledLink activeStyle={{ color: 'white' }} to="/app/governance">
						<BiListCheck color="white" /> <Typography>Governance</Typography>
					</StyledLink>
					<StyledLink activeStyle={{ color: 'white' }} to="/app/campaigns">
						<BiCoin color="white" /> <Typography>Campaigns</Typography>
					</StyledLink>
					<StyledLink activeStyle={{ color: 'white' }} to="/app/tangram">
						<BiDiamond color="white" /> <Typography>Tangram</Typography>
					</StyledLink>
					<StyledLink activeStyle={{ color: 'white' }} to="/app/wallet">
						<BiWallet color="white" /> <Typography>Wallet</Typography>
					</StyledLink>

				</Stack>
			</Toolbar>
		</AppBar>
	)
}

export default Main