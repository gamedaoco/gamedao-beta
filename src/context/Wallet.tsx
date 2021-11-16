import { createContext, useContext, useEffect, useState } from 'react'
import { useStore } from './Store'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'

export type WalletState = {
	allowConnect: boolean
	address: string
	account: InjectedAccountWithMeta
	connected: boolean
	updateWalletState: Function
}

const INITIAL_STATE: WalletState = {
	allowConnect: false,
	address: null,
	account: null,
	connected: false,
	updateWalletState: () => {},
}

const WalletContext = createContext<WalletState>(INITIAL_STATE)
const useWallet = () => useContext(WalletContext)

const WalletProvider = ({ children }) => {
	const [state, setState] = useState<WalletState>(INITIAL_STATE)
	const { allowConnection } = useStore()

	const handleUpdateWalletState = (stateData) => {
		setState({ ...state, ...stateData })
	}

	useEffect(() => {
		setState({ ...state, allowConnect: allowConnection })
	}, [allowConnection])

	return (
		<WalletContext.Provider
			value={{
				...state,
				updateWalletState: handleUpdateWalletState,
			}}
		>
			{children}
		</WalletContext.Provider>
	)
}

export { WalletContext, WalletProvider, useWallet }
