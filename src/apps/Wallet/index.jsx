import React, { useEffect, useState } from 'react'
import { useSubstrate } from '../../substrate-lib'
import { useWallet } from 'src/context/Wallet'

import { Button, Typography, Box, Stack } from 'src/components'

const Component = (props) => {

	// const { address, accountPair } = useWallet()
	// const { api } = useSubstrate()

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
				<Typography component="h1" variant="h3">Wallet</Typography>
				<Box>
				</Box>
			</Stack>
		</>
	)
}

export default function Dapp(props) {
	const { api } = useSubstrate()

	return api ? <Component /> : null
}

//
//
//
