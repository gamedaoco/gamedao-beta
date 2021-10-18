import React, { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { useSubstrate } from '../substrate-lib'
import Loader from '../components/Loader'
import ErrorMessage from '../components/Message'

export type WalletState = {
	allowConnect: boolean
	connected: boolean
	accountPair: object
	address: string
	setAccountPair: VoidFunction
	setAddress: VoidFunction
}

const INITIAL_STATE: WalletState = {
	allowConnect: false,
	connected: false,
	accountPair: null,
	address: '',
	setAccountPair: () => {},
	setAddress: () => {},
}

const WalletContext = createContext<WalletState>(INITIAL_STATE)
const useWalletContext = () => useContext(WalletContext)

const WalletProvider = ({ children }) => {

	const [ state, setState ] = useState<WalletState>(INITIAL_STATE)

	console.log('Wallet')

	return (
		<WalletContext.Provider value={{...state}}>
			{children}
		</WalletContext.Provider>
	)

}

export { WalletContext, WalletProvider, useWalletContext }
