import React, { useState, useEffect, useRef } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { useSubstrate } from '../substrate-lib'
import { useWallet } from '../context/Wallet'

import { Button, ButtonGroup, ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import LogoutIcon from '@mui/icons-material/Logout'


const AccountComponent = (props) => {

	const [open, setOpen] = React.useState(false)
	const [selectedIndex, setSelectedIndex] = useState(0)
	const anchorRef = useRef<HTMLDivElement>(null)

	const { keyring } = useSubstrate()
	const { toggleAllowConnect, setAccountAddress } = useWallet()
	const [ accountSelected, setAccountSelected ] = useState(null)

	// Get the list of accounts we possess the private key for
	const keyringOptions = keyring.getPairs().map((account) => ({
		key: account.address,
		value: account.address,
		text: account.meta.name.toUpperCase(),
		icon: 'user',
	}))

	const initialAddress = keyringOptions.length > 0 ? keyringOptions[selectedIndex].value : ''

	// Set the initial address
	useEffect(() => {
		setAccountAddress(initialAddress)
		setAccountSelected(initialAddress)
	}, [setAccountAddress, initialAddress])

	const onChange = (address='') => {
		setAccountAddress(address)
		setAccountSelected(address)
	}

	const handleToggleAllowConnect = (event) => {
		console.log('toggle a')
		toggleAllowConnect()
	}

	const handleClick = () => {
		console.info(`You clicked ${keyringOptions[selectedIndex].value}`)
		setAccountAddress(keyringOptions[selectedIndex].value)
		setAccountSelected(keyringOptions[selectedIndex].value)
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
			{ !accountSelected ? (
				<Button onClick={handleToggleAllowConnect}>{`connect`}</Button>
			) : (
				<ButtonGroup variant="contained" ref={anchorRef} aria-label="account-selector">
					<CopyToClipboard text={accountSelected}>
						<Button color={accountSelected ? 'success' : 'error'}>{`${accountString(keyringOptions[selectedIndex])}`}</Button>
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
{/*
					<BalanceAnnotation accountSelected={accountSelected} />
*/}					<IconButton size="small" aria-label="disconnect" onClick={handleToggleAllowConnect}>
						<LogoutIcon fontSize="inherit" />
					</IconButton>
				</ButtonGroup>
			)}

			{/*
	TODO: needs to be bottom end, currently refuses to take the button as anchor ref
*/}
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
											{option.text}
										</MenuItem>
									))}
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>

			{/*
			 */}
		</>
	)
}

// const BalanceAnnotation = ({ accountSelected }) => {

// 	const { api } = useSubstrate()
// 	// const [ accountBalance, setAccountBalance ] = useState(0);

// 	const [zero, setZERO] = useState(0)
// 	const [play, setPLAY] = useState(0)
// 	const [game, setGAME] = useState(0)
// 	// const [zeur, setZEUR] = useState(0)

// 	useEffect(() => {
// 		if (!accountSelected || !api) return

// 		const query = async () => {
// 			let unsubscribe
// 			const context = api.query.assets.account

// 			api.queryMulti(
// 				[
// 					[api.query.system.account, accountSelected],
// 					[context, [Number(0), accountSelected]],
// 					[context, [Number(1), accountSelected]],
// 				],
// 				([_zero,_play, _game]) => {
// 					setZERO(_zero.data.free.toHuman())
// 					setPLAY(_play.toHuman().balance)
// 					setGAME(_game.toHuman().balance)
// 				}
// 			)
// 				.then((unsub) => {
// 					unsubscribe = unsub
// 				})
// 				.catch(console.error)
// 			return () => unsubscribe && unsubscribe()
// 		}
// 		query()
// 	}, [api, accountSelected])

// 	// useEffect(() => {
// 	// 	if (!accountSelected || !api) return

// 	// 	let unsubscribe
// 	// 	accountSelected &&
// 	// 		api.query.system
// 	// 			.account(accountSelected, (balance) => {
// 	// 				setZERO(balance.data.free.toHuman())
// 	// 			})
// 	// 			.then((unsub) => {
// 	// 				unsubscribe = unsub
// 	// 			})
// 	// 			.catch(console.error)

// 	// 	return () => unsubscribe && unsubscribe()

// 	// }, [api, accountSelected])

// 	return accountSelected ? (
// 		<div style={{ fontSize: '8px', lineHeight: '10px', marginRight: '10px', marginLeft: '10px', marginTop: '2px' }}>
// 			{zero}
// 			<br />
// 			{play} PLAY
// 			<br />
// 			{game} GAME
// 			{/*<br/>{zeur} zDOT*/}
// 		</div>
// 	) : null
// }

const AccountSelector = (props) => {
	const { api, keyring } = useSubstrate()

	return api && keyring && keyring.getPairs && api.query ? <AccountComponent {...props} /> : null
}
export default AccountSelector
