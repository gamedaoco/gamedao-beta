import { createContext, useContext, useEffect, useState } from 'react'
import { useStore } from './Store'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { web3FromSource } from '@polkadot/extension-dapp'
import { Signer } from '@polkadot/types/types'

export type WalletState = {
	allowConnect: boolean
	address: string
	account: InjectedAccountWithMeta
	connected: boolean
	signer: Signer
	updateWalletState: Function
}

const INITIAL_STATE: WalletState = {
	allowConnect: false,
	address: null,
	account: null,
	connected: false,
	signer: null,
	updateWalletState: () => {},
}

const WalletContext = createContext<WalletState>(INITIAL_STATE)
const useWallet = () => useContext<WalletState>(WalletContext)

const WalletProvider = ({ children }) => {
	const [state, setState] = useState<WalletState>(INITIAL_STATE)
	const { allowConnection } = useStore()

	const handleUpdateWalletState = (stateData) => {
		setState({ ...state, ...stateData })
	}

	useEffect(() => {
		setState({ ...state, allowConnect: allowConnection })
	}, [allowConnection])

	useEffect(() => {
		if (state?.account?.meta?.source) {
			;(async () => {
				setState({
					...state,
					signer: (await web3FromSource(state.account.meta.source))?.signer,
				})
			})()
		} else {
			setState({ ...state, signer: null })
		}
	}, [state.account])

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
