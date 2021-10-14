import { web3FromSource } from '@polkadot/extension-dapp'
import { useSubstrate } from '../../substrate-lib'

export * from './data'

export const getFromAcct = async ({ accountPair }) => {
	const { api } = useSubstrate()

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
