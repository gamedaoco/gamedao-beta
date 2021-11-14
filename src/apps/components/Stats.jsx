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
import { Segment, Grid, Statistic } from 'semantic-ui-react'
import { useApiProvider } from '@substra-hooks/core'
//
//
//

export const Stats = (props) => {
	const apiProvider = useApiProvider()

	const [data, setData] = useState({
		total_campaigns: 0, // all campaigns
		total_value_locked: 0, // all contributions cumulated
		total_contributors: 0, // all contributors
	})

	useEffect(() => {
		const getStats = async () => {
			try {
				const [campaigns, contributions, contributors] = await Promise.all([
					apiProvider.query.crowdfunding.allCampaignsCount(),
					apiProvider.query.crowdfunding.nonce(),
					apiProvider.query.crowdfunding.contributorAccountsCount(),
				])

				setData({
					campaigns,
					contributions,
					contributors,
				})
			} catch (err) {
				console.error(err)
			}
		}

		getStats()
	}, [apiProvider.query.crowdfunding])

	return (
		<Segment inverted>
			<Grid stackable columns={3} divided>
				<Grid.Row>
					<Grid.Column textAlign="center">
						<Statistic
							label="Total Campaigns"
							value={data.campaigns.toString()}
							color="green"
							inverted
						/>
					</Grid.Column>
					<Grid.Column textAlign="center">
						<Statistic
							label="Contributions"
							value={data.contributions.toString()}
							color="purple"
							inverted
						/>
					</Grid.Column>
					<Grid.Column textAlign="center">
						<Statistic
							label="Contributors"
							value={data.contributors.toString()}
							color="orange"
							inverted
						/>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Segment>
	)
}

export default Stats

//
//
//
