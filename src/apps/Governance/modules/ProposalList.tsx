import React, { useEffect, useState } from 'react'
import { Box, Paper, Stack, Typography } from 'src/components'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'

export function ProposalList() {
	const { proposals } = useGameDaoGovernance()

	useEffect(() => {
		console.log('🚀 ~ file: ProposalList.tsx ~ line 11 ~ useEffect ~ proposals', proposals)
	}, [proposals])

	return (
		proposals && (
			<Paper>
				<Box display="flex" padding={4}>
					<Stack spacing={5}>
						<Typography variant="h6">Open votings</Typography>
						<Box>test</Box>
					</Stack>
				</Box>
			</Paper>
		)
	)
}
