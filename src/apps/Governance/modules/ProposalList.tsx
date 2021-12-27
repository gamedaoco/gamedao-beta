import React from 'react'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { alpha, useTheme } from '@mui/material/styles'
import { Box, Paper, Stack, Typography } from 'src/components'
import { ProposalItem } from './ProposalItem'

export function ProposalList() {

	const theme = useTheme()
	const bgPlain = { backgroundColor: theme.palette.grey[500_16] }
	const { proposals } = useGameDaoGovernance()

	return proposals ? (
		<Paper sx={{...bgPlain}}>
			<Box display="flex" padding={4}>
				<Stack width={'100%'} spacing={5}>
					<Typography variant="h6">Open votings</Typography>
					<Box>
						{Object.keys(proposals).map((proposalId: string, i: number, arr: any) => (
							<ProposalItem
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
export default ProposalList
