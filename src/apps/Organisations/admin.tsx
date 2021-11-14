import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useWallet } from '../../context/Wallet'
import { Typography, Container, Paper, styled } from '../../components'
import { useApiProvider } from '@substra-hooks/core'

// TODO:
// - Drop item to your members

const Dashboard = (props) => {
	const apiProvider = useApiProvider()
	const { address, allowConnect } = useWallet()
	const { id } = useParams()

	const [name, setName] = useState('')
	const [bodies, setBodies] = useState(0)
	const [campaigns, setCampaigns] = useState(0)
	const [proposals, setProposals] = useState(0)

	useEffect(() => {
		if (!apiProvider) return
		let unsubscribe = null

		if (address && allowConnect) {
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
	}, [apiProvider, address, allowConnect])

	useEffect(() => {
		if (!apiProvider) return
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
				DAO Admin
			</Typography>
			<h2>DAOs: {bodies}</h2>
			<h2>Campaigns: {campaigns}</h2>
			<h2>Proposals: {proposals}</h2>
		</React.Fragment>
	)
}

export default function Dapp(props) {
	const apiProvider = useApiProvider()
	return apiProvider ? <Dashboard {...props} /> : null
}
