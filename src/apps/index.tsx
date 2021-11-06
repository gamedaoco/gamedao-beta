import React, { useEffect, useState } from 'react'
import { useSubstrate } from '../substrate-lib'
import { useWallet } from '../context/Wallet'

const Dashboard = (props) => {
	const { api } = useSubstrate()
	const { address, allowConnect } = useWallet()

	const [name, setName] = useState('')
	const [bodies, setBodies] = useState(0)
	const [campaigns, setCampaigns] = useState(0)
	const [proposals, setProposals] = useState(0)

	useEffect(() => {
		if (!api) return
		console.log('🚀 ~ file: index.tsx ~ line 18 ~ useEffect ~ api', api?.query)
		let unsubscribe = null

		if (address && allowConnect)
			api.queryMulti([[api.query.identity.identityOf, address]], ([identity]) => setName(identity.toHuman()?.info.display.Raw ?? ''))
				.then((unsub) => (unsubscribe = unsub))
				.catch(console.error)
		else setName('x')

		return () => unsubscribe && unsubscribe()
	}, [api, address, allowConnect])

	useEffect(() => {
		if (!api) return
		let unsubscribe = null

		api.queryMulti(
			[api.query.gameDaoControl.nonce, api.query.gameDaoCrowdfunding.nonce, api.query.gameDaoGovernance.nonce],
			([bodies, campaigns, proposals]) => {
				setBodies(bodies.toNumber())
				setCampaigns(campaigns.toNumber())
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
			<h1>Hello {name}</h1>
			<h2>DAOs: {bodies}</h2>
			<h2>Campaigns: {campaigns}</h2>
			<h2>Proposals: {proposals}</h2>
		</>
	)
}

export default function Dapp(props) {
	const { apiState } = useSubstrate()
	console.log('apiState', apiState)
	return apiState === 'READY' ? <Dashboard {...props} /> : null
}
