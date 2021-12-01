import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, Link, Paper, Stack, Typography } from 'src/components'
import ArrowBackIosIconNew from '@mui/icons-material/ArrowBackIosNew'
import { useNavigate, useParams } from 'react-router'
import { normalizeNumber } from 'src/utils/normalizeNumber'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { blockTime } from '../lib/data'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { useApiProvider } from '@substra-hooks/core'
import { gateway, getJSON } from '../lib/ipfs'
import { NavLink } from 'react-router-dom'
import to from 'await-to-js'
import moment from 'moment'
import { LinearProgress } from '@mui/material'
import { createErrorNotification, createInfoNotification } from 'src/utils/notification'
import { useWallet } from 'src/context/Wallet'

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

async function fetchOrganisationMetaData(cid, setLogo) {
	// Invalid ipfs hash
	if (cid?.length !== 46) return

	const [err, data] = await to(fetch(`${gateway}${cid}`))
	if (err) {
		createErrorNotification('Metadata for this organization could not be downloaded ')
		return console.error(err)
	}

	const [parseErr, parsedData] = await to(data.json())
	if (parseErr) {
		createErrorNotification('Metadata for this organization could not be parsed ')
		return console.error(parseErr)
	}

	if (parsedData.logo) {
		setLogo(parsedData.logo)
	}
}

export function GovernanceProposalInfoPage() {
	// Get state
	const navigate = useNavigate()
	const queryParams = useParams()
	const apiProvider = useApiProvider()

	const { address, signAndNotify } = useWallet()

	const { owners, metadata, proposals, proposalSimpleVotes } = useGameDaoGovernance()
	const { bodies, bodyMemberState, queryBodyMemberState } = useGameDaoControl()

	const [blockNumber, setBlockNumber] = useState(0)
	const [description, setDescription] = useState<any>()
	const [imageState, setImageState] = useState<any>()

	// Proposal
	const proposalId = queryParams.id
	const proposal = proposals?.[proposalId]

	const proposalMeta = metadata?.[proposalId]
	const start = proposal ? (normalizeNumber(proposal.start) - blockNumber) * blockTime : null
	const expires = proposal ? (normalizeNumber(proposal.expiry) - blockNumber) * blockTime : null

	// Get block number
	useEffect(() => {
		if (!apiProvider) return
		let unsubscribeAll

		apiProvider.derive.chain
			.bestNumberFinalized((number) => {
				setBlockNumber(number.toNumber())
			})
			.then((unsub) => {
				unsubscribeAll = unsub
			})
			.catch(console.error)

		return () => unsubscribeAll && unsubscribeAll()
	}, [apiProvider])

	// Vote
	const [humanizedYesCount, humanizedNoCount] = proposalSimpleVotes?.[proposalId] ?? [0, 0]
	const [yesCount, noCount] = [
		normalizeNumber(humanizedYesCount),
		normalizeNumber(humanizedNoCount),
	]
	const voteCount = yesCount + noCount

	// Orgianization
	const bodyId = proposal?.context_id ?? null
	const body = bodyId ? bodies?.[bodyId] : null
	const isMember = bodyMemberState?.[bodyId]?.[address] === '1' ?? false

	useEffect(() => {
		if (!bodyId) return

		queryBodyMemberState(bodyId, address)
	}, [address, bodyId])

	// Helper functions
	const calculatePercentage = (count) => (voteCount === 0 ? 0 : (count * 100) / voteCount)

	// Fetch Description
	useEffect(() => {
		if (!metadata || !(proposalId in metadata)) return

		fetchProposalDescription(metadata[proposalId].cid, setDescription)
	}, [metadata, proposalId])

	// Fetch logo
	useEffect(() => {
		if (!body) return

		fetchOrganisationMetaData(body.cid, setImageState)
	}, [body])

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
				// TODO: 2075 Do we need error handling here if false?
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
					<Stack direction="row" justifyContent="space-between" width="100%">
						<Typography variant="h4">{proposalMeta.title}</Typography>
						{imageState ? (
							<img width="200px" height="100%" src={`${gateway}${imageState}`} />
						) : null}
					</Stack>
					<Paper sx={{ width: '100%' }}>
						<Stack direction="row" padding={6} spacing={6}>
							<Stack flex="3">
								<Box whiteSpace="pre-line">
									{description ?? 'Could not load the description!'}
								</Box>
								<Box
									display="flex"
									alignItems="center"
									flexWrap="wrap"
									paddingTop={6}
									marginTop="auto !important"
								>
									<Box
										display="flex"
										justifyContent="space-between"
										flexDirection="row"
										width="100%"
									>
										<Typography>NO</Typography>
										<Typography>YES</Typography>
									</Box>
									<LinearProgress
										sx={{ width: '100%', margin: '1rem 0' }}
										variant="determinate"
										value={calculatePercentage(noCount)}
									/>
									<Box
										display="flex"
										justifyContent="space-between"
										flexDirection="row"
										width="100%"
									>
										<Typography>
											{noCount} Votes [
											{Math.round(calculatePercentage(noCount))}%]
										</Typography>
										<Typography>
											{yesCount} Votes [
											{Math.round(calculatePercentage(yesCount))}%]
										</Typography>
									</Box>
								</Box>
							</Stack>
							<Divider orientation="vertical" sx={{ height: 'inherit' }} />
							<Stack flex="1" spacing={3}>
								<Box>
									<Typography>Organisation</Typography>
									<Link
										display="block"
										component={NavLink}
										to={`/app/organisations/${bodyId}`}
									>
										<Typography variant="body1">{body.name}</Typography>
									</Link>
								</Box>
								<Box>
									<Typography>Creator</Typography>
									<Link display="block" component={NavLink} to="/">
										<Typography variant="body1">{`${owners[proposalId].substr(
											0,
											15
										)}...${owners[proposalId].substr(
											owners[proposalId].length - 6
										)}`}</Typography>
									</Link>
								</Box>
								<Box>
									<Typography>Start</Typography>
									<Typography display="block" variant="body1">
										{moment().add(start, 'seconds').format('YYYY-MM-DD HH:mm')}
									</Typography>
								</Box>
								<Box>
									<Typography>End</Typography>
									<Typography display="block" variant="body1">
										{moment()
											.add(expires, 'seconds')
											.format('YYYY-MM-DD HH:mm')}
									</Typography>
								</Box>
								<Box marginTop="auto !important" paddingTop={3}>
									<Typography>Vote</Typography>
									{isMember ? (
										<Stack direction="row" justifyContent="space-between">
											<Button onClick={() => onVoteClicked(false)}>No</Button>
											<Button onClick={() => onVoteClicked(true)}>Yes</Button>
										</Stack>
									) : (
										<Typography display="block" variant="body1">
											You need to be a member in order to vote for this
											proposal.
										</Typography>
									)}
								</Box>
							</Stack>
						</Stack>
					</Paper>
				</>
			) : null}
		</Stack>
	)
}
