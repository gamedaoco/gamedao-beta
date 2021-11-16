import { web3FromSource } from '@polkadot/extension-dapp'
import { useApiProvider } from '@substra-hooks/core'
import { useWallet } from 'src/context/Wallet'

export * from './data'

export const getFromAcct = async () => {
	const apiProvider = useApiProvider()
	const { account } = useWallet()
	const {
		address,
		meta: { source, isInjected },
	} = account as any
	let fromAcct
	if (isInjected) {
		const injected = await web3FromSource(source)
		fromAcct = address
		apiProvider.setSigner(injected.signer)
	} else {
		fromAcct = account
	}
	return fromAcct
}
