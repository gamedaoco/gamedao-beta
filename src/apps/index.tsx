import React, { useEffect, useState } from 'react'
import { useWallet } from '../context/Wallet'
import { useIdentity } from 'src/hooks/useIdentity'
import { useCrowdfunding } from 'src/hooks/useCrowdfunding'
import { useApiProvider } from '@substra-hooks/core'

const Dashboard = (props) => {
	const apiProvider = useApiProvider()
	const { address } = useWallet()
	const [name, setName] = useState('')
	const [bodies, setBodies] = useState(null)
	const [proposals, setProposals] = useState(null)
	const identity = useIdentity(address)
	const { campaignsCount } = useCrowdfunding()

	useEffect(() => {
		setName(identity?.toHuman()?.info?.display?.Raw ?? '')
	}, [identity])

	useEffect(() => {
		if (!apiProvider) return
		let unsubscribe = null

		apiProvider
			.queryMulti(
				[apiProvider.query.gameDaoControl.nonce, apiProvider.query.gameDaoGovernance.nonce],
				([bodies, proposals]) => {
					setBodies((bodies as any).toNumber())
					setProposals((proposals as any).toNumber())
				}
			)
			.then((unsub) => {
				unsubscribe = unsub
			})
			.catch(console.error)

		return () => unsubscribe && unsubscribe()
	}, [apiProvider, address])

	return (
		<>
			<h1>Hello {name ?? 'Loading...'}</h1>
			<h2>DAOs: {bodies ?? 'Loading...'}</h2>
			<h2>Campaigns: {campaignsCount ?? 'Loading...'}</h2>
			<h2>Proposals: {proposals ?? 'Loading...'}</h2>
		</>
	)
}

export default function Dapp(props) {
	const apiProvider = useApiProvider()
	return apiProvider ? <Dashboard {...props} /> : null
}
