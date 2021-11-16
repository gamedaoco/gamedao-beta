import { ApiPromise } from '@polkadot/api'
import { useApiProvider } from '@substra-hooks/core'
import { useState, useEffect } from 'react'
import { useIsMountedRef } from './useIsMountedRef'
import { to } from 'await-to-js'
import { createErrorNotification } from 'src/utils/notification'

type IdentityState = {
	identities: Object
}

const INITIAL_STATE: IdentityState = {
	identities: {},
}

async function queryAccountIdentity(apiProvider: ApiPromise, address: string): Promise<any> {
	const context = apiProvider.query.assets.account
	if (!context) return INITIAL_STATE

	const [error, data] = await to(apiProvider.query.identity.identityOf(address))

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the account identity')
		return INITIAL_STATE
	}

	return data
}

// Get Account Identity
export const useIdentity = (address: string) => {
	const [identityState, setIdentityState] = useState<IdentityState>(INITIAL_STATE)

	const isMountedRef = useIsMountedRef()
	const apiProvider = useApiProvider()

	useEffect(() => {
		if (apiProvider && address && !(identityState ?? {})?.identities?.[address]) {
			queryAccountIdentity(apiProvider, address).then((identity) => {
				if (isMountedRef) {
					setIdentityState({ ...identityState, identities: { ...identityState.identities, [address]: identity } })
				}
			})
		}
	}, [address, apiProvider, isMountedRef])

	return (identityState ?? {})?.identities?.[address]
}
