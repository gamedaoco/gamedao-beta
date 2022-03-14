import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import moment from 'moment'
import { blockTime, PROPOSAL_STATE_MAPPING } from 'src/apps/lib/data'
import { normalizeNumber } from 'src/utils/normalizeNumber'
import { proposal_states } from '../../lib/data'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { useBlock } from 'src/hooks/useBlock'

import to from 'await-to-js'
import { gateway } from '../../lib/ipfs'

import { Divider, LinearProgress } from '@mui/material'
import { Box, Button, Chip, Grid, Typography, useTheme } from 'src/components'
import { useCrowdfunding } from '../../../hooks/useCrowdfunding'

export function ProposalItem({ proposal, showDivider }) {
	const blockNumber = useBlock()

	// Get state
	const { metadata, proposalSimpleVotes, proposalStates } = useGameDaoGovernance()
	const { campaigns } = useCrowdfunding()
	const { bodies } = useGameDaoControl()
	const navigate = useNavigate()
	const theme = useTheme()

	// Proposal
	const proposalId = proposal.proposal_id
	const proposalMeta = metadata?.[proposalId]
	const proposalState = +proposalStates[proposalId]
	const proposalStateColor =
		(theme.palette as any).proposalStates[PROPOSAL_STATE_MAPPING[proposalState]] ??
		(theme.palette as any).proposalStates.default

	const [ title, setTitle ] = useState(null)
	useEffect(()=>{

		if(!proposalMeta?.cid) return

		async function getTitle(cid) {
			const [err, data] = await to( fetch(`${gateway}${cid}`) )
			const title = ( await data.json() ).title
			setTitle( title || '' )
		}
		getTitle(proposalMeta.cid)

	},[proposalMeta])

	const expires = (normalizeNumber(proposal.expiry) - blockNumber) * blockTime

	// Vote
	const [humanizedYesCount, humanizedNoCount] = proposalSimpleVotes?.[proposalId] ?? [0, 0]
	const [yesCount, noCount] = [
		normalizeNumber(humanizedYesCount),
		normalizeNumber(humanizedNoCount),
	]
	const voteCount = yesCount + noCount

	// Organization
	const bodyId = proposal.context_id
	const body = bodies?.[bodyId]
	const campaign = campaigns?.[bodyId]

	// Helper functions
	const calculatePercentage = (count) => (voteCount === 0 ? 0 : (count * 100) / voteCount)

	const proposalStateToString = (state) => proposal_states?.find((s) => +s.value === state).text

	return proposalMeta && (body || campaign) ? (
		<>
			<Box display="flex">
				<Grid container spacing={2}>
					<Grid
						item
						sx={{ flexDirection: 'column' }}
						xs={12}
						md={4}
						justifyContent="center"
						display="flex"
					>
						<Box
							onClick={() => navigate(`/app/governance/${proposalId}`)}
							sx={{ cursor: 'pointer' }}
						>
							<Typography sx={{ fontSize: '0.75rem', opacity: 0.3 }} variant="body1">
								{(body || campaign).name}
							</Typography>
							<Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
								{ title || proposalMeta.title }
							</Typography>
							<Typography sx={{ fontSize: '0.75rem' }} variant="body1">
								{expires < 0
									? '' // proposalStateToString(proposalState)
									: `Expires ${moment()
											.add(expires, 'seconds')
											.format('MMMM D, YYYY')}`}
							</Typography>
						</Box>
					</Grid>
					<Grid
						item
						sx={{ flexDirection: 'column' }}
						xs={12}
						md={4}
						justifyContent="center"
						display="flex"
					>
						<Box display="flex" flexBasis="30%" alignItems="center">
							<Box display="flex" justifyContent="center" flexDirection="column">
								<Typography>No</Typography>
								<Typography>{Math.round(calculatePercentage(noCount))}%</Typography>
							</Box>
							<LinearProgress
								sx={{
									borderRadius: '2px',
									'*': { borderRadius: '0px' },
									backgroundColor:'#093',
									width: '100%',
									height:'.5rem',
									margin: '0 1rem'
								}}
								variant="determinate"
								color="secondary"
								value={calculatePercentage(noCount)}
							/>
							<Box display="flex" justifyContent="center" flexDirection="column">
								<Typography>Yes</Typography>
								<Typography>
									{Math.round(calculatePercentage(yesCount))}%{}
								</Typography>
							</Box>
						</Box>
					</Grid>
					<Grid
						item
						sx={{ flexDirection: 'column' }}
						xs={6}
						md={2}
						justifyContent="center"
						display="flex"
					>
						<Box
							sx={{ verticalAlign: 'middle' }}
							marginLeft="auto"
							marginRight={1}
							display="flex"
							alignItems="center"
						>
							<Chip
								sx={{
									textTransform: 'capitalize',
									color: proposalStateColor,
									borderColor: proposalStateColor,
								}}
								variant="outlined"
								label={PROPOSAL_STATE_MAPPING[proposalState]}
							/>
						</Box>
					</Grid>
					<Grid
						item
						sx={{ flexDirection: 'column' }}
						xs={6}
						md={2}
						justifyContent="center"
						display="flex"
					>
						<Box sx={{ verticalAlign: 'middle' }}>
							<Button
								size="large"
								onClick={() => navigate(`/app/governance/${proposalId}`)}
							>
								{proposalState !== 1 ? 'Details' : 'Vote'}
							</Button>
						</Box>
					</Grid>
				</Grid>
			</Box>
			{showDivider ? <Divider sx={{ margin: '2rem 0' }} /> : null}
		</>
	) : null
}
