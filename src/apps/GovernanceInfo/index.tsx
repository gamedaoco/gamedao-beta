import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useDispatch } from 'react-redux'
import { clearGovernanceAction } from 'src/redux/duck/gameDaoGovernance.duck'
import { useApiProvider } from '@substra-hooks/core'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { useWallet } from 'src/context/Wallet'
import { createErrorNotification } from 'src/utils/notification'
import { gateway } from '../lib/ipfs'
import to from 'await-to-js'

import ArrowBackIosIconNew from '@mui/icons-material/ArrowBackIosNew'
import { Box, Button, Divider, MarkdownViewer, Paper, Stack, Typography } from 'src/components'
import { ProposalMetadata } from './modules/ProposalMetadata'
import { ProposalVoteProgress } from './modules/ProposalVoteProgress'
import { ProposalBodyData } from './modules/ProposalBodyData'
import { ProposalVoterList } from './modules/ProposalVoterList'

async function fetchProposalDescription(cid, setter) {
	// Invalid ipfs hash
	if (cid?.length !== 46) return

	const [err, data] = await to(fetch(`${gateway}${cid}`))
	if (err) {
		createErrorNotification('Metadata for this proposal could not be downloaded ')
		return console.error(err)
	}
	const [errBody, body] = await to(data.json())
	if (errBody) {
		createErrorNotification('Metadata for this proposal could not be parsed ')
		return console.error(err)
	}

	setter(body.description)
}

export function Main() {
	// Get state
	const navigate = useNavigate()
	const { proposalId } = useParams()
	const apiProvider = useApiProvider()

	const { address, signAndNotify } = useWallet()

	const { owners, metadata, proposals } = useGameDaoGovernance()
	const { bodies, queryBodyMemberState } = useGameDaoControl()

	const [description, setDescription] = useState<any>()

	const dispatch = useDispatch()

	// Proposal
	const proposal = proposals?.[proposalId]

	// Orgianization
	const bodyId = proposal?.context_id ?? null
	const body = bodyId ? bodies?.[bodyId] : null

	useEffect(() => {
		if (!bodyId) return

		queryBodyMemberState(bodyId, address)
	}, [address, bodyId])

	// Fetch Description
	useEffect(() => {
		if (!metadata || !(proposalId in metadata)) return

		fetchProposalDescription(metadata[proposalId].cid, setDescription)
	}, [metadata, proposalId])

	function onVoteClicked(hasVotedYes) {
		const voteType = hasVotedYes ? 1 : 0

		signAndNotify(
			apiProvider.tx.gameDaoGovernance.simpleVote(proposalId, voteType),
			{
				pending: 'Voting in progress',
				success: 'Voted',
				error: 'Voting failed',
			},
			(state, result) => {
				dispatch(clearGovernanceAction())
			}
		)
	}

	return (
		<Stack spacing={3} alignItems="flex-start">
			<Button onClick={() => navigate('/app/governance')}>
				<ArrowBackIosIconNew fontSize="small" />
				<Typography variant="body1" marginLeft={1}>
					Back to overview
				</Typography>
			</Button>
			{proposal && body && owners ? (
				<>
					<ProposalBodyData body={body} metadata={metadata} proposalId={proposalId} />
					<Paper sx={{ width: '100%' }}>
						<Stack direction="row" padding={6} spacing={6}>
							<Stack flex="3">
								<Box whiteSpace="pre-line">
									<MarkdownViewer
										markdown={description ?? 'Could not load the description!'}
									/>
								</Box>
								<ProposalVoteProgress proposalId={proposalId} />
							</Stack>
							<Divider orientation="vertical" sx={{ height: 'inherit' }} />
							<ProposalMetadata
								address={address}
								body={body}
								proposal={proposal}
								proposalOwner={owners[proposalId]}
								apiProvider={apiProvider}
								onVoteClicked={onVoteClicked}
							/>
						</Stack>
					</Paper>
				</>
			) : null}
		</Stack>
	)
}

export default function Module(props) {
	const apiProvider = useApiProvider()
	return apiProvider ? <Main {...props} /> : null
}