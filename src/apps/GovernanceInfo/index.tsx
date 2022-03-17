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
import { useTheme } from '@mui/material/styles'
import { useCrowdfunding } from '../../hooks/useCrowdfunding'

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

	setter(body)
}

export function Main() {
	// Get state
	const navigate = useNavigate()
	const { proposalId } = useParams()
	const apiProvider = useApiProvider()

	const { address, signAndNotify } = useWallet()

	const { owners, metadata, proposals } = useGameDaoGovernance()
	const { bodies, queryBodyMemberState } = useGameDaoControl()
	const { campaigns } = useCrowdfunding()

	const [description, setDescription] = useState<any>({ description: '', title: '' })

	const dispatch = useDispatch()

	const theme = useTheme()
	const bgPlain = { backgroundColor: theme.palette.grey[500_16] }

	// Proposal
	const proposal = proposals?.[proposalId]

	// Orgianization
	const bodyId = proposal?.context_id ?? null
	const body = bodyId ? bodies?.[bodyId] : null
	const campaign = campaigns?.[bodyId]
	const isOrganisation = !!body

	useEffect(() => {
		if (!bodyId) return

		queryBodyMemberState(isOrganisation ? bodyId : campaign?.org, address)
	}, [address, bodyId, isOrganisation])

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
			{proposal && (body || campaign) && owners ? (
				<>
					<ProposalBodyData
						body={body || campaign}
						isOrganisation={isOrganisation}
						metadata={metadata}
						proposalId={proposalId}
						title={description.title}
					/>
					<Paper sx={{ ...bgPlain, width: '100%' }}>
						<Stack direction="row" padding={6} spacing={6}>
							<Stack flex="3">
								<Box whiteSpace="pre-line">
									<MarkdownViewer
										markdown={
											description.description ??
											'Could not load the description!'
										}
									/>
								</Box>
								<ProposalVoteProgress proposalId={proposalId} />
							</Stack>
							<Divider orientation="vertical" sx={{ height: 'inherit' }} />
							<ProposalMetadata
								address={address}
								body={body || campaign}
								isOrganisation={isOrganisation}
								proposal={proposal}
								proposalOwner={owners[proposalId]}
								apiProvider={apiProvider}
								onVoteClicked={onVoteClicked}
							/>
						</Stack>
					</Paper>
				</>
			) : null}
			{proposal ? <ProposalVoterList proposal={proposal} /> : null}
		</Stack>
	)
}

export default function Module(props) {
	const apiProvider = useApiProvider()
	return apiProvider ? <Main {...props} /> : null
}
