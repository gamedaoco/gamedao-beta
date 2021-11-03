import React, { useState, useEffect, useRef } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { useSubstrate } from 'src/substrate-lib/SubstrateContext'
import { useWallet } from 'src/context/Wallet'

import { Button, Typography, ButtonGroup, ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import LogoutIcon from '@mui/icons-material/Logout'

const AccountComponent = (props) => {

	const { keyring } = useSubstrate()
	const { allowConnect, setAllowConnect, setAccountAddress, setAccountPair } = useWallet()
	const [ keyringOptions, setKeyringOptions ] = useState(null)
	const [ initialAddress, setInitialAddress ] = useState(null)
	const [ accountSelected, setAccountSelected ] = useState(null)
	const [ selectedIndex, setSelectedIndex ] = useState(0)

	const [ open, setOpen ] = React.useState(false)
	const anchorRef = useRef<HTMLDivElement>(null)

	useEffect(()=>{
		if(!allowConnect) return
		const args = keyring.getPairs().map((account) => ({
			key: account.address,
			value: account.address,
			text: account.meta.name.toUpperCase(),
			icon: 'user',
			accountPair: account
		}))
		setKeyringOptions( args )
	},[allowConnect, keyring])

	useEffect(()=>{
		if(!allowConnect || !keyringOptions) return
		const args = keyringOptions.length > 0 ? keyringOptions[selectedIndex].value : ''
		setInitialAddress( args )
		setAccountPair( args.accountPair )
	},[allowConnect, keyringOptions, selectedIndex, initialAddress])

	useEffect(()=>{
		if(!allowConnect || !keyringOptions) return
		const args = keyringOptions.length > 0 ? keyringOptions[selectedIndex].value : ''
		setAccountAddress(args)
		setAccountSelected(args)
		setAccountPair( args.accountPair )
		console.log('setAccountAddress',args)
	},[allowConnect, keyringOptions, selectedIndex, setAccountAddress])

	//
	//
	//

	const handleConnect = (event) => {
		setAllowConnect(true)
		console.log('connect')
	}
	const handleDisconnect = (event) => {
		setAccountAddress('')
		setAllowConnect(false)
		console.log('disconnect')
	}

	const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
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

	const accountString = args => {
		if (!args) return ''
		const txt = ( args.text || args.value )
		return ( txt.length < 10 ) ? txt : `${txt.slice(0, 10)}...`
	}

	return (
		<>
			{ !allowConnect ? (
				<Button size="small" variant="outlined" onClick={handleConnect}>{`connect`}</Button>
			) : (
				<ButtonGroup variant="contained" ref={anchorRef} aria-label="account-selector">
					{ keyringOptions &&
						<CopyToClipboard text={accountSelected}>
							<Button size="small" color={accountSelected ? 'success' : 'error'}>{`${accountString(keyringOptions[selectedIndex])}`}</Button>
						</CopyToClipboard>
					}
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
						<LogoutIcon fontSize="inherit" />
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
									{keyringOptions.map((option, index) => (
										<MenuItem
											key={index}
											disabled={index === 2}
											selected={index === selectedIndex}
											onClick={(event) => handleMenuItemClick(event, index)}
										>
											<Typography variant="subtitle1">{option.text}</Typography>
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
				([_zero,_play, _game]) => {
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

	const { api, keyring } = useSubstrate()
	return api && keyring && keyring.getPairs && api.query ? <AccountComponent {...props} /> : null

}

export default AccountSelector
