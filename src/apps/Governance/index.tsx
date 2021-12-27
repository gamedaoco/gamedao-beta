import React, { useEffect, useState } from 'react'
import { useApiProvider } from '@substra-hooks/core'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useBlock } from 'src/hooks/useBlock'
import { alpha, useTheme } from '@mui/material/styles'

import Add from '@mui/icons-material/Add'
import Close from '@mui/icons-material/Close'
import { Badge, Box, Button, Paper, Stack, styled, Typography } from 'src/components'
import { ProposalList } from './modules/ProposalList'
import CreateProposal from './Create'

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
	const { proposalsCount } = useGameDaoGovernance()
	const { blockNumber } = useBlock()
	const [showCreateMode, setCreateMode] = useState(false)
	// const [blockNumber, setBlockNumber] = useState(0)

	console.log( blockNumber )

	// Why?
	// useGameDaoControl()

	// useEffect(() => {
	// 	let unsubscribeAll

	// 	apiProvider.derive.chain
	// 		.bestNumberFinalized((number) => {
	// 			setBlockNumber(number.toNumber())
	// 		})
	// 		.then((unsub) => {
	// 			unsubscribeAll = unsub
	// 		})
	// 		.catch(console.error)

	// 	return () => unsubscribeAll && unsubscribeAll()
	// }, [apiProvider])

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
			{showCreateMode ? (
				<CreateProposal blockNumber={blockNumber} />
			) : (
				<ProposalList blockNumber={blockNumber} />
			)}
		</Stack>
	)
}

export default function Module(props) {
	const apiProvider = useApiProvider()
	return apiProvider ? <Main {...props} /> : null
}
