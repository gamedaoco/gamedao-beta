import React, { useEffect, useState } from 'react'

import { useWallet } from 'src/context/Wallet'

// import { Grid, Segment, Card, Button, Icon, Image, Transition } from 'semantic-ui-react'
import { data as d } from '../lib/data'
import { gateway } from '../lib/ipfs'
import config from '../../config'
import { useApiProvider } from '@substra-hooks/core'
const dev = config.dev

// seems not to be used
/*
const Item = ({ hash }) => {
	// const { address, } = useWallet()

	const [content, setContent] = useState(null)

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

	if (!content) return null

	return (
		<Grid.Column mobile={16} tablet={8} computer={2}>
			<Segment vertical loading={isLoading}>
				<Card
					href={`https://ryse.exchange/${content.id}`}
					color={content.owned === true ? 'pink' : 'white'}
				>
					<Image src={content.imageURL} wrapped ui={false} />
					<Card.Content>
						<Card.Header>{content.name}</Card.Header>
						<Card.Meta>
							<span className="date">{content.dob}</span>
						</Card.Meta>
					</Card.Content>
					<Card.Content extra>
						<a>
							<Icon name="love" />
							{content.love}
						</a>
					</Card.Content>
				</Card>
			</Segment>
		</Grid.Column>
	)
}

const ItemGrid = ({ hashes }) => {
	if (!hashes) return null

	return (
		<Container>
			<Box stackable colums={8}>
				{hashes &&
					hashes.map((itemHash, index) => {
						return <CampaignCard hash={itemHash} />
					})}
			</Box>
		</Container>
	)
}
*/

export const Content = (props) => {
	const apiProvider = useApiProvider()

	// every org runs on its own realm
	// classes exist in realms, where
	// class 0 is by default the tangram class
	// items live in classes and can possess
	// various attributes

	const [realms, setRealms] = useState()
	const [classes, setClasses] = useState()
	const [items, setItems] = useState()

	const [total, setTotal] = useState()

	useEffect(() => {
		let unsubscribe = null
		apiProvider.query.gameDaoTangram
			.total((n) => {
				setTotal(n.toNumber())
			})
			.then((unsub) => {
				unsubscribe = unsub
			})
			.catch(console.error)
		return () => unsubscribe && unsubscribe()
	}, [apiProvider.query.gameDaoTangram])

	// useEffect(() => {
	// 	if ( !nonce ) return
	// 	const req = [...new Array(nonce)].map((a,i)=>i)
	// 	const queryHashes = async args => {
	// 		const hashes = await apiProvider.query.gameDaoTangram.creatureByNonce
	// 			.multi( args ).then( _ => _.map( _h => _h.toHuman() ))
	// 		setHashes(hashes)
	// 	}
	// 	queryHashes(req)
	// }, [nonce, apiProvider.query.gameDaoTangram])

	return !total || total === 0 ? (
		<React.Fragment>
			<h1>Tangram</h1>
			<h3>No Tangram has spawned yet.</h3>
		</React.Fragment>
	) : (
		<React.Fragment>
			<h1>Tangram</h1>
			<h3>Spawned: {total}</h3>
			{/*<ItemGrid hashes={hashes} />*/}
		</React.Fragment>
	)
}

export default function Module(props) {
	const apiProvider = useApiProvider()

	return apiProvider && apiProvider.query.gameDaoTangram ? <Content {...props} /> : null
}
