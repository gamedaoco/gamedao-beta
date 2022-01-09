import { Stack } from '@mui/material'
import React from 'react'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'

export function ProposalVoterList({ proposal }) {
	const { proposalApprovers, proposalDeniers } = useGameDaoGovernance()
	const filteredAcceptVoters = proposalApprovers?.[proposal.proposal_id]
	const filteredDenyVoters = proposalDeniers?.[proposal.proposal_id]
	console.log(
		'🚀 ~ file: ProposalVoterList.tsx ~ line 9 ~ ProposalVoterList ~ filteredAcceptVoters',
		filteredAcceptVoters
	)
	console.log(
		'🚀 ~ file: ProposalVoterList.tsx ~ line 11 ~ ProposalVoterList ~ filteredDenyVoters',
		filteredDenyVoters
	)

	return (
		<Stack flex="1" spacing={3}>
			test
		</Stack>
	)
}
