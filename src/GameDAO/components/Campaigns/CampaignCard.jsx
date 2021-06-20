import React, { Fragment } from 'react'
import axios from 'axios'

import {
	Button, Rating, Container, Grid, Card, Icon, Image
} from 'semantic-ui-react'

//
//	pinata
//

const PINATA_URL = 'https://api.pinata.cloud'
const PINATA_KEY = '081b38620bdf248aae60'
const PINATA_SECRET = 'de5a54067a0840dff9d3528b8bc11d444ad4850229057b7d25c63a586f6df92d'

// const pinata = pinataSDK( PINATA_KEY, PINATA_SECRET )
// auth test
// pinata.testAuthentication().then((result) => {
// 	console.log(result);
// }).catch((err) => {
// 	console.log(err);
// })

// pinJSONToIPFS(PINATA_URL,PINATA_KEY,PINATA_SECRET,{ id: 0, name: 'joe' })

const CampaignCard = ({ item, index }) => {

	if (!item) return null

	const { id, name, admin, cap, cid, created, deposit, expiry, governance, owner, protocol, state, balance } = item

	const image_url = 'https://gateway.pinata.cloud/ipfs/QmUxC9MpMjieyrGXZ4zC4yJZmH7s8H2bxMk7oQAMzfNLhY'

	// console.log( index, id )

	const blocksRemain = ( item.expiry - item.created )

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


	const date = new Date(created.replace(',','')).toString()

	return (
		<Grid.Column mobile={16} tablet={8} computer={4}>
			<Card color={ ( governance === '1' ) ? 'pink' : 'teal' }>
				<Image src={image_url} wrapped ui={true} />
				<Card.Content>
					<Card.Header><a href={`/campaigns/${id}`}>{name}</a></Card.Header>
					<Card.Meta>
						<Rating icon='star' defaultRating={3} maxRating={5} />
					</Card.Meta>
					<Card.Description>
					</Card.Description>
				</Card.Content>
				<Card.Content extra>
				<Button size='mini' positive>support</Button>
				</Card.Content>
				<Card.Content extra>
					<a href={`/campaigns/admin/${admin}`}> <Icon name='eye' />{views} views.</a><br/>
					<a href={`/campaigns/admin/${admin}`}> <Icon name={icon} />{backers} backers.</a><br/>
					<br/>
					<a href={`/campaigns/filter/block/${expiry}`}> <Icon name='money bill alternate' />{balance} raised.</a><br/>
					<a href={`/campaigns/filter/block/${expiry}`}> <Icon name='money bill alternate outline' />{cap} target.</a><br/>
					<br/>
					<a href={`/campaigns/filter/block/${created}`}> <Icon name='birthday' />{date}</a><br/>
					<a href={`/campaigns/admin/${owner}`}> <Icon name='at' />Creator Name</a><br/>
					<a href={`/campaigns/filter/block/${expiry}`}> <Icon name='tag' />{tags.join(', ')} </a><br/>
				</Card.Content>
			</Card>
		</Grid.Column>
	)

}

export default CampaignCard
