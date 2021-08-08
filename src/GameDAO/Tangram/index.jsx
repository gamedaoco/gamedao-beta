import React, { useEffect, useState } from 'react'

import { useSubstrate } from '../../substrate-lib'
import { Grid, Segment, Card, Button, Icon, Image } from 'semantic-ui-react'
import { data as d } from '../lib/data'
import { gateway } from '../lib/ipfs'
import config from '../../config'
const dev = config.dev

const Item = ({ hash }) => {

	const { api } = useSubstrate()

	const [ content, setContent ] = useState(null)

	// useEffect(() => {
	// 	if (!hash) return
	// 	const query = async () => {
	// 		try {
	// 			const [
	// 				config,
	// 			] = await Promise.all([
	// 				api.query.gameDaoTangram.bodyConfig(hash),
	// 			])
	// 			setContent({
	// 				...config.toHuman(),
	// 			})
	// 		} catch ( err ) {
	// 			console.error( err )
	// 		}
	// 	}
	// 	query()
	// }, [api, hash])

	if ( !content ) return null

	return (
		<Grid.Column mobile={16} tablet={8} computer={2}>
			<Segment vertical loading={isLoading}>
				<Card href={`https://ryse.exchange/${content.id}`} color={ ( content.owned === true ) ? 'pink': 'white'}>
					<Image src={content.imageURL} wrapped ui={false} />
					<Card.Content>
						<Card.Header>{content.name}</Card.Header>
						<Card.Meta>
							<span className='date'>{content.dob}</span>
						</Card.Meta>
					</Card.Content>
					<Card.Content extra>
						<a><Icon name='love' />{content.love}</a>
					</Card.Content>
				</Card>
			</Segment>
		</Grid.Column>
	)

}

const ItemGrid = ({ hashes, accountPair }) => {

	if ( !hashes ) return null

	return (
		<Container>
			<Grid stackable colums={8} >
				{
					hashes && hashes.map( ( itemHash, index ) => {
						return <CampaignCard hash={itemHash} accountPair={accountPair} />
					})
				}
			</Grid>
		</Container>
	)

}

export const Content = props => {

	const { api } = useSubstrate()
	const [ nonce, setNonce ] = useState()
	const [ hashes, setHashes ] = useState()

	// useEffect(() => {
	// 	let unsubscribe = null
	// 	api.query.gameDaoTangram.nonce(n => {
	// 		setNonce(n.toNumber())
	// 	}).then( unsub => {
	// 		unsubscribe = unsub
	// 	}).catch( console.error )
	// 	return () => unsubscribe && unsubscribe()
	// }, [api.query.gameDaoTangram])

	// useEffect(() => {
	// 	if ( !nonce ) return
	// 	const req = [...new Array(nonce)].map((a,i)=>i)
	// 	const queryHashes = async args => {
	// 		const hashes = await api.query.gameDaoTangram.creatureByNonce
	// 			.multi( args ).then( _ => _.map( _h => _h.toHuman() ))
	// 		setHashes(hashes)
	// 	}
	// 	queryHashes(req)
	// }, [nonce, api.query.gameDaoTangram])

	return ( !hashes || ( hashes.length === 0 ) )
		?	<React.Fragment>
				<h1>Tangram</h1>
				<h3>No Tangram has spawned yet.</h3>
			</React.Fragment>
		:	<React.Fragment>
				<h1>Tangram</h1>
				<h3>Spawned: { nonce }</h3>
				<ItemGrid hashes={hashes} accountPair={accountPair} />
			</React.Fragment>

}

export default function Module (props) {

	const { accountPair } = props
	const { api } = useSubstrate()

	return api && api.query.gameDaoTangram && accountPair
		? <Content {...props} />
		: null

}