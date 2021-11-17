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

import React, { useEffect, useState } from 'react'
import { Container, Box, Stack } from '.'
import { useApiProvider } from '@substra-hooks/core'
import { Typography } from '@mui/material'
//
//
//
// TODO: Remove?
// TODO: @2075 I do not think that the component is still used
export const Stats = (props) => {
	return null
	// const apiProvider = useApiProvider()

	// const [data, setData] = useState({
	// 	total_campaigns: 0, // all campaigns
	// 	total_value_locked: 0, // all contributions cumulated
	// 	total_contributors: 0, // all contributors
	// })

	// useEffect(() => {
	// 	const getStats = async () => {
	// 		try {
	// 			const [campaigns, contributions, contributors] = await Promise.all([
	// 				apiProvider.query.crowdfunding.allCampaignsCount(),
	// 				apiProvider.query.crowdfunding.nonce(),
	// 				apiProvider.query.crowdfunding.contributorAccountsCount(),
	// 			])

	// 			setData({
	// 				campaigns,
	// 				contributions,
	// 				contributors,
	// 			})
	// 		} catch (err) {
	// 			console.error(err)
	// 		}
	// 	}

	// 	getStats()
	// }, [apiProvider.query.crowdfunding])

	// return (
	// 	<Container>
	// 		<Box>
	// 			<Stack>
	// 				<Box textAlign="center">
	// 					<Typography
	// 						label="Total Campaigns"
	// 						value={data.campaigns.toString()}
	// 						color="green"
	// 						inverted
	// 					>{data.campaigns.toString()}</Typography>
	// 				</Box>
	// 				<Box textAlign="center">
	// 					<Typography
	// 						label="Contributions"
	// 						value={data.contributions.toString()}
	// 						color="purple"
	// 						inverted
	// 					>{data.contributions.toString()}</Typography>
	// 				</Box>
	// 				<Box textAlign="center">
	// 					<Typography
	// 						label="Contributors"
	// 						value={data.contributors.toString()}
	// 						color="orange"
	// 						inverted
	// 					>{data.contributors.toString()}</Typography>
	// 				</Box>
	// 			</Stack>
	// 		</Box>
	// 	</Container>
	// )
}

export default Stats

//
//
//
