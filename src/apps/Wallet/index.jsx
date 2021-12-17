import React, { useEffect, useState } from 'react'

import { useWallet } from 'src/context/Wallet'

import { Container, Button, Typography, Box, Paper } from 'src/components'
import { useApiProvider } from '@substra-hooks/core'

const Component = (props) => {
	const { address } = useWallet()

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
		<Container maxWidth="lg">

			<Typography variant="h3">Wallet</Typography>

			<Box sx={{display: 'flex', justifyContent: 'space-between' }} >
				<Box>{ !address &&
					<Paper elevation={10} sx={{
							my: 2,
							p: 4,
					}}>
						<Typography variant="h3" sx={{
							mb: 2,
							background: "-webkit-linear-gradient(45deg, #ff00cc 30%, #ff9900 90%)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							fontWeight:800,
							a: { textDecoration: 'none' }
						}}>
							To use GameDAO DApp, the <a href="#">Polkadot Extension</a> is required.
							Please connect your wallet or install the Extension.
						</Typography>
						<Box sx={{display: 'flex', justifyContent: 'end' }} >
							<a href="https://docs.gamedao.co/" target="_blank">
								<Button size="small" sx={{mr:2}}>
									Learn More
								</Button>
							</a>
							<a href="https://polkadot.js.org/extension/" target="_blank">
								<Button size="small" sx={{borderRadius: '100px'}} variant="outlined">
									Download
								</Button>
							</a>
						</Box>
					</Paper>
				}</Box>
				<Box>

				</Box>
			</Box>

			<br />

{/*			{showCreateMode && <CreateDAO />}
			{!showCreateMode && dataState && <ItemList data={dataState} />}
*/}

		</Container>
	)
}

export default function Dapp(props) {
	const apiProvider = useApiProvider()

	return apiProvider ? <Component /> : null
}

//
//
//
