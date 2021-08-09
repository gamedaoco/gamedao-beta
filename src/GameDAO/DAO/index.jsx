// control - a dao interface
// invoke and manage organisations on chain

import React, { useEffect, useState } from 'react'

import { useSubstrate } from '../../substrate-lib'
import { web3FromSource } from '@polkadot/extension-dapp'
import { encodeAddress } from '@polkadot/util-crypto'

import { data as d } from '../lib/data'

import { Icon, Pagination, Table, Header, Button, Container, Image } from 'semantic-ui-react'
import {
	BiJoystick,
	BiHomeCircle,
	BiListCheck,
	BiListPlus,
	BiCoinStack,
	BiCoin,
	BiPyramid,
	BiGame,
	BiPlus,
	BiDiamond,
	BiKey,
	BiLockAlt,
	BiLockOpenAlt,
	BiGlobe,
	BiGroup
} from "react-icons/bi";

import { gateway } from '../lib/ipfs'
import config from '../../config'
const dev = config.dev

//
//
//

const getFromAcct = async ( api, accountPair ) => {

	const { address, meta: { source, isInjected } } = accountPair
	let fromAcct
	if (isInjected) {
		const injected = await web3FromSource(source)
		fromAcct = address
		api.setSigner(injected.signer)
	} else {
		fromAcct = accountPair
	}
	return fromAcct

}

const addMember = async ( api, accountPair, id, target ) => {

	console.log( accountPair.address, id )

	target.disabled=true

	const payload = [ id, accountPair.address ]

	const from = await getFromAcct( api, accountPair )
	const tx = api.tx.gameDaoControl.addMember(...payload)
	const hash = await tx.signAndSend( from, ({ status, events }) => {
		console.log('Transaction status:', status.type);
		if(events.length) {
			events.forEach((record) => {
				const { event, phase } = record;
				const types = event.typeDef;

				// Show what we are busy with
				console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
				console.log(`\t\t${event.meta.documentation.toString()}`);

				// Loop through each of the parameters, displaying the type and data
				event.data.forEach((data, index) => {
					console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
				});

			})
			if (status.isFinalized) {
				console.log('Finalized block hash', status.asFinalized.toHex());
			}

		}
	})
	target.disabled=false
}

//
//
//

const defaultContent = {

}

const Item = ({ content, accountPair }) => {

	const { api } = useSubstrate()
	const [ itemContent, setItemContent ] = useState({})
	const [ metadata, setMetadata ] = useState({})
	const [ imageURL, setImageURL ] = useState(null)

	const updateContent = ( newContent ) => setItemContent({ ...itemContent, ...newContent })

	useEffect(()=>{
		if ( !content ) return
		updateContent(content)
	},[ content ])

	// get offchain data

	useEffect(()=>{
		if ( !itemContent.cid || itemContent.cid.length<3 ) return
		fetch( gateway + itemContent.cid )
			.then( res => res.text() )
			.then( txt => setMetadata(JSON.parse(txt)) )
			.catch( err => console.log( err ) )
	},[ itemContent ])

	// get project image

	useEffect(()=>{
		if ( !metadata ) return
		setImageURL( ( metadata.logo ) ? gateway + metadata.logo : null )
	},[ metadata ])

	// get onchain data

	useEffect(() => {

		if (!content) return
		const query = async () => {
			try {
				const [
					// config,
					controller,
					access,
					memberState,
					memberCount,
					treasury,
				] = await Promise.all([
					// api.query.gameDaoControl.bodyConfig(content.id),
					api.query.gameDaoControl.bodyController(content.id),
					api.query.gameDaoControl.bodyAccess(content.id),
					api.query.gameDaoControl.bodyMemberState([content.id, accountPair.address]),
					api.query.gameDaoControl.bodyMemberCount(content.id),
					api.query.gameDaoControl.bodyTreasury(content.id),
				])
				updateContent({
					// ...config.toHuman(),
					controller: controller.toHuman(),
					access: access.toHuman(),
					memberState: memberState.toHuman(),
					memberCount: memberCount.toHuman(),
					treasury: treasury.toHuman(),
				})
			} catch ( err ) {
				console.error( err )
			}
		}
		query()
	}, [api, content])

	// useEffect(() => {

	// 	if (!content.treasury) return

	// 	const query = async () => {
	// 		const unsub = await api.queryMulti([
	// 			[api.query.system.account, content.treasury],
	// 		], ([{ data: balance }]) => {
	// 			console.log(`----> treasury of ${balance.free}`);
	// 			setItemContent({
	// 				...itemContent,
	// 				treasuryBalance: balance.free
	// 			})
	// 		});
	// 	}
	// 	query()

	// }, [content, api.query.system.account])

	//
	//
	//

	const handleMembership = async (e) => {

		const op = e.target.value

		switch (op) {
			case '0':
				console.log('join')
				await addMember( api, accountPair, itemContent.id, e.target )
				// join
			return;
			case '1': console.log('apply')
				// apply for membership
			return;
			case '2': console.log('leave')
				// remove member
			return;
			default:
			return;
		}

	}

	const handleAdmin = () => console.log('admin')

	const buttonText = ['join','apply','leave']

	const isAdmin = () => ( accountPair.address === itemContent.controller ) ? true : false
	const isMember = () => ( itemContent.memberState > 0 ) ? true : false

	const Interactions = () => {

		const text = buttonText[ itemContent.access ]
		return (
			<>
				{ ( isMember() && !isAdmin() ) && <Button basic onClick={handleMembership} value={itemContent.access} size='mini'>{`leave`}</Button>}
				{ !isMember() && text && <Button primary onClick={handleMembership} value={itemContent.access} size='mini'>{`${text}`}</Button>}
				{ isAdmin() && <Button basic onClick={handleAdmin} size='mini'>settings</Button>}
			</>
		)
	}

	const bodyToText = () => d.dao_bodies.filter( b => b.value === Number(content.body))[0].text

	if ( !itemContent ) return null

	return (
		<Table.Row>
			<Table.Cell>
				<a onClick={()=>console.log(itemContent, metadata)}>
				<Header as='h4' image>
					<Image rounded src={ imageURL } />
					<Header.Content>
						{itemContent.name}
					<Header.Subheader>
						{bodyToText()}
					</Header.Subheader>
					</Header.Content>
				</Header>
				</a>
			</Table.Cell>
			<Table.Cell ><Container text>{metadata.description}</Container></Table.Cell>
			<Table.Cell>
					{ metadata.website && <a href={metadata.website} target="_blank"><BiGlobe/></a>}
			</Table.Cell>
			<Table.Cell textAlign='center'>{ (itemContent.access==='0') ? 'open' : <BiLockAlt/> }</Table.Cell>
			<Table.Cell>{itemContent.memberCount||0}</Table.Cell>
{/*
			<Table.Cell>{itemContent.treasuryBalance||0}</Table.Cell>
			<Table.Cell>{itemContent.motions||0}</Table.Cell>
			<Table.Cell>{itemContent.campaigns||0}</Table.Cell>
*/}
			<Table.Cell><Interactions/></Table.Cell>
		</Table.Row>
	)

}

