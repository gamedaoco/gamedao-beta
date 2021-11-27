import { useApiProvider } from '@substra-hooks/core'
import React, { useEffect, useState } from 'react'
import { Box, Divider, Paper, Stack, Typography } from 'src/components'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { ProposalItem } from './ProposalItem'

export function ProposalList() {
	const apiProvider = useApiProvider()
	const { proposals } = useGameDaoGovernance()

	const [blockNumber, setBlockNumber] = useState(0)

	useEffect(() => {
		if (!apiProvider) return
		let unsubscribeAll

		apiProvider.derive.chain
			.bestNumberFinalized((number) => {
				setBlockNumber(number.toNumber())
			})
			.then((unsub) => {
				unsubscribeAll = unsub
			})
			.catch(console.error)

		return () => unsubscribeAll && unsubscribeAll()
	}, [apiProvider])

	return proposals ? (
		<Paper>
			<Box display="flex" padding={4}>
				<Stack width={'100%'} spacing={5}>
					<Typography variant="h6">Open votings</Typography>
					<Box>
						{Object.keys(proposals).map((proposalId: string, i: number, arr: any) => (
							<Box>
								<ProposalItem
									blockNumber={blockNumber}
									proposal={proposals[proposalId]}
								/>
								{i + 1 < arr.length ? <Divider sx={{ margin: '2rem 0' }} /> : null}
							</Box>
						))}
					</Box>
				</Stack>
			</Box>
		</Paper>
	) : null
}
