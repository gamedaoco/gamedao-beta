import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import AccountSelector from 'src/components/AccountSelector'

interface ComponentProps {
	showWallet?: boolean
}

function Main({ showWallet }: ComponentProps) {

	return (
		<AppBar color="transparent" position="sticky" elevation={0}>
			<Toolbar
				sx={{
					zIndex: '9000',
					background: 'none',
					width: '100%',
					alignItems: 'right',
					justifyContent: 'end',
				}}
			>
					<AccountSelector />
			</Toolbar>
		</AppBar>
	)
}

export default Main
