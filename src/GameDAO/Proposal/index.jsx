// control - a dao interface
// invoke and manage organisations on chain

import React, { useEffect, useState } from 'react'
import { useSubstrate } from '../../substrate-lib'

import { data as d } from '../lib/data'

import { Table, Header, Button, Container, Image } from 'semantic-ui-react'

import { gateway } from '../lib/ipfs'
import config from '../../config'
const dev = config.dev

// ui list item

const Item = ({ content }) => {

	// should be the image of the associated org
	const [ imageURL, setImageURL ] = useState(null)

	// const [ config, setConfig ] = useState()
	// const [ itemContent, setItemContent ] = useState()

	// useEffect(()=>{
	// 	if ( !content || content.cid==='' ) return
	// 	if (dev) console.log('fetch config', content.cid)
	// 	fetch( gateway + content.cid )
	// 		.then( res => res.text() )
	// 		.then( txt => { setConfig(JSON.parse(txt)) })
	// 		.catch( err => console.log( err ) )
	// },[ content ])

	// useEffect(()=>{
	// 	if ( !config ) return
	// 	setImageURL( ( config.logo ) ? gateway + config.logo : null )
	// },[ config ])

	// useEffect(()=>{
	// 	if ( !content ) return
	// 	if (dev) console.log('load')
	// 	if (dev) console.log(members)
	// 	// merge module content with other metrics
	// 	// should move to storage/graph on refactor
	// 	setItemContent({
	// 		name: content.name,
	// 		body: d.dao_bodies.filter( b => b.value === Number(content.body))[0].text,
	// 		members: members.count,
	// 		balance: 0,
	// 		motions: 0,
	// 		campaigns: 0,
	// 	})
	// },[ content, members ])

	if ( !content ) return null
		console.log(content)

	return (
		<Table.Row>
			<Table.Cell>
				<Header as='h4' image>
					<Image rounded src={ imageURL } />
					<Header.Content>
						{content.name}
						<Header.Subheader>{content.body}</Header.Subheader>
					</Header.Content>
				</Header>
			</Table.Cell>
			<Table.Cell>{content.purpose}</Table.Cell>
			<Table.Cell>{content.amount}</Table.Cell>
			<Table.Cell>{content.expiry}</Table.Cell>
			<Table.Cell>{content.status}</Table.Cell>
			<Table.Cell>0/0</Table.Cell>
			<Table.Cell><Button color='green' size='mini'>Ack</Button><Button size='mini' color='red'>Nack</Button></Table.Cell>
		</Table.Row>
	)

}

// ui list

const ItemList = ({ data: { content } }) => {

	if ( !content ) return null

	return (
		<Container>
			<Table  striped singleLine>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Entity</Table.HeaderCell>
						<Table.HeaderCell>Purpose</Table.HeaderCell>
						<Table.HeaderCell>Amount</Table.HeaderCell>
						<Table.HeaderCell>Expiry</Table.HeaderCell>
						<Table.HeaderCell>Status</Table.HeaderCell>
						<Table.HeaderCell>Votes</Table.HeaderCell>
						<Table.HeaderCell>Actions</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{ content.map((item,i)=><Item key={i} content={item} />) }
				</Table.Body>
			</Table>
		</Container>
	)

}

export const Items = props => {

	const { api } = useSubstrate()

	const [ nonce, setNonce ] = useState()
	const [ hashes, setHashes ] = useState()
	const [ content, setContent ] = useState()

	// nonce

	useEffect(() => {

		let unsubscribe = null

		api.query.gameDaoGovernance.nonce(n => {
			setNonce(n.toNumber())
		}).then( unsub => {
			unsubscribe = unsub
		}).catch( console.error )

		return () => unsubscribe && unsubscribe()

	}, [api.query.gameDaoGovernance])

	// hashes

	useEffect(() => {
		if ( !nonce ) return
		const req = [...new Array(nonce)].map((a,i)=>i)
		const queryHashes = async args => {
			const hashes = await api.query.gameDaoGovernance.proposalsArray
				.multi( args ).then( _ => _.map( _h => _h.toHuman() ))
			setHashes(hashes)
		}
		queryHashes(req)
	}, [nonce, api.query.gameDaoGovernance])

	// proposals

	useEffect(() => {
		if ( !hashes ) return
		const query = api.query.gameDaoGovernance.proposals
		const getContent = async args => {
			const content = await api.query.gameDaoGovernance.proposals
				.multi( args ).then( _ => _.map( _h => _h.toHuman() ))
			setContent(content)
		}
		getContent(hashes)
	}, [hashes, api.query.gameDaoGovernance])

	// get organizations for hashes
	// filter hashes where user is member

	// group by organization
	// dropdown to select organization

	return ( !content || ( content.length === 0 ) )
		?	<React.Fragment>
				<h1>Proposals</h1>
				<h3>No proposals yet. Create one!</h3>
			</React.Fragment>
		:	<React.Fragment>
				<h1>Proposals</h1>
				<h3>Total proposals: { nonce }</h3>
				<ItemList data={ { content } } />
			</React.Fragment>

}

export default function Module (props) {

	const { accountPair } = props
	const { api } = useSubstrate()

	return api && api.query.gameDaoGovernance && accountPair
		? <Items {...props} />
		: null

}

//
//
//
