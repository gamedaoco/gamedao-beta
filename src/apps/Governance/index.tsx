// control - a dao interface
// invoke and manage organisations on chain

import React, { useEffect, useState, lazy } from 'react'
import { useWallet } from 'src/context/Wallet'

import { data as d } from '../lib/data'
import { gateway } from '../lib/ipfs'
import config from '../../config'

import { Button, Typography, Box, Stack, Grid } from 'src/components'
import Add from '@mui/icons-material/Add'
import Close from '@mui/icons-material/Close'
import { useApiProvider } from '@substra-hooks/core'

const dev = config.dev
const ItemTable = lazy(() => import('./ItemTable'))
const CreateProposal = lazy(() => import('./Create'))

export const Component = (props) => {
	const apiProvider = useApiProvider()
	const [nonce, setNonce] = useState()
	const [hashes, setHashes] = useState()
	const [content, setContent] = useState()

	useEffect(() => {
		let unsubscribe = null

		apiProvider.query.gameDaoGovernance
			.nonce((n) => {
				setNonce(n.toNumber())
			})
			.then((unsub) => {
				unsubscribe = unsub
			})
			.catch(console.error)

		return () => unsubscribe && unsubscribe()
	}, [apiProvider.query.gameDaoGovernance])

	// hashes

	useEffect(() => {
		if (!nonce) return
		const req = [...new Array(nonce)].map((a, i) => i)
		const queryHashes = async (args) => {
			const hashes = await apiProvider.query.gameDaoGovernance.proposalsArray
				.multi(args)
				.then((_) => _.map((_h) => _h.toHuman()))
			setHashes(hashes as any)
		}
		queryHashes(req)
	}, [nonce, apiProvider.query.gameDaoGovernance])

	// proposals

	useEffect(() => {
		if (!hashes) return

		const getContent = async (args) => {
			const content = await apiProvider.query.gameDaoGovernance.proposals
				.multi(args)
				.then((_) => _.map((_h) => _h.toHuman()))
			setContent(content as any)
		}
		getContent(hashes)
	}, [hashes, apiProvider.query.gameDaoGovernance])

	// get organizations for hashes
	// filter hashes where user is member

	// group by organization
	// dropdown to select organization

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
					{!content || nonce === 0 ? (
						<Typography component="h2" variant="h5">
							No proposals yet. Create one!
						</Typography>
					) : (
						<Typography component="h2" variant="h5">
							Total proposals: {nonce}
						</Typography>
					)}
				</Box>
				<Box>
					{showCreateMode ? (
						<Button onClick={handleCloseBtn} startIcon={<Close />}>
							{' '}
							Cancel{' '}
						</Button>
					) : (
						<Button onClick={handleCreateBtn} startIcon={<Add />}>
							{' '}
							New Proposal{' '}
						</Button>
					)}
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

//
//
//
