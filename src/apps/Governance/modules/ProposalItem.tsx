import React, { useEffect, useState } from 'react'
import { Box, Button, Paper, Stack, Typography } from 'src/components'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { blockTime } from 'src/apps/lib/data'

import moment from 'moment'
import { LinearProgress } from '@mui/material'

export function ProposalItem({ blockNumber, proposal }) {
	// Get store data
	const { metadata, proposalSimpleVotes } = useGameDaoGovernance()
	const { bodies } = useGameDaoControl()

	// Proposal data
	const proposalId = proposal.proposal_id
	const proposalMeta = metadata?.[proposalId]
	const [yesCount, noCount] = [20, 50] // proposalSimpleVotes?.[proposalId] ?? [0, 0]
	const expires = (proposal.expiry.replace(/,|\./g, '') - blockNumber) * blockTime
	const voteCount = yesCount + noCount

	const calculatePercentage = (count) => (count * 100) / voteCount

	// Orgianization data
	const bodyId = proposal.context_id
	const body = bodies?.[bodyId]

	console.log('🚀 ~ file: ProposalItem.tsx ~ line 24 ~ ProposalItem ~ body', body)
	console.log('🚀 ~ file: ProposalItem.tsx ~ line 25 ~ ProposalItem ~ proposal', proposal)

	return proposalMeta && body ? (
		<Box display="flex">
			<Stack width="100%" display="flex" flexDirection="row" justifyItems="center">
				<Box flexBasis="45%">
					<Typography variant="h6">{proposalMeta.title}</Typography>
					<Typography variant="body1">
						{body.name},{' '}
						{expires < 0
							? 'Expired'
							: `Expires ${moment().add(expires, 'seconds').format('MMMM D, YYYY')}`}
					</Typography>
				</Box>
				<Box display="flex" flexBasis="30%" alignItems="center">
					<Box display="flex" justifyContent="center" flexDirection="column">
						<Typography>No</Typography>
						<Typography>{Math.round(calculatePercentage(noCount))}%</Typography>
					</Box>
					<LinearProgress
						sx={{ width: '100%', margin: '0 1rem' }}
						variant="determinate"
						value={calculatePercentage(noCount)}
					/>
					<Box display="flex" justifyContent="center" flexDirection="column">
						<Typography>Yes</Typography>
						<Typography>
							{Math.round(calculatePercentage(yesCount))}%{}
						</Typography>
					</Box>
				</Box>
				<Box marginLeft="auto">
					<Button>Vote</Button>
				</Box>
			</Stack>
		</Box>
	) : null
}