const ItemList = props => {

	const {
		content,
		accountPair
	} = props

	const [ activePage, setActivePage ] = useState(1)
	const [ totalPages, setTotalPages ] = useState(0)
	const [ offset, setOffset ] = useState(0)
	const [ itemsPerPage, setItemsPerPage ] = useState(3)

	const iPP = [3,5,9,18,36,72]
	const handleShowMoreItems = () => setItemsPerPage( ( itemsPerPage < ( iPP.length - 1 ) ) ? itemsPerPage + 1 : itemsPerPage )
	const handleShowLessItems = () => setItemsPerPage( ( itemsPerPage > 0 ) ? itemsPerPage - 1 : 0 )

	useEffect(()=>{
		const _totalPages = Math.ceil( content.length / iPP[itemsPerPage] )
		setTotalPages( _totalPages )
		if ( activePage > _totalPages ) setActivePage( _totalPages )
	}, [content, itemsPerPage, activePage])

	const handlePaginationChange = (e, { activePage }) => {
		setActivePage(activePage)
		setOffset( ( activePage - 1 ) * iPP[itemsPerPage] )
	}

	if ( !content ) return null

		// console.log(activePage,totalPages,offset,itemsPerPage)

	return (
		<Container>
			<Container align='right'>
				<Button.Group>
					<Button icon onClick={handleShowLessItems}><Icon name='block layout' /></Button>
					<Button icon onClick={handleShowMoreItems}><Icon name='grid layout' /></Button>
				</Button.Group>
			</Container>
			<Table striped singleLine fixed>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell width='4'></Table.HeaderCell>
						<Table.HeaderCell width='6'>Description</Table.HeaderCell>
						<Table.HeaderCell width='1'><BiGlobe/></Table.HeaderCell>
						<Table.HeaderCell width='1'><BiLockAlt/></Table.HeaderCell>
						<Table.HeaderCell width='1'><BiGroup/></Table.HeaderCell>
{/*
						<Table.HeaderCell width='two'>Balance</Table.HeaderCell>
						<Table.HeaderCell>Motions</Table.HeaderCell>
						<Table.HeaderCell>Campaigns</Table.HeaderCell>
*/}
						<Table.HeaderCell/>
					</Table.Row>
				</Table.Header>
				<Table.Body>
				{	content.slice( offset, offset + iPP[itemsPerPage] - 1 )
					.map((d,i)=>{
						const _content = {
								...d,
							}
						return <Item key={offset + i}
							content={_content}
							accountPair={accountPair}
						/>
					})
				}
				</Table.Body>
			</Table>
			{ (totalPages >= 2) &&
				<Pagination
					onPageChange={handlePaginationChange}
					activePage={activePage}
					totalPages={totalPages}
					/>
			}
		</Container>
	)

}

