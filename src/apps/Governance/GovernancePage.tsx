import React, { useState } from 'react'
import Add from '@mui/icons-material/Add'
import Close from '@mui/icons-material/Close'
import CreateProposal from './Create'
import { Badge, Box, Button, Paper, Stack, styled, Typography } from 'src/components'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { ProposalList } from './modules/ProposalList'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'

const NavBadge = styled(Badge)(({ theme }) => ({
	'& .MuiBadge-badge': {
		color: theme.palette.background.default,
		borderRadius: 6,
		right: 'initial',
	},
}))

export function GovernancePage() {
	const { proposalsCount } = useGameDaoGovernance()
	const [showCreateMode, setCreateMode] = useState(false)
	useGameDaoControl()

	return (
		<Stack spacing={4}>
			<Typography component="h1" variant="h3">
				Votings
				{proposalsCount > 0 ? (
					<NavBadge badgeContent={proposalsCount} color={'primary'} />
				) : null}
			</Typography>
			<Paper>
				<Box display="flex" padding={4}>
					<Stack flex="2" spacing={1}>
						<Typography variant="h6">
							{proposalsCount === 0
								? 'No proposals yet.'
								: `Total proposals: ${proposalsCount ?? 0}`}
						</Typography>
						<Typography variant="body2">
							Decisions are governed by proposals and voting to ensure everyone in the
							organisation has a voice. Create a new proposal.
						</Typography>
					</Stack>
					<Box display="flex" justifyContent="flex-end" alignItems="center" flex="1">
						<Button
							onClick={() => setCreateMode(!showCreateMode)}
							startIcon={showCreateMode ? <Close /> : <Add />}
						>
							{showCreateMode ? 'Cancel' : 'New Proposal'}
						</Button>
					</Box>
				</Box>
			</Paper>
			{showCreateMode ? <CreateProposal /> : <ProposalList />}
		</Stack>
	)
}
