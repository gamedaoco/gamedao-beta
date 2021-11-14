import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Stack from '@mui/material/Stack'
import AccountSelector from 'src/components/AccountSelector'
import NetInfo from 'src/components/NetInfo'

function Main() {
	return (
		<AppBar color="transparent" position="sticky" elevation={0}>
			<Toolbar
				sx={{
					zIndex: '9000',
					background: 'rgba(255,255,255,0.6)',
					backdropFilter: 'blur(10px)',
					width: '100%',
					height: '5rem',
					boxShadow: 2,
				}}
			>
				<Stack
					direction="row"
					justifyContent="start"
					alignItems="left"
					sx={{
						width: '50%',
					}}
				>
					<NetInfo />
				</Stack>
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
