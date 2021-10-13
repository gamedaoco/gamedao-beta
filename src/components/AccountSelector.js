import React, { useState, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { Button, Dropdown } from 'semantic-ui-react'

import { useSubstrate } from '../substrate-lib'

function Main(props) {
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

	const initialAddress = keyringOptions.length > 0 ? keyringOptions[0].value : ''

	// Set the initial address
	useEffect(() => {
		setAccountAddress(initialAddress)
		setAccountSelected(initialAddress)
	}, [setAccountAddress, initialAddress])

	const onChange = (address) => {
		// Update state with new account address
		setAccountAddress(address)
		setAccountSelected(address)
	}

	return (
		<>
			{!accountSelected ? (
				<span>
					Add your account with the{' '}
					<a target="_blank" rel="noopener noreferrer" href="https://github.com/polkadot-js/extension">
						Polkadot JS Extension
					</a>
				</span>
			) : null}
			<CopyToClipboard text={accountSelected}>
				<Button basic circular size="large" icon="user" color={accountSelected ? 'green' : 'red'} />
			</CopyToClipboard>
			<Dropdown
				floating
				search
				selection
				clearable
				placeholder="Select an account"
				options={keyringOptions}
				onChange={(_, dropdown) => {
					onChange(dropdown.value)
				}}
				value={accountSelected}
			/>
			<BalanceAnnotation accountSelected={accountSelected} />
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
		<div style={{ fontSize: '10px', lineHeight: '10px', marginLeft: '10px' }}>
			{zero}
			<br />
			{play} PLAY
			<br />
			{game} GAME
			{/*<br/>{zeur} zDOT*/}
		</div>
	) : null
}

export default function AccountSelector(props) {
	const { api, keyring } = useSubstrate()
	return keyring.getPairs && api.query ? <Main {...props} /> : null
}
