// control - a dao interface
// invoke and manage organisations on chain

import React, { useEffect, useState } from 'react'
import { useSubstrate } from '../../substrate-lib'
import { TxButton } from '../../substrate-lib/components'

import { Pagination, Button, Modal, Rating, Search, Container, Segment, Tab, Form, Input, Grid, Card, Statistic, Divider, Icon, Image } from 'semantic-ui-react'

const ItemCard = ({ data }) => {

	return (
		<Grid.Column mobile={16} tablet={8} computer={4}>
			<Card color={(state==1)?'green':'red'}>
				<Card.Content>
					<Card.Header><a href={`/daos/${data.id}`}>{data.name}</a></Card.Header>
					<Card.Meta>
						<Rating icon='star' defaultRating={3} maxRating={5} />
					</Card.Meta>
					<Card.Description>
						{data.cid}
					</Card.Description>
				</Card.Content>
				<Card.Content extra>
				<Button size='mini' positive>apply</Button>
				</Card.Content>
			</Card>
		</Grid.Column>
	)

}

const ItemGrid = ({ data }) => {

	const [ content, setContent ] = useState([])

	if ( !data ) return <div>No organizations exist yet. Create one!</div>
	if ( content !== data ) setContent( data )

	return (
		<Container>
			<Grid stackable colums={5} >
				{ content.map((d,i)=><ItemCard key={i} data={d}/>) }
			</Grid>
		</Container>
	)

}

export const Items = props => {

	const { api } = useSubstrate()
	const { accountPair, accountAddress } = props

	const [ nonce, setNonce ] = useState()
	const [ hashes, setHashes ] = useState()
	const [ daos, setDaos ] = useState()
	const [ members, setMembers ] = useState()

	useEffect(() => {
		let unsubscribe = null
		api.query.gameDaoControl.nonce(n => {
			if (n.isNone) {
				setNonce('<None>')
			} else {
				setNonce(n.toNumber())
			}
		}).then(unsub => {
			unsubscribe = unsub
		}).catch(console.error)
		return () => unsubscribe && unsubscribe()

	}, [api.query.gameDaoControl])

	useEffect(() => {
		if ( nonce === 0 ) return
		const req = [...new Array(nonce)].map((a,i)=>i)
		const queryHashes = async args => {
			const hashes = await api.query.gameDaoControl.bodyByNonce.multi( req ).then(_=>_.map(_h=>_h.toHuman()))
			setHashes(hashes)
		}
		queryHashes()
	}, [nonce])

	return (
		<div>
			<h3>Total organizations: { nonce }</h3>

			{ hashes && hashes.map((h,i)=><div key={i}>{(i+1)}. {h}</div>)}

		</div>
	)

}

export default Items

//
//
//
