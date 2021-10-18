import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import AccountSelector from 'src/components/AccountSelector'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'

import { Stack } from '../../components'

import { styled } from '@mui/material/styles'

const StyledLink = styled(NavLink)(({ theme }) => ({
	color: 'white',
}))

const imageURL = `${process.env.PUBLIC_URL}/assets/gamedao_tangram.svg`

interface ComponentProps {
	accountPair?: object
	setAccountAddress?: Function
	showNavigation?: boolean
}

function Main({ accountPair, setAccountAddress, showNavigation }: ComponentProps) {
	return (
		<AppBar color="secondary" position="sticky">
			<Toolbar
				sx={{
					justifyContent: 'space-between',
					px: '3rem !important',
					py: '1rem !important',
				}}
			>
				<Stack direction="row" justifyContent="center" alignItems="center" spacing={4}>
					<StyledLink activeStyle={{ color: 'red' }} to="/">
						<img alt="GameDAO" src={imageURL} height={32} />
					</StyledLink>
				</Stack>
				{ showNavigation &&
					<Stack direction="row" justifyContent="center" alignItems="center" spacing={4}>
						<StyledLink to="/app"> Dashboard </StyledLink>
						<StyledLink activeStyle={{ color: 'red' }} to="/app/organisations">
							{' '}
							Organisations{' '}
						</StyledLink>
						<StyledLink activeStyle={{ color: 'red' }} to="/app/governance">
							{' '}
							Governance{' '}
						</StyledLink>
						<StyledLink activeStyle={{ color: 'red' }} to="/app/campaigns">
							{' '}
							Campaigns{' '}
						</StyledLink>
						<StyledLink activeStyle={{ color: 'red' }} to="/app/tangram">
							{' '}
							Tangram{' '}
						</StyledLink>
						<StyledLink activeStyle={{ color: 'red' }} to="/app/wallet">
							{' '}
							Wallet{' '}
						</StyledLink>
					</Stack>
				}
				<Stack direction="row" justifyContent="center" alignItems="center">
					<AccountSelector setAccountAddress={setAccountAddress} />
				</Stack>
			</Toolbar>
		</AppBar>
	)
}

export default Main
