import React, { useEffect, useState, lazy } from 'react'
import { useApiProvider } from '@substra-hooks/core'
import { useWallet } from 'src/context/Wallet'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { alpha, useTheme } from '@mui/material/styles'

import Add from '@mui/icons-material/Add'
import Close from '@mui/icons-material/Close'
import { Badge, Box, Button, Paper, Stack, styled, Typography } from 'src/components'

const CreateProposal = lazy(() => import('./modules/Create'))
const ProposalList = lazy(() => import('./modules/ProposalList'))

const NavBadge = styled(Badge)(({ theme }) => ({
	'& .MuiBadge-badge': {
		color: theme.palette.background.default,
		borderRadius: 6,
		right: 'initial',
	},
}))

function Main() {

	const theme = useTheme()
	const bgPlain = { backgroundColor: theme.palette.grey[500_16] }

	const apiProvider = useApiProvider()
	const { account, connected } = useWallet()

	const { proposalsCount } = useGameDaoGovernance()
	const [showCreateMode, setCreateMode] = useState(false)

	return (
		<Stack spacing={4}>
{/*
			<Typography component="h1" variant="h3">
				Votings
				{proposalsCount > 0 ? (
					<NavBadge badgeContent={proposalsCount} color={'primary'} />
				) : null}
			</Typography>
*/}
			<Paper sx={{ ...bgPlain }}>
				<Box display="flex" padding={4}>
					<Stack flex="2" spacing={1}>
						<Typography variant="h6">
							{proposalsCount === 0
								? 'No proposals yet. Create one!'
								: `Total proposals: ${proposalsCount ?? 0}`}
						</Typography>
						<Typography variant="body2">
							Decisions are governed by proposals and voting to ensure everyone in the
							organisation has a voice.
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
			{showCreateMode && connected ? (
				<CreateProposal />
			) : (
				<ProposalList />
			)}
		</Stack>
	)
}

export default function Module(props) {
	const apiProvider = useApiProvider()
	return apiProvider ? <Main {...props} /> : null
}
