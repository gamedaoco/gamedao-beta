import React, { useEffect, useState } from 'react'
import { useWallet } from '../context/Wallet'
import { useIdentity } from 'src/hooks/useIdentity'
import { useCrowdfunding } from 'src/hooks/useCrowdfunding'
import { useApiProvider } from '@substra-hooks/core'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'

const Dashboard = (props) => {
	const apiProvider = useApiProvider()
	const { address } = useWallet()
	const [name, setName] = useState('')
	const [proposals, setProposals] = useState(null)
	const identity = useIdentity(address)
	const { campaignsCount } = useCrowdfunding()
	const { nonce } = useGameDaoControl()

	useEffect(() => {
		setName(identity?.toHuman()?.info?.display?.Raw ?? '')
	}, [identity])

	useEffect(() => {
		if (!apiProvider) return
		let unsubscribe = null

		apiProvider
			.queryMulti([apiProvider.query.gameDaoGovernance.nonce], ([proposals]) => {
				setProposals((proposals as any).toNumber())
			})
			.then((unsub) => {
				unsubscribe = unsub
			})
			.catch(console.error)

		return () => unsubscribe && unsubscribe()
	}, [apiProvider, address])

	return (
		<>
			<h1>Hello {name ?? 'Loading...'}</h1>
			<h2>DAOs: {nonce ?? 'Loading...'}</h2>
			<h2>Campaigns: {campaignsCount ?? 'Loading...'}</h2>
			<h2>Proposals: {proposals ?? 'Loading...'}</h2>
		</>
	)
}

export default function Dapp(props) {
	const apiProvider = useApiProvider()
	return apiProvider ? <Dashboard {...props} /> : null
}
