import React, { useEffect, useState } from 'react'
import { Box, Button, Link, Stack, Typography } from 'src/components'
import { NavLink } from 'react-router-dom'
import moment from 'moment'
import { normalizeNumber } from 'src/utils/normalizeNumber'
import { blockTime } from '../../lib/data'
import { useSelector } from 'react-redux'
import { blockStateSelector } from 'src/redux/block.slice'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useGameDaoGovernance } from '../../../hooks/useGameDaoGovernance'

export function ProposalMetadata({
									 address,
									 body,
									 proposalOwner,
									 proposal,
									 apiProvider,
									 onVoteClicked,
									 isOrganisation,
								 }) {
	const blockNumber = useSelector(blockStateSelector)
	const {
		bodyMemberState,
		memberships,
		queryBodyMemberState,
		queryMemberships,
	} = useGameDaoControl()
	const { proposalStates } = useGameDaoGovernance()
	const [hasVoted, setHasVoted] = useState(false)
	const [isMemberState, setIsMemberState] = useState(false);
	const bodyId = body.id
	const proposalId = proposal.proposal_id
	const proposalState = +proposalStates[proposalId]
	const start = proposal ? (normalizeNumber(proposal.start) - blockNumber) * blockTime : null
	const expires = proposal ? (normalizeNumber(proposal.expiry) - blockNumber) * blockTime : null

	useEffect(() => {

		;(async () => {
			const hasVoted = (
				await apiProvider.query.gameDaoGovernance.votedBefore([address, proposalId])
			).toHuman()
			if (address) {
				queryBodyMemberState(isOrganisation ? bodyId : body?.org, address)
				const memberships = await queryMemberships(address)
				setIsMemberState(memberships?.includes(isOrganisation ? bodyId : body?.org))
			}

			setHasVoted(hasVoted)
		})()
	}, [address, proposalId])

	return (
		<Stack flex='1' spacing={3}>
			<Box>
				<Typography>{isOrganisation ? 'Organisation' : 'Campaign'}</Typography>
				<Link display='block' component={NavLink}
					  to={isOrganisation ? `/app/organisations/${bodyId}` : `/app/campaigns/${bodyId}`}>
					<Typography variant='body1'>{body.name}</Typography>
				</Link>
			</Box>
			<Box>
				<Typography>Creator</Typography>
				<Link display='block' component={'a'} href={`https://sub.id/#/${proposalOwner}`}>
					<Typography variant='body1'>{`${proposalOwner.substr(
						0,
						15,
					)}...${proposalOwner.substr(proposalOwner.length - 6)}`}</Typography>
				</Link>
			</Box>
			<Box>
				<Typography>Start</Typography>
				<Typography display='block' variant='body1'>
					{moment().add(start, 'seconds').format('YYYY-MM-DD HH:mm')}
				</Typography>
			</Box>
			<Box>
				<Typography>End</Typography>
				<Typography display='block' variant='body1'>
					{moment().add(expires, 'seconds').format('YYYY-MM-DD HH:mm')}
				</Typography>
			</Box>
			<Box marginTop='auto !important' paddingTop={3}>
				<Typography>Vote</Typography>
				{proposalState !== 1 ?
					<Typography display='block' variant='body1'>
						The voting is no longer active.
					</Typography> : isMemberState ? (
						!hasVoted ? (
							<Stack direction='row' justifyContent='space-between'>
								<Button onClick={() => onVoteClicked(false)}>No</Button>
								<Button onClick={() => onVoteClicked(true)}>Yes</Button>
							</Stack>
						) : (
							<Typography display='block' variant='body1'>
								You have already voted for this proposal.
							</Typography>
						)
					) : (
						<Typography display='block' variant='body1'>
							You need to be a member in order to vote for this proposal.
						</Typography>
					)}
			</Box>
		</Stack>
	)
}
