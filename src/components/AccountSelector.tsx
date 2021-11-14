import React, { useState, useEffect, useRef } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useSubstrate } from 'src/substrate-lib/SubstrateContext'
import { useWallet } from 'src/context/Wallet'
import { Button, Typography, ButtonGroup, ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { /*createErrorNotification, */createInfoNotification } from 'src/utils/notification'
import { Icons, ICON_MAPPING } from './Icons'
import { useThemeState } from 'src/context/ThemeState'
import { useStore } from 'src/context/Store'
import { usePolkadotExtension } from '@substra-hooks/core'
import { useBalance } from 'src/hooks/useBalance'

function accountString(account) {
	const text = account?.meta?.name || account?.address || ''
	return text.length < 10 ? text : `${text.slice(0, 6)} ... ${text.slice(-6)}`
}

const AccountComponent = () => {
	const { darkmodeEnabled } = useThemeState()
	const { updateStore, allowConnection } = useStore()
	const [open, setOpen] = useState(false)
	const { accounts, w3enable, w3Enabled } = usePolkadotExtension()
	const [selectedIndex, setSelectedIndex] = useState(0)
	const { allowConnect, updateWalletState, account, address } = useWallet()

	const anchorRef = useRef<HTMLDivElement>(null)

	const handleConnect = (e) => {
		e.stopPropagation()
		if (allowConnection) {
			updateWalletState({ allowConnect: true })
		} else {
			updateStore({ allowConnection: true })
		}
	}
	const handleDisconnect = (e) => {
		e.stopPropagation()
		updateWalletState({ allowConnect: false })
	}

	const handleMenuItemClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
		e.stopPropagation()
		setSelectedIndex(index)
		setOpen(false)
	}

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen)
	}

	const handleClose = (event: Event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
			return
		}
		setOpen(false)
	}

	useEffect(() => {
		// Open web3 connection and load accounts
		if (allowConnect && !w3Enabled) {
			w3enable()
		} else if (w3Enabled && !allowConnect) {
			updateWalletState({ address: null, account: null, allowConnect: false, connected: false })
		}
	}, [allowConnect, updateWalletState, w3enable, w3Enabled])

	useEffect(() => {
		// Set initial account => default account 0
		if (accounts && allowConnect) {
			updateWalletState({ account: accounts[0], address: accounts[0]?.address })
		}
	}, [accounts, allowConnect, updateWalletState])

	useEffect(() => {
		// Set selected account
		if (accounts?.length > 0 && selectedIndex >= 0 && selectedIndex < accounts.length && address !== accounts?.[selectedIndex]?.address) {
			updateWalletState({ account: accounts[selectedIndex], address: accounts[selectedIndex]?.address })
		}
	}, [selectedIndex, updateWalletState, accounts, address])

	return (
		<>
			{(!allowConnect || !accounts) && <Button size="small" variant="outlined" onClick={handleConnect}>{`connect`}</Button>}
			{account && address && (
				<ButtonGroup variant="contained" ref={anchorRef} aria-label="account-selector">
					<CopyToClipboard text={address} onCopy={() => createInfoNotification('Address copied')}>
						<Button title={address} size="small" color={address ? 'success' : 'error'}>{`${accountString(account)}`}</Button>
					</CopyToClipboard>

					<IconButton
						size="small"
						aria-controls={open ? 'account-menu' : undefined}
						aria-expanded={open ? 'true' : undefined}
						aria-label="select account"
						aria-haspopup="menu"
						onClick={handleToggle}
					>
						<KeyboardArrowDownIcon fontSize="inherit" />
					</IconButton>
					<BalanceAnnotation />
					<IconButton size="small" aria-label="disconnect" onClick={handleDisconnect}>
						<Icons src={ICON_MAPPING.logout} alt={'logout'} sx={{ filter: darkmodeEnabled ? 'invert(0)' : 'invert(1)' }} />
					</IconButton>
				</ButtonGroup>
			)}
			<Popper open={open} anchorEl={anchorRef.current} placement={'bottom-start'} role={undefined} transition disablePortal>
				{({ TransitionProps, placement }) => (
					<Grow
						{...TransitionProps}
						style={{
							transformOrigin: placement === 'bottom-end' ? 'end top' : 'end bottom',
						}}
					>
						<Paper>
							<ClickAwayListener onClickAway={handleClose}>
								<MenuList id="account-menu">
									{accounts?.map((option, index) => (
										<MenuItem
											key={index}
											disabled={index === 2}
											selected={index === selectedIndex}
											onClick={(event) => handleMenuItemClick(event, index)}
											title={option?.address}
										>
											<Typography variant="subtitle1">{accountString(option)}</Typography>
										</MenuItem>
									))}
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>
		</>
	)
}

const BalanceAnnotation = () => {
	const { balanceZero, balancePlay, balanceGame } = useBalance()

	return (
		<div style={{ fontSize: '8px', lineHeight: '10px', marginRight: '10px', marginLeft: '10px', marginTop: '8px' }}>
			{balanceZero}
			<br />
			{balancePlay} PLAY
			<br />
			{balanceGame} GAME
		</div>
	)
}

const AccountSelector = (props) => {
	const { api } = useSubstrate()

	return api && api.query ? <AccountComponent {...props} /> : null
}

export default AccountSelector
