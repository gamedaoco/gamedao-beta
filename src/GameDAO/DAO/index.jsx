// control - a dao interface
// invoke and manage organisations on chain

import React, { useEffect, useState } from 'react'
import { useSubstrate } from '../../substrate-lib'

import { Table, Header, Button, Container, Image } from 'semantic-ui-react'
import { data as d } from '../lib/data'

const ListItem = ({ data }) => {

	const imageURL = `https://ipfs.infura.io/ipfs/${data.cid}`
	const name = data.name
	const body = d.dao_bodies.filter( b => b.value === Number(data.body))[0].text

	return (
		<Table.Row>
			<Table.Cell>
				<Header as='h4' image>
					<Image rounded src={imageURL} />
					<Header.Content>
						{name}
						<Header.Subheader>{body}</Header.Subheader>
					</Header.Content>
				</Header>
			</Table.Cell>
			<Table.Cell>{data.member_count}</Table.Cell>
			<Table.Cell>0</Table.Cell>
			<Table.Cell>0</Table.Cell>
			<Table.Cell>0</Table.Cell>
			<Table.Cell><Button size='mini'>Join</Button></Table.Cell>
		</Table.Row>
	)

}

const ItemGrid = ({ data }) => {

	const [ content, setContent ] = useState([])

	if ( !data.content ) return <div>No organizations exist yet. Create one!</div>
	if ( content !== data.content ) setContent(data.content)

	return (
		<Container>
			<Table celled striped>
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
	const [ configs, setConfigs ] = useState()
	const [ balances, setBalances ] = useState()
	const [ members, setMembers ] = useState()
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

	// useEffect(() => {
	// 	if ( !hashes ) return
	// 	const getContent = async args => {
	// 		let _req = []
	// 		try {
	// 			for (var i = 0; i < args.length; i++) _req.push(api.query.gameDaoControl.bodyConfig(args[i]))
	// 			const res = await Promise.all(_req).then(_=>_.map((_c,_i)=>_c.toHuman()))
	// 			setConfigs(res)
	// 		} catch ( err ) {
	// 			console.error( err )
	// 		}
	// 	}
	// 	getContent(hashes)
	// }, [hashes])

	// useEffect(() => {
	// 	if ( !hashes || !content ) return
	// 	const getContent = async args => {
	// 		let _req = []
	// 		try {
	// 			for (var i = 0; i < args.length; i++) _req.push(api.query.gameDaoControl.bodyMembers(args[i]))
	// 			const res = await Promise.all(_req).then(_=>_.map((_c,_i)=> [ args[_i], _c.toHuman() ] ))
	// 			// setMembers(res)
	// 			setContent(
	// 				content.map((c,i)=>{
	// 					const count = res.filter(t=>t[0]===c.id)[0][1] || 0
	// 					console.log(count, i)
	// 					return {
	// 						...c,
	// 						member_count: count
	// 				}
	// 			}))
	// 		} catch ( err ) {
	// 			console.error( err )
	// 		}
	// 	}
	// 	getContent(hashes)
	// }, [hashes])

	// TODO: get balances

	return (
		<div>
			<h3>Total organizations: { nonce }</h3>
			{ content && <ItemGrid data={{content}} /> }

		</div>
	)

}

export default Items

//
//
//
