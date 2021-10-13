/**
 _______________________________ ________
 \____    /\_   _____/\______   \\_____  \
	 /     /  |    __)_  |       _/ /   |   \
	/     /_  |        \ |    |   \/    |    \
 /_______ \/_______  / |____|_  /\_______  /
				 \/        \/         \/         \/
 Z  E  R  O  .  I  O     N  E  T  W  O  R  K
 © C O P Y R I O T   2 0 7 5   Z E R O . I O
**/

import React, { useEffect, useState, lazy } from 'react'
import { useSubstrate } from '../../substrate-lib'

import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';

import { Button, Typography, Box, Stack } from '../../components'

const CampaignGrid = lazy(() => import('./CampaignGrid'))
const CreateCampaign = lazy(() => import('./Create'))

//
// campaigns component
// requires: api, accountpair
// queries / subscribes to chain
// TODO: subscriptions to event maybe more efficient
// than watching the state
//

export const Campaigns = (props) => {
	const { accountPair } = props
	const { api } = useSubstrate()
	const [nonce, updateNonce] = useState()
	const [hashes, setHashes] = useState()

	const [campaigns, setCampaigns] = useState()
	const [balances, setBalances] = useState()
	const [states, setStates] = useState()
	const [content, setContent] = useState()

	useEffect(() => {
		let unsubscribe = null

		api.query.gameDaoCrowdfunding
			.nonce((n) => {
				if (n.isNone) {
					updateNonce('<None>')
				} else {
					updateNonce(n.toNumber())
				}
			})
			.then((unsub) => {
				unsubscribe = unsub
			})
			.catch(console.error)

		return () => unsubscribe && unsubscribe()
	}, [api.query.gameDaoCrowdfunding])

	// useEffect(() => {

	// 	let unsubscribe = null

	// 	const query = api.query.gameDaoCrowdfunding
	// 	let contributed, owned

	// 	api.queryMulti([
	// 		[query.campaignsContributedCount, accountPair.address],
	// 		[query.campaignsOwnedCount, accountPair.address],
	// 	],([contributed,owned]) => {
	// 		setState({
	// 			...state,
	// 			contributed: contributed.toNumber(),
	// 			owned: owned.toNumber(),
	// 		})
	// 	}).then(unsub => {
	// 		unsubscribe = unsub;
	// 	}).catch(console.error);

	// 	return () => unsubscribe && unsubscribe()

	// }, [nonce, accountPair, api, state, api.query.gameDaoCrowdfunding])

	useEffect(() => {
		if (nonce === 0) return

		const query = api.query.gameDaoCrowdfunding.campaignsArray
		const req = [...new Array(nonce)].map((a, i) => i)
		const queryHashes = async (args) => {
			const res = await query.multi(req).then((_) => _.map((_h) => _h.toHuman()))
			setHashes(res)
		}
		queryHashes()
	}, [nonce, api.query.gameDaoCrowdfunding])

	useEffect(() => {
		if (!hashes) return

		const query = api.query.gameDaoCrowdfunding.campaigns
		const queryCampaigns = async (args) => {
			let _req = []
			try {
				for (var i = 0; i < args.length; i++) _req.push(query(args[i]))
				const res = await Promise.all(_req).then((_) => _.map((_c, _i) => _c.toHuman()))
				setCampaigns(res)
			} catch (err) {
				console.error(err)
			}
		}
		queryCampaigns(hashes)
	}, [hashes, api.query.gameDaoCrowdfunding])

	useEffect(() => {
		if (!hashes) return

		const query = api.query.gameDaoCrowdfunding.campaignBalance
		const queryContributions = async (args) => {
			let req = []
			try {
				for (var i = 0; i < args.length; i++) req.push(query(args[i]))
				const res = await Promise.all(req).then((_) => _.map((_c, _i) => [args[_i], _c.toHuman()]))
				setBalances(res)
			} catch (err) {
				console.error(err)
			}
		}
		queryContributions(hashes)
	}, [hashes, api.query.gameDaoCrowdfunding])

	useEffect(() => {
		if (!hashes) return

		const query = api.query.gameDaoCrowdfunding.campaignState
		const queryStates = async (args) => {
			let req = []
			try {
				for (var i = 0; i < args.length; i++) req.push(query(args[i]))
				const res = await Promise.all(req).then((_) => _.map((_c, _i) => [args[_i], _c.toHuman()]))
				setStates(res)
			} catch (err) {
				console.error(err)
			}
		}
		queryStates(hashes)
	}, [hashes, api.query.gameDaoCrowdfunding])

	useEffect(() => {
		if (!campaigns || !balances || !states) return

		const content = campaigns.map((item, index) => {
			let state,
				balance = 0,
				id = item.id

			if (states.length > 0) {
				const filter = states.filter((s) => s[0] === id)
				state = filter.length === 0 ? 0 : filter[0][1]
			}

			if (balances.length > 0) {
				const filter = balances.filter((s) => s[0] === id)
				balance = filter.length === 0 ? 0 : filter[0][1]
			}

			const _item = {
				...item,
				state,
				balance,
			}

			return _item
		})

		setContent(content)
	}, [campaigns, balances, states])

	const [showCreateMode, setCreateMode] = useState(false)
	const handleCreateBtn = (e) => setCreateMode(true)
	const handleCloseBtn = (e) => setCreateMode(false)

	return (
		<>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				spacing={12}
			>
				<Typography>
					{!content || nonce === 0 ? <h4>No campaigns yet. Create one!</h4> : <h4>Total campaigns: {nonce}</h4>}
				</Typography>
				<Box>
						{showCreateMode ? (
							<Button variant="outlined" startIcon={<ClearIcon />} onClick={handleCloseBtn}>
								<Typography>Close</Typography>
							</Button>
						) : (
							<Button variant="outlined" startIcon={<AddIcon />} onClick={handleCreateBtn}>
								<Typography>New Campaign</Typography>
							</Button>
						)}
				</Box>
			</Stack>
			<br />
			{showCreateMode && <CreateCampaign accountPair={accountPair} />}
			{!showCreateMode && content && nonce !== 0 && <CampaignGrid content={content} accountPair={accountPair} />}
		</>
	)
}

export default Campaigns
