import { createContext, useContext, useState } from 'react'

export type WalletState = {
	allowConnect: boolean
	accountPair: object
	address: string
	connected: boolean
	updateWalletState: Function
}

const INITIAL_STATE: WalletState = {
	allowConnect: false,
	accountPair: null,
	address: '',
	connected: false,
	updateWalletState: () => {},
}

const WalletContext = createContext<WalletState>(INITIAL_STATE)
const useWallet = () => useContext(WalletContext)

const WalletProvider = ({ children }) => {
	const [state, setState] = useState<WalletState>(INITIAL_STATE)

	const handleUpdateWalletState = (stateData) => {
		setState({ ...state, ...stateData })
	}

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
