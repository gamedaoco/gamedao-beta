import React, { useEffect, useState } from 'react'
import { useWallet } from '../context/Wallet'
import { useIdentity } from 'src/hooks/useIdentity'
import { useCrowdfunding } from 'src/hooks/useCrowdfunding'
import { useApiProvider } from '@substra-hooks/core'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { Button } from 'src/components'

const Dashboard = (props) => {
	const apiProvider = useApiProvider()
	const { address, signer } = useWallet()
	const [name, setName] = useState('')
	const identity = useIdentity(address)
	const { campaignsCount } = useCrowdfunding()
	const { nonce } = useGameDaoControl()
	const { proposalsCount } = useGameDaoGovernance()

	useEffect(() => {
		setName(identity?.toHuman()?.info?.display?.Raw ?? '')
	}, [identity])

	return (
		<>
			<h1>Hello {name ?? 'Loading...'}</h1>
			<h2>DAOs: {nonce ?? 'Loading...'}</h2>
			<h2>Campaigns: {campaignsCount ?? 'Loading...'}</h2>
			<h2>Proposals: {proposalsCount ?? 'Loading...'}</h2>
			<Button
				onClick={() => {
					const tx = apiProvider.tx.balances.transfer(
						'3RaiU4xRF24Q2qwc3H1TWYXrh11po34WoSaQAADszHshRbYJ',
						1
					)
					tx.signAndSend(address, { signer }, ({ status }) => {
						if (status.isInBlock) {
							console.log(`Completed at block hash #${status.asInBlock.toString()}`)
						} else {
							console.log(`Current status: ${status.type}`)
						}
					}).catch((error: any) => {
						console.log(':( transaction failed', error)
					})
				}}
			>
				Send MY Money To Andre
			</Button>
		</>
	)
}

export default function Dapp(props) {
	const apiProvider = useApiProvider()
	return apiProvider ? <Dashboard {...props} /> : null
}
