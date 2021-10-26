import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSubstrate } from '../substrate-lib'

export type WalletState = {
	allowConnect: boolean
	setAllowConnect: Function
	accountPair: object
	setAccountPair: Function
	address: string
	setAccountAddress: Function
	connected: boolean
}

const INITIAL_STATE: WalletState = {
	allowConnect: false,
	setAllowConnect: () => {},
	accountPair: null,
	setAccountPair: () => {},
	address: '',
	setAccountAddress: () => {},
	connected: false,
}

const WalletContext = createContext<WalletState>(INITIAL_STATE)
const useWallet = () => useContext(WalletContext)

const WalletProvider = ({ children }) => {

	const { api, keyring } = useSubstrate()
	const [ state, setState ] = useState<WalletState>()
	const [ accountAddress, setAccountAddress ] = useState('')
	const [ allowConnect, setAllowConnect ] = useState(false)
	const [ accountPair, setAccountPair ] = useState(null)

	useEffect(()=>{
		setState(INITIAL_STATE)
	},[setState])

	// useEffect(()=>{
	// 	if(!api) return
	// 	if(!allowConnect) return
	// 	if(!keyring) return
	// },[api, allowConnect, keyring])

	useEffect(()=>{
		if(!accountAddress) return
	},[accountAddress])

	const handleSetAccountPair = accountPair => setAccountPair(accountPair)
	const handleSetAccountAddress = address => setAccountAddress(address)
	const handleSetAllowConnect = arg => setAllowConnect(arg)

	return (
		<WalletContext.Provider value={{
			...state,
			allowConnect: allowConnect,
			setAllowConnect: handleSetAllowConnect,
			address: accountAddress,
			setAccountAddress: handleSetAccountAddress,
			accountPair: accountPair,
			setAccountPair: handleSetAccountPair,
		}}>
			{children}
		</WalletContext.Provider>
	)

}

export { WalletContext, WalletProvider, useWallet }
