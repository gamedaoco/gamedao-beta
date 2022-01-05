import { Divider, Stack } from '@mui/material'
import React from 'react'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { Grid, Link, Paper, Typography } from '../../../components'
import { useTheme } from '@mui/material/styles'

export function ProposalVoterList({ proposal }) {
	const { proposalVotesByVoters } = useGameDaoGovernance()
	const voters = proposalVotesByVoters?.[proposal.proposal_id] ?? []

	const theme = useTheme()
	const bgPlain = { backgroundColor: theme.palette.grey[500_16] }

	return voters.length > 0 ? (
		<Stack sx={{ width: '100%' }} flex="1" spacing={3}>
			<Paper sx={{ ...bgPlain }}>
				<Stack padding={6} spacing={3}>
					<Typography variant="h5">Voter list ({voters.length})</Typography>
					<Grid container spacing={1}>
						<Grid item padding={1} xs={12} md={6}>
							<Typography variant={'h6'}>Address</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<Typography variant={'h6'}>Vote</Typography>
						</Grid>
						{voters.map((voter, i) => (
							<>
								<Grid item xs={12} md={6}>
									<Link
										display="block"
										component={'a'}
										href={`https://polkadot.subscan.io/account/${voter[0]}`}
									>
										<Typography variant="body1">{`${voter[0].substr(
											0,
											10
										)}...${voter[0].substr(voter[0].length - 10)}`}</Typography>
									</Link>
								</Grid>
								<Grid item xs={12} md={6}>
									{voter[1] ? 'Yes' : 'No'}
								</Grid>
								{i + 1 < voters.length ? (
									<Grid item xs={12}>
										<Divider sx={{ margin: '0.5rem 0' }} />
									</Grid>
								) : null}
							</>
						))}
					</Grid>
				</Stack>
			</Paper>
		</Stack>
	) : null
}
