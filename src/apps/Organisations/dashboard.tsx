import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useWallet } from '../../context/Wallet'
import { Button, Typography, Box, Container, Paper, styled } from '../../components'
import { useApiProvider } from '@substra-hooks/core'

const Dashboard = (props) => {
	const apiProvider = useApiProvider()
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
			apiProvider
				.queryMulti([[apiProvider.query.identity.identityOf, address]], ([identity]) =>
					setName((identity.toHuman() as any)?.info.display.Raw ?? '')
				)
				.then((unsub) => (unsubscribe = unsub))
				.catch(console.error)
		} else {
			setName('')
		}

		return () => unsubscribe && unsubscribe()
	}, [apiProvider, address])

	useEffect(() => {
		let unsubscribe = null

		apiProvider
			.queryMulti(
				[
					apiProvider.query.gameDaoControl.nonce,
					apiProvider.query.gameDaoCrowdfunding.nonce,
					apiProvider.query.gameDaoGovernance.nonce,
				],
				([bodies, campaigns, proposals]) => {
					setBodies((bodies as any).toNumber())
					setCampaigns((campaigns as any).toNumber())
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
		<React.Fragment>
			<Typography component="h1" variant="h3">
				DAO Dashboard
			</Typography>
			<h2>DAOs: {bodies}</h2>
			<h2>Campaigns: {campaigns}</h2>
			<h2>Proposals: {proposals}</h2>
		</React.Fragment>
	)
}

export default function Dapp(props) {
	const apiProvider = useApiProvider()
	const { allowConnect } = useWallet()
	return allowConnect && apiProvider ? <Dashboard {...props} /> : null
}
