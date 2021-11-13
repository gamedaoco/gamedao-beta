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
// import { useWallet } from 'src/context/Wallet'

import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'

import { Button, Typography, Box, Stack } from '../../components'
import { useCrowdfunding } from 'src/hooks/useCrowdfunding'
import { useApiProvider } from '@substra-hooks/core'

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
	const { campaignsCount, campaignBalance, campaignState, campaigns, campaignsIndex } =
		useCrowdfunding()

	const [content, setContent] = useState()

	useEffect(() => {
		if (!campaignsIndex || !campaignBalance || !campaignState || !campaigns) return

		const content = Object.keys(campaignsIndex).map((index) => {
			const itemHash = campaignsIndex[index]

			return {
				...(campaigns[itemHash] ?? {}),
				state: campaignState[itemHash],
				balance: campaignBalance[itemHash],
			}
		})
		setContent(content)
	}, [campaignsIndex, campaignBalance, campaignState, campaigns])

	const [showCreateMode, setCreateMode] = useState(false)
	const handleCreateBtn = (e) => setCreateMode(true)
	const handleCloseBtn = (e) => setCreateMode(false)

	return (
		<>
			<Stack direction="row" justifyContent="space-between" alignItems="center" spacing={12}>
				<Typography>Campaigns</Typography>
				<Typography>
					{!content || campaignsCount === 0 ? (
						<h4>No campaigns yet. Create one!</h4>
					) : (
						<h4>Total campaigns: {campaignsCount ?? 'Loading...'}</h4>
					)}
				</Typography>
				<Box>
					{showCreateMode ? (
						<Button
							variant="outlined"
							startIcon={<ClearIcon />}
							onClick={handleCloseBtn}
						>
							<Typography>Close</Typography>
						</Button>
					) : (
						<Button
							variant="outlined"
							startIcon={<AddIcon />}
							onClick={handleCreateBtn}
						>
							<Typography>New Campaign</Typography>
						</Button>
					)}
				</Box>
			</Stack>
			<br />
			{showCreateMode && <CreateCampaign />}
			{!showCreateMode && content && campaignsCount !== 0 && (
				<CampaignGrid content={content} />
			)}
		</>
	)
}

export default function Component(props) {
	const apiProvider = useApiProvider()
	return apiProvider ? <Campaigns /> : null
}
