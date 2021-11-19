// control - a dao interface
// invoke and manage organisations on chain

import React, { useEffect, useState, lazy } from 'react'
import { useWallet } from 'src/context/Wallet'

import { Button, Typography, Box, Stack, Grid } from 'src/components'
import Add from '@mui/icons-material/Add'
import Close from '@mui/icons-material/Close'
import { useApiProvider } from '@substra-hooks/core'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { voting_types } from '../lib'

const ItemTable = lazy(() => import('./ItemTable'))
const CreateProposal = lazy(() => import('./Create'))

export const Component = (props) => {
	const [content, setContent] = useState()
	const { account } = useWallet()
	const { proposalsIndex, metadata, proposals, proposalStates, proposalsCount } =
		useGameDaoGovernance()

	useEffect(() => {
		if (proposalsIndex && proposals && metadata) {
			const data = Object.keys(proposalsIndex).map((key) => {
				const ptData = proposals[proposalsIndex[key]]
				const meta = metadata[proposalsIndex[key]]
				const state = proposalStates[proposalsIndex[key]]
				console.log('🚀 ~ file: index.tsx ~ line 28 ~ data ~ state', state)

				// TODO: Fix states
				// @2075 TODO fix data mappings
				return {
					name: meta?.title,
					body: voting_types.find((v) => v.key == ptData?.voting_type)?.text ?? '',
					// ipfs meta description
					purpose: meta?.title,
					amount: meta?.amount,
					expiry: ptData?.expiry,
					status: state == 1 ? 'open' : 'closed',
				}
			})
			setContent(data as any)
		}
	}, [proposalsIndex, metadata, proposals])

	const [showCreateMode, setCreateMode] = useState(false)
	const handleCreateBtn = (e) => setCreateMode(true)
	const handleCloseBtn = (e) => setCreateMode(false)

	return (
		<React.Fragment>
			<Typography component="h1" variant="h3">
				Governance
			</Typography>
			<Stack direction="row" justifyContent="space-between" alignItems="center" spacing={12}>
				<Box>
					{!content || proposalsCount === 0 ? (
						<Typography component="h2" variant="h5">
							No proposals yet. Create one!
						</Typography>
					) : (
						<Typography component="h2" variant="h5">
							Total proposals: {proposalsCount ?? 0}
						</Typography>
					)}
				</Box>
				<Box>
					{showCreateMode ? (
						<Button onClick={handleCloseBtn} startIcon={<Close />}>
							{' '}
							Cancel{' '}
						</Button>
					) : account ? (
						<Button onClick={handleCreateBtn} startIcon={<Add />}>
							{' '}
							New Proposal{' '}
						</Button>
					) : null}
				</Box>
			</Stack>
			{showCreateMode ? <CreateProposal /> : <ItemTable content={content} />}
		</React.Fragment>
	)
}

export default function Module(props) {
	const apiProvider = useApiProvider()
	return apiProvider && apiProvider.query.gameDaoGovernance ? <Component {...props} /> : null
}
