import { web3FromSource } from '@polkadot/extension-dapp'
import { useSubstrate } from '../../substrate-lib'
import { useWallet } from 'src/context/Wallet'

export * from './data'

export const getFromAcct = async ({ accountPair }) => {
	const { api } = useSubstrate()
	// TODO:
	// const { accountPair } = useWallet()
	const {
		address,
		meta: { source, isInjected },
	} = accountPair
	let fromAcct
	if (isInjected) {
		const injected = await web3FromSource(source)
		fromAcct = address
		api.setSigner(injected.signer)
	} else {
		fromAcct = accountPair
	}
	return fromAcct
}
