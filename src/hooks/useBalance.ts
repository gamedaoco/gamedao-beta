import { ApiPromise } from '@polkadot/api'
import { useApiProvider } from '@substra-hooks/core'
import { useState, useEffect } from 'react'
import { useWallet } from 'src/context/Wallet'
import { to } from 'await-to-js'
import { createErrorNotification } from 'src/utils/notification'

export type BalanceState = {
	balanceZero: String
	balancePlay: String
	balanceGame: String
}

const INITIAL_STATE: BalanceState = {
	balanceZero: null,
	balancePlay: null,
	balanceGame: null,
}

async function queryAccountBalance(
	apiProvider: ApiPromise,
	address: string
): Promise<BalanceState> {
	const context = apiProvider.query.assets.account
	if (!context) return INITIAL_STATE

	const [error, data] = await to(
		apiProvider.queryMulti([
			[apiProvider.query.system.account, address],
			[context, [Number(0), address]],
			[context, [Number(1), address]],
		])
	)

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the account balance')
		return INITIAL_STATE
	}

	if (data.length !== 3) return INITIAL_STATE

	const [_zero, _play, _game] = data as any

	return {
		balanceZero: _zero?.data?.free?.toHuman() ?? '0',
		balancePlay: _play?.toHuman()?.balance ?? '0',
		balanceGame: _game?.toHuman()?.balance ?? '0',
	}
}

// Get Account Balance for Zero, Play and game
export const useBalance = () => {
	const [balanceState, setBalanceState] = useState<BalanceState>(INITIAL_STATE)
	const [addressState, setAddressState] = useState<string>(null)
	const apiProvider = useApiProvider()
	const { address } = useWallet()

	useEffect(() => {
		if (apiProvider && address && address !== addressState) {
			queryAccountBalance(apiProvider, address).then((state) => {
				setBalanceState(state)
				setAddressState(address)
			})
		}
	}, [address, apiProvider])

	console.log('🚀 ~ file: useBalance.ts ~ line 70 ~ useBalance ~ balanceState', balanceState)

	return balanceState
}
