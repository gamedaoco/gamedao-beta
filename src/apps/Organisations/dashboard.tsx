import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSubstrate } from '../../substrate-lib'
import { useWallet } from '../../context/Wallet'
import {
	Button,
	Typography,
	Box,
	Container,
	Paper,
	styled,
} from '../../components'

const Dashboard = (props) => {
	const { api } = useSubstrate()
	const { address } = useWallet()
	const { id } = useParams()

	// query all data related to the dao:
	// - treasury total / available / locked
	// - members
	// - campaigns

	const [name, setName] = useState('')
	const [bodies, setBodies] = useState(0)
	const [campaigns, setCampaigns] = useState(0)
	const [proposals, setProposals] = useState(0)

	useEffect(() => {
		let unsubscribe = null

		if (address) {
			api.queryMulti([
				[api.query.identity.identityOf, address]
			], ([identity]) => setName(identity.toHuman()?.info.display.Raw ?? ''))
				.then((unsub) => (unsubscribe = unsub))
				.catch(console.error)
		} else {
			setName('')
		}

		return () => unsubscribe && unsubscribe()
	}, [api, address])

	useEffect(() => {
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
		<React.Fragment>
			<Typography component="h1" variant="h3">DAO Dashboard</Typography>
			<h2>DAOs: {bodies}</h2>
			<h2>Campaigns: {campaigns}</h2>
			<h2>Proposals: {proposals}</h2>
		</React.Fragment>
	)
}

export default function Dapp(props) {
	const { api, apiState } = useSubstrate()
	const { allowConnect } = useWallet()
	console.log('apiState', apiState)
	return allowConnect && api && apiState === 'READY' ? <Dashboard {...props} /> : null
}
