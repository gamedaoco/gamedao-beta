// control - a dao interface
// invoke and manage organisations on chain

import React, { useEffect, useState } from 'react'
import { useSubstrate } from '../../substrate-lib'

import { data as d } from '../lib/data'

import { Table, Header, Button, Container, Image } from 'semantic-ui-react'

import {
	// ipfs,
	// getJSON,
	gateway,
} from '../lib/ipfs'

const ListItem = ({ data }) => {

	const [ config, setConfig ] = useState()
	const [ imageURL, setImageURL ] = useState(null)

	useEffect(()=>{

		if ( !data.cid || data.cid==='cid' ) return

		fetch( gateway + data.cid )
			.then( res => res.text() )
			.then( txt => { setConfig(JSON.parse(txt)) })
			.catch( err => console.log( err ) )

	},[ data, setConfig ])

	useEffect(()=>{

		if ( !config ) return
		setImageURL( ( config.logo ) ? gateway+config.logo : null )

	},[ config ])


	const name = data.name
	const body = d.dao_bodies.filter( b => b.value === Number(data.body))[0].text
	const members = data.members
	const balance = 0
	const motions = 0
	const campaigns = 0

	if ( !config ) return null

	return (
		<Table.Row>
			<Table.Cell>
				<Header as='h4' image>
					<Image rounded src={ imageURL } />
					<Header.Content>
						{name}
						<Header.Subheader>{body}</Header.Subheader>
					</Header.Content>
				</Header>
			</Table.Cell>
			<Table.Cell>{members}</Table.Cell>
			<Table.Cell>{balance}</Table.Cell>
			<Table.Cell>{motions}</Table.Cell>
			<Table.Cell>{campaigns}</Table.Cell>
			<Table.Cell><Button size='mini'>Apply</Button></Table.Cell>
		</Table.Row>
	)

}

const ItemGrid = ({ data: { content } }) => {

	// const [ content, setContent ] = useState([])
	// if ( content !== data.content ) setContent(data.content)

	if ( !content ) return null
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
					{ content.map((d,i)=><ListItem key={i} data={d} />) }
				</Table.Body>
			</Table>
		</Container>
	)

}

export const Items = props => {
	const { api } = useSubstrate()

	const [ nonce, setNonce ] = useState()
	const [ hashes, setHashes ] = useState()
// eslint-disable-next-line
	const [ configs, setConfigs ] = useState([])
// eslint-disable-next-line
	const [ balances, setBalances ] = useState([])
// eslint-disable-next-line
	const [ members, setMembers ] = useState([])
	const [ content, setContent ] = useState()

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
	}, [nonce, api.query.gameDaoControl])

	useEffect(() => {
		if ( !hashes ) return
		// const query = api.query.gameDaoControl.body_by_hash
		const getContent = async args => {
			let _req = []
			try {
				for (var i = 0; i < args.length; i++) _req.push(api.query.gameDaoControl.bodies(args[i]))
				const res = await Promise.all(_req).then(_=>_.map((_c,_i)=>_c.toHuman()))
				setContent(res)
			} catch ( err ) {
				console.error( err )
			}
		}
		getContent(hashes)
	}, [hashes, api.query.gameDaoControl])

	useEffect(() => {
		if ( !hashes ) return
		const getContent = async args => {
			let _req = []
			try {
				for (var i = 0; i < args.length; i++) _req.push(api.query.gameDaoControl.bodyConfig(args[i]))
				const res = await Promise.all(_req).then(_=>_.map((_c,_i)=>_c.toHuman()))
				setConfigs(res)
			} catch ( err ) {
				console.error( err )
			}
		}
		getContent(hashes)
	}, [hashes, api.query.gameDaoControl])

	useEffect(() => {
		if ( !hashes || !content ) return
		const getContent = async args => {
			let _req = []
			try {
				for (var i = 0; i < args.length; i++) _req.push(api.query.gameDaoControl.bodyMembers(args[i]))
				const res = await Promise.all(_req).then(_=>_.map((_c,_i)=>{
					return { id: args[_i], members: _c.toHuman(), count: _c.toHuman().length }
				}))
				setMembers(res)
				setContent(
					content.map((c,i)=>{
						const m = res.filter( t => t.id === c.id )[0]
						return {
							...c,
							members_count: m.count,
							members: m.members
					}
				}))
			} catch ( err ) {
				console.error( err )
			}
		}
		getContent(hashes)
	}, [nonce, hashes, content, api.query.gameDaoControl])

	// useEffect(() => {
	// 	if ( !hashes || !content ) return
	// 	const getContent = async args => {
	// 		let _req = []
	// 		try {
	// 			for (var i = 0; i < args.length; i++) _req.push(api.query.gameDaoControl.bodyTreasury(args[i]))
	// 			const res = await Promise.all(_req).then(_=>_.map((_c,_i)=>{
	// 				return { id: args[_i], account: _c.toHuman(), balance: 1 }
	// 			}))
	// 			setBalances(res)
	// 			setContent(
	// 				content.map((c,i)=>{
	// 					const b = res.filter( t => t.id === c.id )[0]
	// 					return {
	// 						...c,
	// 						account: b.account,
	// 						balance: b.balance
	// 				}
	// 			}))
	// 		} catch ( err ) {
	// 			console.error( err )
	// 		}
	// 	}
	// 	getContent(hashes)
	// }, [nonce, hashes])

	return ( !content || ( content.length === 0 ) )
		?	<React.Fragment>
				<h1>Organizations</h1>
				<h3>No organizations yet. Create one!</h3>
			</React.Fragment>
		:	<React.Fragment>
				<h1>Organizations</h1>
				<h3>Total organizations: { nonce }</h3>
				<ItemGrid data={ { content,balances } } />
			</React.Fragment>

}

export default Items

//
//
//
