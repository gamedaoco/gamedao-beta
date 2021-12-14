import { LinearProgress, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, Link, Paper, Stack, Typography } from 'src/components'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { normalizeNumber } from 'src/utils/normalizeNumber'

const ProposalLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: '7px',
	backgroundColor: '#33383F',
	['> .MuiLinearProgress-bar']: {
		backgroundColor: '#F9C49D',
	},
}))

export function ProposalVoteProgress({ proposalId }) {
	const { proposalSimpleVotes } = useGameDaoGovernance()

	const [humanizedYesCount, humanizedNoCount] = proposalSimpleVotes?.[proposalId] ?? [0, 0]
	const [yesCount, noCount] = [
		normalizeNumber(humanizedYesCount),
		normalizeNumber(humanizedNoCount),
	]
	const voteCount = yesCount + noCount
	const calculatePercentage = (count) => (voteCount === 0 ? 0 : (count * 100) / voteCount)

	return (
		<>
			<Box
				display="flex"
				alignItems="center"
				flexWrap="wrap"
				paddingTop={6}
				marginTop="auto !important"
			>
				<Box display={'flex'} justifyContent={'space-between'} width="100%">
					<Stack spacing={2} direction="row" display="flex">
						<Typography>NO</Typography>
						<Typography>{Math.round(calculatePercentage(noCount))}%</Typography>
					</Stack>
					<Typography>{noCount} Votes</Typography>
				</Box>
				<ProposalLinearProgress
					sx={{ width: '100%', margin: '1rem 0' }}
					variant="determinate"
					value={calculatePercentage(noCount)}
				/>
			</Box>
			<Box display="flex" alignItems="center" flexWrap="wrap" paddingTop={1}>
				<Box display={'flex'} justifyContent={'space-between'} width="100%">
					<Stack spacing={2} direction="row" display="flex">
						<Typography>YES</Typography>
						<Typography>{Math.round(calculatePercentage(yesCount))}%</Typography>
					</Stack>
					<Typography>{yesCount} Votes</Typography>
				</Box>
				<ProposalLinearProgress
					sx={{ width: '100%', margin: '1rem 0' }}
					variant="determinate"
					value={calculatePercentage(yesCount)}
				/>
			</Box>
		</>
	)
}
