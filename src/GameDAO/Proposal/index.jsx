// control - a dao interface
// invoke and manage organisations on chain

import React, { useEffect, useState } from 'react'
import { useSubstrate } from '../../substrate-lib'

import { data as d } from '../lib/data'

import { Table, Header, Button, Container, Image } from 'semantic-ui-react'

import { gateway } from '../lib/ipfs'
import config from '../../config'
const dev = config.dev

const ListItem = ({ data: { content, members } }) => {

	const [ config, setConfig ] = useState()
	const [ itemContent, setItemContent ] = useState()
	const [ imageURL, setImageURL ] = useState(null)

	useEffect(()=>{
		if ( !content || content.cid==='' ) return
		if (dev) console.log('fetch config', content.cid)
		fetch( gateway + content.cid )
			.then( res => res.text() )
			.then( txt => { setConfig(JSON.parse(txt)) })
			.catch( err => console.log( err ) )
	},[ content ])

	useEffect(()=>{
		if ( !config ) return
		setImageURL( ( config.logo ) ? gateway + config.logo : null )
	},[ config ])

	useEffect(()=>{
		if ( !content || !members ) return
		if (dev) console.log('load')
		if (dev) console.log(members)
		// merge module content with other metrics
		// should move to storage/graph on refactor
		setItemContent({
			name: content.name,
			body: d.dao_bodies.filter( b => b.value === Number(content.body))[0].text,
			members: members.count,
			balance: 0,
			motions: 0,
			campaigns: 0,
		})
	},[ content, members ])

	if ( !itemContent ) return null

	return (
		<Table.Row>
			<Table.Cell>
				<Header as='h4' image>
					<Image rounded src={ imageURL } />
					<Header.Content>
						{itemContent.name}
						<Header.Subheader>{itemContent.body}</Header.Subheader>
					</Header.Content>
				</Header>
			</Table.Cell>
			<Table.Cell>{itemContent.members}</Table.Cell>
			<Table.Cell>{itemContent.balance}</Table.Cell>
			<Table.Cell>{itemContent.motions}</Table.Cell>
			<Table.Cell>{itemContent.campaigns}</Table.Cell>
			<Table.Cell><Button size='mini'>Apply</Button></Table.Cell>
		</Table.Row>
	)

}

const ItemGrid = ({ data: { content, members } }) => {

	// const [ content, setContent ] = useState([])
	// if ( content !== data.content ) setContent(data.content)

	if ( !content ) return null

	if (dev) console.log('grid')

	return (
		<Container>
			<Table  striped singleLine>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell/>
						<Table.HeaderCell>Members</Table.HeaderCell>
						<Table.HeaderCell>Balance</Table.HeaderCell>
						<Table.HeaderCell>Motions</Table.HeaderCell>
						<Table.HeaderCell>Campaigns</Table.HeaderCell>
						<Table.HeaderCell/>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{ content.map((d,i)=><ListItem key={i} data={{
						content: d,
						members: members && members.filter( _ => _.id === d.id )[ 0 ]
					}} />) }
				</Table.Body>
			</Table>
		</Container>
	)

}

export const Items = props => {
	const { api } = useSubstrate()

	const [ nonce, setNonce ] = useState()
	const [ hashes, setHashes ] = useState()
	const [ proposals, setProposals ] = useState()

	// nonce

	useEffect(() => {
		let unsubscribe = null
		api.query.gameDaoGovernance.nonce(n => {
			if (n.isNone) {
				setNonce('<None>')
			} else {
				setNonce(n.toNumber())
			}
		}).then(unsub => {
			unsubscribe = unsub
		}).catch(console.error)
		return () => unsubscribe && unsubscribe()

	}, [api.query.gameDaoGovernance])

	// all hashes

	useEffect(() => {
		if ( nonce === 0 ) return
		const req = [...new Array(nonce)].map((a,i)=>i)
		const queryHashes = async args => {
			const hashes = await api.query.gameDaoGovernance.proposals.multi( req ).then(_=>_.map(_h=>_h.toHuman()))
			setHashes(hashes)
		}
		queryHashes()
	}, [nonce, api.query.gameDaoGovernance])

	// all proposals

	useEffect(() => {
		if ( !hashes ) return
		// const query = api.query.gameDaoControl.body_by_hash
		const getContent = async args => {
			let _req = []
			try {
				for (var i = 0; i < args.length; i++) _req.push(api.query.gameDaoGovernance.proposals(args[i]))
				const res = await Promise.all(_req).then(_=>_.map((_c,_i)=>_c.toHuman()))
				// TODO: group proposals by hash
				// { id: hash, proposals: [ proposal ] }
				setProposals(res)
			} catch ( err ) {
				console.error( err )
			}
		}
		getContent(hashes)
	}, [hashes, api.query.gameDaoGovernance])

	// get organizations for hashes
	// filter hashes where user is member

	// group by organization
	// dropdown to select organization

	return ( !proposals || ( proposals.length === 0 ) )
		?	<React.Fragment>
				<h1>Proposals</h1>
				<h3>No proposals yet. Create one!</h3>
			</React.Fragment>
		:	<React.Fragment>
				<h1>Proposals</h1>
				<h3>Total proposals: { nonce }</h3>
				<ItemGrid data={ { proposals } } />
			</React.Fragment>

}

export default Items

//
//
//
