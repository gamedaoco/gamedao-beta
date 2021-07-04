import React, { Fragment } from 'react'
import axios from 'axios'

import {
	Button, Rating, Container, Grid, Card, Icon, Image
} from 'semantic-ui-react'

const CampaignCard = ({ item, index }) => {

	if (!item) return null

	// on chain
	const { id, name, admin, cap, cid, created, deposit, expiry, governance, owner, protocol, state, balance } = item

	// off chain
	const image_url = 'https://gateway.pinata.cloud/ipfs/QmUxC9MpMjieyrGXZ4zC4yJZmH7s8H2bxMk7oQAMzfNLhY'
	const json_url = 'https://gateway.pinata.cloud/ipfs/'+ cid
	const blocksRemain = ( expiry )

	// const remaining = blocksToTime(data.expiry) - new Date().now()
	// console.log('update',Date.now())

	const tags = ['game','2d','pixel','steam']
	const views = 1//Math.floor(Math.random()*10000)
	const backers = 1//Math.floor(Math.random()*1000)

	// icon type based on supporters
	const icon = backers => {
		if (backers > 10000) return 'fire'
		if (backers > 1000) return 'heart'
		if (backers > 100) return 'peace'
		return 'plus circle'
	}
	const epoch = created.replaceAll(',','')
	const options = { year: 'numeric', month: 'long', day: 'numeric' };
	const date = new Date( epoch * 1000 ).toLocaleDateString(undefined, options)

	return (
		<Grid.Column mobile={16} tablet={8} computer={4}>
			<Card color={ ( governance === '1' ) ? 'pink' : 'teal' }>
				<Image src={image_url} wrapped ui={true} />
				<Card.Content>
					<Card.Header><a href={`/campaigns/${id}`}>{name}</a></Card.Header>
{/*					<Card.Meta>
						<Rating icon='star' defaultRating={3} maxRating={5} />
					</Card.Meta>
*/}{/*					<Card.Description>
					</Card.Description>*/}
				</Card.Content>
				<Card.Content extra>
				<Button size='mini'>join</Button>
				</Card.Content>
				<Card.Content extra>
{/*					<Icon name='eye' />{views} views.<br/>
*/}					<Icon name='money bill alternate' />
					{backers} backers contributed {balance} / {cap}.<br/>
					<br/>
					<Icon name='rocket' />{date}<br/>
					<Icon name='target' />{blocksRemain}<br/>
					<a href={`/campaigns/admin/${owner}`}> <Icon name='at' />Creator</a><br/>
					<Icon name='tag' />{tags.join(', ')} <br/>
				</Card.Content>
			</Card>
		</Grid.Column>
	)

}

export default CampaignCard
