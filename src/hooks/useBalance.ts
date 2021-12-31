import { ApiPromise } from '@polkadot/api'
import { useApiProvider } from '@substra-hooks/core'
import { useState, useEffect } from 'react'
import { useWallet } from 'src/context/Wallet'
import { to } from 'await-to-js'
import { createErrorNotification } from 'src/utils/notification'
import { useDispatch, useSelector } from 'react-redux'
import { balanceStateSelector, updateBalanceAction } from 'src/redux/duck/balance.duck'

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

// Get Account Balance for Zero, Play and game
export function useBalance(): BalanceState {
	const [addressState, setAddressState] = useState<string>(null)
	const balanceState = useSelector(balanceStateSelector)
	const apiProvider = useApiProvider()
	const { address } = useWallet()
	const dispatch = useDispatch()

	useEffect(() => {

		if (!apiProvider || !address) return null

		let unsubscribe = null

			apiProvider.queryMulti([
				[apiProvider.query.system.account, address],
				[apiProvider.query.assets.account, [Number(0), address]],
				[apiProvider.query.assets.account, [Number(1), address]],
			],([ zero, play, game ])=>{

				const z = zero.toHuman() as any
				const p = play.toHuman() as any
				const g = game.toHuman() as any

				dispatch(updateBalanceAction({
					balanceZero: z.data.free ?? '0',
					balancePlay: p.balance ?? '0',
					balanceGame: g.balance ?? '0',
				}))
				setAddressState(address)

			})

		return () => unsubscribe && unsubscribe()

	}, [address, apiProvider])

	return {
		...balanceState,
		// updateBalance: handleUpdateBalance,
	} as any
}
