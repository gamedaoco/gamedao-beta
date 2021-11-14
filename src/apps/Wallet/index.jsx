import React, { useEffect, useState } from 'react'

import { useWallet } from 'src/context/Wallet'

import { Button, Typography, Box, Stack } from 'src/components'
import { useApiProvider } from '@substra-hooks/core'

const Component = (props) => {
	// const { address, accountPair } = useWallet()

	// const [bodies, setBodies] = useState(0)
	// const [campaigns, setCampaigns] = useState(0)
	// const [proposals, setProposals] = useState(0)
	// const [tangram, setTangram] = useState(0)

	// useEffect(() => {
	// 	let unsubscribe = null

	// 	api.queryMulti(
	// 		[
	// 			api.query.gameDaoControl.nonce,
	// 			api.query.gameDaoCrowdfunding.nonce,
	// 			api.query.gameDaoGovernance.nonce,
	// 			api.query.gameDaoTangram.nextTangramId
	// 		],
	// 		([bodies, campaigns, proposals, creatures]) => {
	// 			setBodies(bodies.toNumber())
	// 			setCampaigns(campaigns.toNumber())
	// 			setProposals(proposals.toNumber())
	// 			setTangram(tangram.toNumber())
	// 		}
	// 	)
	// 		.then((unsub) => {
	// 			unsubscribe = unsub
	// 		})
	// 		.catch(console.error)

	// 	return () => unsubscribe && unsubscribe()
	// }, [api])

	return (
		<>
			<Stack direction="row" justifyContent="space-between" alignItems="center" spacing={12}>
				<Typography component="h1" variant="h3">
					Wallet
				</Typography>
				<Box></Box>
			</Stack>
		</>
	)
}

export default function Dapp(props) {
	const apiProvider = useApiProvider()

	return apiProvider ? <Component /> : null
}

//
//
//
