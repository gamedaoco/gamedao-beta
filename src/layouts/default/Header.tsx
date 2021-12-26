import React from 'react'
import { NavLink } from 'react-router-dom'
import { useThemeState } from 'src/context/ThemeState'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Stack from '@mui/material/Stack'
import { Box, Link } from 'src/components'
import AccountSelector from 'src/components/AccountSelector'
import { Icons, ICON_MAPPING } from 'src/components/Icons'


function Main() {

	const { darkmodeEnabled } = useThemeState()

	return (
		<AppBar position="sticky" elevation={0}>
			<Toolbar
				sx={{
					zIndex: '9000',
					backgroundColor: 'background.default',
					width: '100%',
					height: '5rem',
					borderBottom: '1px solid #33383F',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}

			>
				<Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2, marginTop: 1 }}>
					<Link component={NavLink} to="/app">
						<Icons
							src={darkmodeEnabled ? ICON_MAPPING.logoWhite : ICON_MAPPING.logo}
							alt={'GameDAO'}
							sx={{ height: '45.4px' }}
						/>
					</Link>
				</Box>
				<Stack
					direction="row"
					justifyContent="end"
					alignItems="right"
					sx={{
						width: '50%',
					}}
				>
					<AccountSelector />
				</Stack>
			</Toolbar>
		</AppBar>
	)
}

export default Main
