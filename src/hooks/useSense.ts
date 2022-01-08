import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { balanceStateSelector, updateBalanceAction } from 'src/redux/duck/balance.duck'

import { ApiPromise } from '@polkadot/api'
import { useApiProvider } from '@substra-hooks/core'
import { to } from 'await-to-js'
import { useWallet } from 'src/context/Wallet'
import { createErrorNotification } from 'src/utils/notification'

export type BalanceState = {
	balanceZero: String
	balancePlay: String
	balanceGame: String
	updateBalance: Function
}

const INITIAL_STATE: BalanceState = {
	balanceZero: null,
	balancePlay: null,
	balanceGame: null,
	updateBalance: () => {},
}

async function queryAccountBalance(apiProvider: ApiPromise, address: string): Promise<any> {
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
export function useBalance(): BalanceState {
	
	const [addressState, setAddressState] = useState<string>(null)
	const balanceState = useSelector(balanceStateSelector)
	const apiProvider = useApiProvider()
	const { address } = useWallet()
	const dispatch = useDispatch()

	function handleUpdateBalance() {
		queryAccountBalance(apiProvider, address).then((state) => {
			dispatch(updateBalanceAction(state))
			setAddressState(address)
		})
	}

	useEffect(() => {
		if (apiProvider && address && address !== addressState) {
			queryAccountBalance(apiProvider, address).then((state) => {
				dispatch(updateBalanceAction(state))
				setAddressState(address)
			})
		}
	}, [address, apiProvider])

	return {
		...balanceState,
		updateBalance: handleUpdateBalance,
	} as any
}
