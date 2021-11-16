import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Stack from '@mui/material/Stack'
import AccountSelector from 'src/components/AccountSelector'

function Main() {
	return (
		<AppBar position="sticky" elevation={0}>
			<Toolbar
				sx={{
					zIndex: '9000',
					backgroundColor: 'background.default',
					width: '100%',
					height: '5rem',
					borderBottom: '1px solid #33383F',
					justifyContent: 'flex-end',
				}}
			>
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
