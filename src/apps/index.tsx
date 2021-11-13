import React, { useEffect, useState } from 'react'
import { useSubstrate } from '../substrate-lib'
import { useWallet } from '../context/Wallet'
import { useIdentity } from 'src/hooks/useIdentity'
import { useCrowdfunding } from 'src/hooks/useCrowdfunding'

const Dashboard = (props) => {
	const { api } = useSubstrate()
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
		if (!api) return
		let unsubscribe = null

		api.queryMulti(
			[api.query.gameDaoControl.nonce, api.query.gameDaoGovernance.nonce],
			([bodies, proposals]) => {
				setBodies(bodies.toNumber())
				setProposals(proposals.toNumber())
			}
		)
			.then((unsub) => {
				unsubscribe = unsub
			})
			.catch(console.error)

		return () => unsubscribe && unsubscribe()
	}, [api, address])

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
	const { apiState } = useSubstrate()
	console.log('apiState', apiState)
	return apiState === 'READY' ? <Dashboard {...props} /> : null
}
