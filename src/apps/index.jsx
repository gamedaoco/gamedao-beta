/*
 (c) 2010-2020 GAMEDAO.CO, GAMEDAO COOPERATIVE.
*/

import React, { useEffect, useState, lazy, Suspense } from 'react'
import { useSubstrate } from '../substrate-lib'
import { Loader } from '../components/Loader'

const Dashboard = (props) => {
	const { accountPair } = props
	const { api } = useSubstrate()

	const [bodies, setBodies] = useState(0)
	const [campaigns, setCampaigns] = useState(0)
	const [proposals, setProposals] = useState(0)
	const [tangram, setTangram] = useState(0)

	useEffect(() => {
		let unsubscribe = null

		api.queryMulti(
			[
				api.query.gameDaoControl.nonce,
				api.query.gameDaoCrowdfunding.nonce,
				api.query.gameDaoGovernance.nonce,
				// api.query.gameDaoTangram.nextTangramId
			],
			([bodies, campaigns, proposals, creatures]) => {
				setBodies(bodies.toNumber())
				setCampaigns(campaigns.toNumber())
				setProposals(proposals.toNumber())
				// setTangram(tangram.toNumber())
			}
		)
			.then((unsub) => {
				unsubscribe = unsub
			})
			.catch(console.error)

		return () => unsubscribe && unsubscribe()
	}, [api])

	return (
		<Suspense fallback={<Loader text="Loading..."></Loader>}>
			<h1>Hello.</h1>
		</Suspense>
	)
}

export default function Dapp(props) {
	const { accountPair } = props
	const { api } = useSubstrate()

	return api && api.query.gameDaoCrowdfunding ? ( // && accountPair
		<Dashboard {...props} />
	) : null
}
