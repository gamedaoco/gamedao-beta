export * from 'data'


export const getFromAcct = async ({ api, accountPair, web3FromSource
}) => {
	const {
		address,
		meta: { source, isInjected }
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
