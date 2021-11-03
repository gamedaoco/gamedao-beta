import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import AccountSelector from 'src/components/AccountSelector'
import NetInfo from 'src/components/NetInfo'

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
					// alignItems: 'right',
					// justifyContent: 'end',
				}}
			>
				<Stack direction="row" justifyContent="start" alignItems="left" 				sx={{
					width: '50%',
				}}>
					<NetInfo />
				</Stack>
				<Stack direction="row" justifyContent="end" alignItems="right" 				sx={{
					width: '50%',
				}}>
					<Button>GameDAO</Button>
					<Button>Store</Button>
					<AccountSelector />
				</Stack>
			</Toolbar>
		</AppBar>
	)
}

export default Main
