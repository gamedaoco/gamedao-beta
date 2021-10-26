import React, { useEffect, useState } from 'react'
import { useSubstrate } from '../substrate-lib'
import { useWallet } from '../context/Wallet'
import { Loader } from '../components/Loader'

const Dashboard = (props) => {

	const { api } = useSubstrate()
	const { address } = useWallet()

	const [ name, setName ] = useState('')
	const [ bodies, setBodies ] = useState(0)
	const [ campaigns, setCampaigns ] = useState(0)
	const [ proposals, setProposals ] = useState(0)
	const [ tangram, setTangram ] = useState(0)

	useEffect(() => {
		let unsubscribe = null

		api.queryMulti(
			[
				[api.query.system.account,address],
				api.query.gameDaoControl.nonce,
				api.query.gameDaoCrowdfunding.nonce,
				api.query.gameDaoGovernance.nonce,
				api.query.gameDaoTangram.nextTangramId
			],
			([name, bodies, campaigns, proposals, creatures]) => {
				setName(name.meta.name.toUpperCase())
				setBodies(bodies.toNumber())
				setCampaigns(campaigns.toNumber())
				setProposals(proposals.toNumber())
				setTangram(tangram.toNumber())
			}
		)
			.then((unsub) => {
				unsubscribe = unsub
			})
			.catch(console.error)

		return () => unsubscribe && unsubscribe()
	}, [api])

	return (
		<>
			<h1>Hello {name}</h1>
			<h2>DAOs: {bodies}</h2>
			<h2>Campaigns: {campaigns}</h2>
			<h2>Proposals: {proposals}</h2>
			<h2>Tangram: {tangram}</h2>
		</>
	)
}

export default function Dapp(props) {
	const { accountPair } = props
	const { api } = useSubstrate()

	return api && api.query.gameDaoCrowdfunding ? ( // && accountPair
		<Dashboard {...props} />
	) : null
}
