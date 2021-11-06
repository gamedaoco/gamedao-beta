import { createContext, useContext, useState } from 'react'

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
	const [state, setState] = useState<WalletState>(INITIAL_STATE)
	const handleSetAccountPair = (accountPair) => setState({ ...state, accountPair })
	const handleSetAccountAddress = (address) => setState({ ...state, address })
	const handleSetAllowConnect = (allowConnect) => setState({ ...state, allowConnect })

	return (
		<WalletContext.Provider
			value={{
				...state,
				setAllowConnect: handleSetAllowConnect,
				setAccountAddress: handleSetAccountAddress,
				setAccountPair: handleSetAccountPair,
			}}
		>
			{children}
		</WalletContext.Provider>
	)
}

export { WalletContext, WalletProvider, useWallet }
