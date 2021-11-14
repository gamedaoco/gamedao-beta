import { web3FromSource } from '@polkadot/extension-dapp'
import { useApiProvider } from '@substra-hooks/core'

export * from './data'

export const getFromAcct = async ({ accountPair }) => {
	const apiProvider = useApiProvider()
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
		apiProvider.setSigner(injected.signer)
	} else {
		fromAcct = accountPair
	}
	return fromAcct
}
