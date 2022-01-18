import { Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import {
	Avatar,
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '../../../components'
import { useTheme } from '@mui/material/styles'
import { useIdentity } from 'src/hooks/useIdentity'

export function ProposalVoterList({ proposal }) {
	const { proposalVotesByVoters } = useGameDaoGovernance()
	const { queryAccountIdentity, identities } = useIdentity(null)

	const voters = proposalVotesByVoters?.[proposal.proposal_id] ?? []

	const theme = useTheme()
	const bgPlain = { backgroundColor: theme.palette.grey[500_16] }

	useEffect(() => {
		if (voters?.length > 0) {
			queryAccountIdentity(voters.map((voter) => voter[0]))
		}
	}, [voters])

	return voters.length > 0 ? (
		<Stack sx={{ width: '100%' }} flex="1" spacing={3}>
			<Paper sx={{ ...bgPlain }}>
				<Stack padding={6} spacing={3}>
					<Typography variant="h5">Voter list ({voters.length})</Typography>

					<Table>
						<TableHead>
							<TableRow>
								<TableCell sx={{ boxShadow: 'none !important' }}>Voter</TableCell>
								<TableCell sx={{ boxShadow: 'none !important' }} align="right">
									Vote
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{voters?.map((voter, index) => (
								<TableRow
									key={index}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<TableCell>
										<Stack direction="row" spacing={2} alignItems="center">
											<Avatar alt="user" />
											<Stack>
												<Link
													display="block"
													component={'a'}
													href={`https://polkadot.subscan.io/account/${voter[0]}`}
												>
													<Typography variant="h6">
														{identities?.[voter[0]]?.toHuman()?.info
															?.display?.Raw ?? ''}
													</Typography>
													<Typography variant="body1">{`${voter[0].substr(
														0,
														15
													)}...${voter[0].substr(
														voter[0].length - 6
													)}`}</Typography>
												</Link>
											</Stack>
										</Stack>
									</TableCell>
									<TableCell align="right"> {voter[1] ? 'Yes' : 'No'}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Stack>
			</Paper>
		</Stack>
	) : null
}
