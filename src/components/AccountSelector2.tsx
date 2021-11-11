import React, { useState, useEffect, useRef } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useSubstrate } from 'src/substrate-lib/SubstrateContext'
import { useWallet } from 'src/context/Wallet'
import { Button, Typography, ButtonGroup, ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { createErrorNotification } from 'src/utils/notification'
import { Icons, ICON_MAPPING } from './Icons'
import { useThemeState } from 'src/context/ThemeState'
import { useStore } from 'src/context/Store'
import { usePolkadotExtension } from '@substra-hooks/core'

function accountString(address) {
	return address.length < 10 ? address : `${address.slice(0, 6)} ... ${address.slice(-6)}`
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
	}, [allowConnect])

	useEffect(() => {
		// Set initial account => default account 0
		if (accounts && allowConnect) {
			updateWalletState({ account: accounts[0], address: accounts[0]?.address })
		}
	}, [accounts, allowConnect])

	useEffect(() => {
		// Set selected account
		if (accounts.length > 0 && selectedIndex >= 0 && selectedIndex < accounts.length && address !== accounts?.[selectedIndex]?.address) {
			updateWalletState({ account: accounts[selectedIndex], address: accounts[selectedIndex]?.address })
		}
	}, [selectedIndex])

	return (
		<>
			{(!allowConnect || !accounts) && <Button size="small" variant="outlined" onClick={handleConnect}>{`connect`}</Button>}
			{account && address && (
				<ButtonGroup variant="contained" ref={anchorRef} aria-label="account-selector">
					<CopyToClipboard text={address}>
						<Button size="small" color={address ? 'success' : 'error'}>{`${accountString(address)}`}</Button>
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
										>
											<Typography variant="subtitle1">{accountString(option.address)}</Typography>
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
	const { api } = useSubstrate()
	const { address } = useWallet()

	const [zero, setZERO] = useState(0)
	const [play, setPLAY] = useState(0)
	const [game, setGAME] = useState(0)

	useEffect(() => {
		if (!address || !api) return
		let unsubscribe
		const query = async () => {
			const context = api.query.assets.account
			api.queryMulti(
				[
					[api.query.system.account, address],
					[context, [Number(0), address]],
					[context, [Number(1), address]],
				],
				([_zero, _play, _game]) => {
					setZERO(_zero.data.free.toHuman())
					setPLAY(_play.toHuman().balance)
					setGAME(_game.toHuman().balance)
				}
			)
				.then((unsub) => {
					unsubscribe = unsub
				})
				.catch(console.error)
		}
		query()
		return () => unsubscribe && unsubscribe()
	}, [api, address])

	return address ? (
		<div style={{ fontSize: '8px', lineHeight: '10px', marginRight: '10px', marginLeft: '10px', marginTop: '8px' }}>
			{zero}
			<br />
			{play} PLAY
			<br />
			{game} GAME
		</div>
	) : null
}

const AccountSelector = (props) => {
	const { api } = useSubstrate()

	return api && api.query ? <AccountComponent {...props} /> : null
}

export default AccountSelector
