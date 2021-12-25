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
// import { useWallet } from 'src/context/Wallet'

import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'

import { Button, Typography, Box, Stack, Loader } from '../../components'
import { useCrowdfunding } from 'src/hooks/useCrowdfunding'
import { useApiProvider } from '@substra-hooks/core'
import { useWallet } from 'src/context/Wallet'

import CampaignGrid from './CampaignGrid'
const CreateCampaign = lazy(() => import('./Create'))

//
// campaigns component
// requires: api,
// queries / subscribes to chain
// TODO: subscriptions to event maybe more efficient
// than watching the state
//

export const Campaigns = (props) => {
	const { campaignsCount, campaignBalance, campaignState, campaigns, campaignsIndex } =
		useCrowdfunding()

	const { account } = useWallet()

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

		content.sort(function (a, b) {
			var A = parseInt(a.expiry.replaceAll(',', ''))
			var B = parseInt(b.expiry.replaceAll(',', ''))
			if (A < B) {
				return -1
			}
			if (A > B) {
				return 1
			}
			return 0
		})

		setContent(content)
	}, [campaignsIndex, campaignBalance, campaignState, campaigns])

	const [showCreateMode, setCreateMode] = useState(false)
	const handleCreateBtn = (e) => setCreateMode(true)
	const handleCloseBtn = (e) => setCreateMode(false)

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Box>
					{ !showCreateMode
					? (
						campaignsCount === 0 ? (
							<h4>No campaigns yet. Create one!</h4>
						) : (
							!content
							? <Loader text="" />
							: <h4>Total campaigns: {campaignsCount ?? <Loader text="" />}</h4>
						)
					)
					: (
						<h4>Create Campaign</h4>
					)}
				</Box>

				<Box marginLeft="auto">
					{ showCreateMode
						? (
							<Button
								variant="outlined"
								startIcon={<ClearIcon />}
								onClick={handleCloseBtn}
							>
								<Typography>Close</Typography>
							</Button>
						)
						: (
							account
							? (
								<Button
									variant="outlined"
									startIcon={<AddIcon />}
									onClick={handleCreateBtn}
								>
									<Typography>New Campaign</Typography>
								</Button>
							)
							: null
						)
					}
				</Box>
			</Box>
			<br />
			{showCreateMode && <CreateCampaign />}
			{!showCreateMode && content && campaignsCount > 0 && (
				<CampaignGrid content={content} />
			)}
		</>
	)
}

export default function Component(props) {
	const apiProvider = useApiProvider()
	return apiProvider ? <Campaigns /> : null
}
