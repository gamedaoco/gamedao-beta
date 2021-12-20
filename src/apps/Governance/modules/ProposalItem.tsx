import React from 'react'
import { Box, Button, Stack, Typography } from 'src/components'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { blockTime } from 'src/apps/lib/data'

import moment from 'moment'
import { Divider, LinearProgress } from '@mui/material'
import { useNavigate } from 'react-router'
import { normalizeNumber } from 'src/utils/normalizeNumber'

export function ProposalItem({ blockNumber, proposal, showDivider }) {
	// Get state
	const { metadata, proposalSimpleVotes } = useGameDaoGovernance()
	const { bodies } = useGameDaoControl()
	const navigate = useNavigate()

	// Proposal
	const proposalId = proposal.proposal_id
	const proposalMeta = metadata?.[proposalId]

	const expires = (normalizeNumber(proposal.expiry) - blockNumber) * blockTime

	// Vote
	const [humanizedYesCount, humanizedNoCount] = proposalSimpleVotes?.[proposalId] ?? [0, 0]
	const [yesCount, noCount] = [
		normalizeNumber(humanizedYesCount),
		normalizeNumber(humanizedNoCount),
	]
	const voteCount = yesCount + noCount

	// Orgianization
	const bodyId = proposal.context_id
	const body = bodies?.[bodyId]

	// Helper functions
	const calculatePercentage = (count) => (voteCount === 0 ? 0 : (count * 100) / voteCount)

	return proposalMeta && body ? (
		<>
			<Box display="flex">
				<Stack width="100%" display="flex" flexDirection="row" justifyItems="center">
					<Box flexBasis="45%">
						<Typography variant="h6">{proposalMeta.title}</Typography>
						<Typography variant="body1">
							{body.name},{' '}
							{expires < 0
								? 'Expired'
								: `Expires ${moment()
										.add(expires, 'seconds')
										.format('MMMM D, YYYY')}`}
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
						<Button onClick={() => navigate(`/app/governance/${proposalId}`)}>
							Vote
						</Button>
					</Box>
				</Stack>
			</Box>
			{showDivider ? <Divider sx={{ margin: '2rem 0' }} /> : null}
		</>
	) : null
}
