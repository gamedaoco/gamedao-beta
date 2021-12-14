import React from 'react'
import { ProposalItem } from '../../Governance/modules/ProposalItem'
import { Box, Paper, Stack, Typography, Divider } from '../../../components'

export function Votings({ votings, blockNumber }) {
	if (!votings || votings.length === 0) {
		return null
	}

	return (
		<Stack spacing={4}>
			<Stack direction="row" justifyContent="space-between">
				<Typography variant="h5">Votings</Typography>
				<Box>Filter TBD</Box>
			</Stack>
			<Paper>
				<Box padding={4}>
					<Stack spacing={4}>
						{votings?.map((proposal, i) => (
							<React.Fragment key={proposal?.proposal_id}>
								<ProposalItem blockNumber={blockNumber} proposal={proposal} />
								{i !== votings.length - 1 && <Divider sx={{ margin: '2rem 0' }} />}
							</React.Fragment>
						))}
					</Stack>
				</Box>
			</Paper>
		</Stack>
	)
}