export const Main = props => {
	const { api } = useSubstrate()
	const { accountPair } = props

	const [ nonce, setNonce ] = useState()
	const [ hashes, setHashes ] = useState()
// eslint-disable-next-line
	const [ configs, setConfigs ] = useState([])
// eslint-disable-next-line
	const [ balances, setBalances ] = useState([])
// eslint-disable-next-line
	const [ members, setMembers ] = useState([])
	const [ content, setContent ] = useState()
	const [ access, setAccess ] = useState([])

	// nonce

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

	// on nonce change get hashes

	useEffect(() => {
		if ( nonce === 0 ) return
		const req = [...new Array(nonce)].map((a,i)=>i)
		const queryHashes = async args => {
			const hashes = await api.query.gameDaoControl.bodyByNonce.multi( req ).then(_=>_.map(_h=>_h.toHuman()))
			setHashes(hashes)
		}
		queryHashes()
	}, [nonce, api.query.gameDaoControl])

	// on hashes get content

	useEffect(() => {
		if ( !hashes ) return
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

	// on hashes get config

	useEffect(() => {
		if ( !hashes ) return
		const getContent = async args => {
			let _req = []
			try {
				for (var i = 0; i < args.length; i++) _req.push(api.query.gameDaoControl.bodyConfig(args[i]))
				const res = await Promise.all(_req).then(_=>_.map((_c,_i) => {
					const _res = { id:args[_i], ..._c.toHuman() }
					return _res
				}))
				setConfigs(res)
				// console.log('configs', res)
			} catch ( err ) {
				console.error( err )
			}
		}
		getContent(hashes)
	}, [hashes, api.query.gameDaoControl])

	// useEffect(() => {

	// 	if ( !hashes ) return

	// 	const getMemberCount = async args => {
	// 		let _req = []
	// 		try {
	// 			for (var i = 0; i < args.length; i++) _req.push(api.query.gameDaoControl.bodyMemberCount(args[i]))
	// 			const res = await Promise.all(_req).then(_=>_.map((_c,_i)=> {
	// 				// console.log( 'members',_c.toHuman() )
	// 				return { id: args[_i], count: _c.toHuman() }
	// 			}))
	// 			setMembers(res)
	// 		} catch ( err ) {
	// 			console.error( err )
	// 		}
	// 	}
	// 	getMemberCount(hashes)

	// }, [hashes, api.query.gameDaoControl])

	// useEffect(() => {

	// 	if ( !hashes ) return

	// 	const getMembershipState = async args => {
	// 		let _req = []
	// 		try {
	// 			for (var i = 0; i < args.length; i++) _req.push( api.query.gameDaoControl.bodyMemberState( ( args[i], accountPair ) ) )
	// 			const res = await Promise.all(_req).then(_=>_.map((_c,_i)=>{
	// 				const _res = { id: args[_i], state: _c.toHuman() }
	// 				// console.log(_res)
	// 				return _res
	// 			}))
	// 			setMembers(res)
	// 		} catch ( err ) {
	// 			console.error( err )
	// 		}
	// 	}
	// 	getMembershipState(hashes)

	// }, [hashes, api.query.gameDaoControl, accountPair])

	// useEffect(() => {
	// 	if ( !hashes ) return
	// 	const getContent = async args => {
	// 		let _req = []
	// 		try {
	// 			for (var i = 0; i < args.length; i++) _req.push(api.query.gameDaoControl.bodyTreasury(args[i]))
	// 			const res = await Promise.all(_req).then(_=>_.map((_c,_i)=>{
	// 				return { id: args[_i], treasury: _c.toHuman(), balance: 1 }
	// 			}))
	// 			setBalances(res)
	// 		} catch ( err ) {
	// 			console.error( err )
	// 		}
	// 	}
	// 	getContent(hashes)
	// }, [hashes, api.query.gameDaoControl])

	// useEffect(() => {
	// 	if ( !hashes ) return
	// 	const getContent = async args => {
	// 		let _req = []
	// 		try {
	// 			for (var i = 0; i < args.length; i++) _req.push(api.query.gameDaoControl.bodyAccess(args[i]))
	// 			const res = await Promise.all(_req).then(_=>_.map((_c,_i)=>{
	// 				const _res = { id: args[_i], access: _c.toHuman() }
	// 				// console.log(_res)
	// 				return _res
	// 			}))
	// 			setAccess(res)
	// 		} catch ( err ) {
	// 			console.error( err )
	// 		}
	// 	}
	// 	getContent(hashes)
	// }, [hashes, api.query.gameDaoControl])

	return ( !content || nonce === 0 )
		?	<React.Fragment>
				<h1>Organizations</h1>
				<h3>No organizations yet. Create one!</h3>
			</React.Fragment>
		:	<React.Fragment>
				<h1>Organizations</h1>
				<h3>Total organizations: { nonce }</h3>
				<ItemList
					content={content}
					configs={configs}
					members={members}

					accountPair={accountPair}
				/>
			</React.Fragment>

}

export default function Module (props) {

	const { accountPair } = props
	const { api } = useSubstrate()

	return api && api.query.gameDaoControl && accountPair
		? <Main {...props} />
		: null

}
//
//
//
