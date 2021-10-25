import React, { useState, useEffect, useRef } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useSubstrate } from '../substrate-lib'

// import { Button, Dropdown } from 'semantic-ui-react'
import { Button, Typography, ButtonGroup, ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import LogoutIcon from '@mui/icons-material/Logout'

const AccountComponent = (props) => {
	const [open, setOpen] = React.useState(false)
	const [selectedIndex, setSelectedIndex] = useState(0)
	const anchorRef = useRef<HTMLDivElement>(null)

	const { keyring } = useSubstrate()
	const { setAccountAddress } = props
	const [accountSelected, setAccountSelected] = useState('')

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

	const onChange = (address) => {
		setAccountAddress(address)
		setAccountSelected(address)
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

	const handleDisconnect = () => {
		console.log('disconnect')
	}

	return (
		<>
			{/*
			{ !accountSelected ? (
				<span>
					Add your account with the{' '}
					<a target="_blank" rel="noopener noreferrer" href="https://github.com/polkadot-js/extension">
						Polkadot JS Extension
					</a>
				</span>
			) : null }

			<CopyToClipboard text={accountSelected}>
				<Button variant="contained" color={accountSelected ? 'success' : 'error'}>COPY</Button>
			</CopyToClipboard>
		*/}

			<ButtonGroup sx={{ flexDirection: "column" }} variant="contained" ref={anchorRef} aria-label="account-selector">

				<BalanceAnnotation accountSelected={accountSelected} />

				<IconButton size="small" aria-label="disconnect" onClick={handleDisconnect} >
					<LogoutIcon fontSize="inherit"/>
				</IconButton>

				<Typography variant="subtitle1">
					<CopyToClipboard text={accountSelected}>
						<Button color={accountSelected ? 'success' : 'error'}>
							{`${keyringOptions[selectedIndex].text||keyringOptions[selectedIndex].value.slice(0, 8)}`}
						</Button>
					</CopyToClipboard>
				</Typography>

				<IconButton
					size="small"
					aria-controls={open ? 'account-menu' : undefined}
					aria-expanded={open ? 'true' : undefined}
					aria-label="select account"
					aria-haspopup="menu"
					onClick={handleToggle}
				>
					<KeyboardArrowDownIcon fontSize="inherit"/>
				</IconButton>

			</ButtonGroup>

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
											<Typography variant="subtitle1">{option.text}</Typography>
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

function BalanceAnnotation(props) {
	const { accountSelected } = props
	const { api } = useSubstrate()

	// const [ accountBalance, setAccountBalance ] = useState(0);

	const [zero, setZERO] = useState(0)
	const [play, setPLAY] = useState(0)
	const [game, setGAME] = useState(0)
	// const [zeur, setZEUR] = useState(0)

	useEffect(() => {
		if (!accountSelected) return

		const query = async () => {
			let unsubscribe
			const context = api.query.assets.account

			api.queryMulti(
				[
					[context, [Number(0), accountSelected]],
					[context, [Number(1), accountSelected]],
					// [context, [Number(2), accountSelected]],
				],
				([_play, _game, _zeur]) => {
					setPLAY(_play.toHuman().balance)
					setGAME(_game.toHuman().balance)
					// setZEUR(_zeur.toHuman().balance)
				}
			)
				.then((unsub) => {
					unsubscribe = unsub
				})
				.catch(console.error)
			return () => unsubscribe && unsubscribe()
		}
		query()
	}, [api, accountSelected])

	useEffect(() => {
		let unsubscribe
		accountSelected &&
			api.query.system
				.account(accountSelected, (balance) => {
					setZERO(balance.data.free.toHuman())
				})
				.then((unsub) => {
					unsubscribe = unsub
				})
				.catch(console.error)

		return () => unsubscribe && unsubscribe()
	}, [api, accountSelected])

	return accountSelected ? (
		<div style={{ fontSize: '8px', lineHeight: '10px', marginRight: '10px', marginLeft: '10px', marginTop: '2px' }}>
			{zero}
			<br />
			{play} PLAY
			<br />
			{game} GAME
			{/*<br/>{zeur} zDOT*/}
		</div>
	) : null
}

const AccountSelector = (props) => {
	const { api, keyring } = useSubstrate()

	return keyring.getPairs && api.query ? <AccountComponent {...props} /> : null
}
export default AccountSelector
