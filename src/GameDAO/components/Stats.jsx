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
import { useSubstrate } from '../../substrate-lib'
import { TxButton } from '../../substrate-lib/components'
import { Container, Segment, Tab, Form, Input, Grid, Card, Statistic, Divider } from 'semantic-ui-react'

//
//
//

export const Stats = props => {

	const { api } = useSubstrate()
	const { accountPair } = props
	const [ status, setStatus ] = useState('')

	const [ data, setData ] = useState({
		total_campaigns: 0,    // all campaigns
		total_value_locked: 0, // all contributions cumulated
		total_contributors: 0, // all contributors
	})

	useEffect(() => {

		const getStats = async () => {

			try {

				const [
					campaigns,
					contributions,
					contributors,
				] = await Promise.all([
					api.query.crowdfunding.allCampaignsCount(),
					api.query.crowdfunding.nonce(),
					api.query.crowdfunding.contributorAccountsCount(),
				])

				setData({
					campaigns,
					contributions,
					contributors,
				})

			} catch ( err ) {

				console.error( err )

			}

		}

		getStats()

	}, [api.query.crowdfunding])

	return (
		<Segment inverted>
			<Grid stackable columns={3} divided>
				<Grid.Row>
					<Grid.Column textAlign='center'>
						<Statistic
							label='Total Campaigns'
							value={data.campaigns.toString()}
							color='green'
							inverted
						/>
					</Grid.Column>
					<Grid.Column textAlign='center'>
						<Statistic
							label='Contributions'
							value={data.contributions.toString()}
							color='purple'
							inverted
						/>
					</Grid.Column>
					<Grid.Column textAlign='center'>
						<Statistic
							label='Contributors'
							value={data.contributors.toString()}
							color='orange'
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
