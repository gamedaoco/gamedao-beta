import React from 'react'
import { Box, Paper, Stack, Typography } from 'src/components'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { ProposalItem } from './ProposalItem'

export function ProposalList({ blockNumber }) {
	const { proposals } = useGameDaoGovernance()

	return proposals ? (
		<Paper>
			<Box display="flex" padding={4}>
				<Stack width={'100%'} spacing={5}>
					<Typography variant="h6">Open votings</Typography>
					<Box>
						{Object.keys(proposals).map((proposalId: string, i: number, arr: any) => (
							<ProposalItem
								blockNumber={blockNumber}
								proposal={proposals[proposalId]}
								showDivider={i + 1 < arr.length}
								key={`proposal_${proposalId}`}
							/>
						))}
					</Box>
				</Stack>
			</Box>
		</Paper>
	) : null
}
