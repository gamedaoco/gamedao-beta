/**
 _______________________________ ________
 \____    /\_   _____/\______   \\_____  \
	 /     /  |    __)_  |       _/ /   |   \
	/     /_  |        \ |    |   \/    |    \
 /_______ \/_______  / |____|_  /\_______  /
				 \/        \/         \/         \/
 Z  E  R  O  .  I  O     N  E  T  W  O  R  K
 © C O P Y R I O T   2 0 7 5   Z E R O . I O
**/

import React, { useEffect, useState } from 'react'
import { useSubstrate } from '../../substrate-lib'
import { TxButton } from '../../substrate-lib/components'

import { Button, Modal, Rating, Search, Container, Segment, Tab, Form, Input, Grid, Card, Statistic, Divider, Icon, Image } from 'semantic-ui-react'

//
// globals
// TODO: migrate to typescript
// TODO: generalise and move to lib
//

const CampaignProtocol = {
	0 : 'GRANT',   // get money from donators and or gamedao treasury
	1 : 'PREPAID', // raise money which will be released based on milestones or dao governance
	2 : 'LOAN',    // get a loan from individuals and or gamedao treasury, interest applies.
	3 : 'SHARE',   // raise money for n shares of your project
	4 : 'DAO',     // raise money which resides in a treasury and is released based on requests
}

const CampaignGovernance = {
	0 : 'DEFAULT',
	1 : 'DAO',
}

const blocksToTime = blocks => {
	const ss = blocks * 6
	const mm = blocks / 60
	const hh = mm / 60
	const dd = hh / 24
	return `${dd}:${hh}:${mm}:${ss}`
}

//
// modal component
//

const TransactionModal = props => {

	const {
		campaign_name,
		campaign_hash
	} = props

	const modalReducer = ( state, action ) => {
		switch ( action.type ) {
			case 'OPEN_MODAL':
				return { open: true, dimmer: action.dimmer }
			case 'CLOSE_MODAL':
				return { open: false }
			default:
				throw new Error()
		}
	}

	const modalDimmer = () => {
		const [state, dispatch] = React.useReducer(
			exampleReducer,
			{
				open: false,
				dimmer: undefined,
			}
		)
	}

	const [ visible, setVisible] = useState(false)

	return (
		<Modal
			open={visible}
			onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
			>
			<Modal.Header>
				Support {campaign_name}
			</Modal.Header>
			<Modal.Content>
				Let Google help apps determine location. This means sending anonymous
				location data to Google, even when no apps are running.
			</Modal.Content>
			<Modal.Actions>
				<Button negative onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>
					Disagree
				</Button>
				<Button positive onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>
					Agree
				</Button>
			</Modal.Actions>
		</Modal>
	)
}

//
// card component
// requires: data
//

const CampaignCard = props => {

	const { data } = props

	// blocktime to utc
	// todo: move to utils

	// const blocksRemain = ( data.expiry - data.created )
	const protocol = CampaignProtocol[data.protocol]
	const governance = data.governance

	console.log(data)
	// const remaining = blocksToTime(data.expiry) - new Date().now()
	// console.log('update',Date.now())
	//
	//
	const tags = ['game','2d','pixel','steam']
	const views = Math.floor(Math.random()*10000)
	const backers = Math.floor(Math.random()*1000)

	// icon type based on supporters
	const icon = backers => {
		if (backers > 10000) return 'fire'
		if (backers > 1000) return 'heart'
		if (backers > 100) return 'peace'
		return 'plus circle'
	}

	return (
		<Grid.Column mobile={16} tablet={8} computer={4}>
			<Card color={(governance==1)?'pink':'teal'}>
				<Image src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg' wrapped ui={true} />
				<Card.Content>
					<Card.Header><a href={`/campaigns/${data.id}`}>{data.name}</a></Card.Header>
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
					<a href={`/campaigns/admin/${data.admin}`}> <Icon name='eye' />{views} views.</a><br/>
					<a href={`/campaigns/admin/${data.admin}`}> <Icon name={icon} />{backers} backers.</a><br/>
					<a href={`/campaigns/filter/block/${data.expiry}`}> <Icon name='money bill alternate' />{data.cap} raised.</a><br/>
					<a href={`/campaigns/filter/block/${data.expiry}`}> <Icon name='money bill alternate outline' />{data.cap} target.</a><br/>
					<br/>
					<a href={`/campaigns/filter/block/${data.created}`}> <Icon name='birthday' />{data.created}</a><br/>
					<a href={`/campaigns/admin/${data.owner}`}> <Icon name='at' />Creator Name</a><br/>
					<a href={`/campaigns/filter/block/${data.expiry}`}> <Icon name='tag' />{tags.join(', ')} </a><br/>
				</Card.Content>
			</Card>
		</Grid.Column>
	)

}

//
// grid component
// requires: campaigns
//

const CampaignGrid = props => {

	const { campaigns } = props
	const [ content, setContent ] = useState([])

	if ( !campaigns ) return <div>No campaigns yet. Create one!</div>
	if ( content !== campaigns ) setContent( campaigns )

	return (
		<Container>
			<Grid stackable colums={5} >
					{
						content.map((data,index)=><CampaignCard key={index} data={data}/>)
					}
			</Grid>
		</Container>
	)

}

//
// campaigns component
// requires: api, accountpair
// queries / subscribes to chain
// TODO: subscriptions to event maybe more efficient
// than watching the state
//

export const Campaigns = props => {

	const { api } = useSubstrate()
	const { accountPair, accountAddress } = props
	const [ hashes, setHashes ] = useState()
	const [ campaigns, setCampaigns ] = useState()
	const [ contributions, setContributions ] = useState()
	const [ state, setState ] = useState({
		nonce: 0,
		all: 0,
		owned: 0,
		contributed: 0,
		// time: 0,
		// block: 0,
	})

	// get campaigns by index
	//

	const query = api.query.gameDaoCrowdfunding

	useEffect(() => {

		if (!accountPair) return
		let unsubscribe

		const subscribe = async () => {

			let nonce
			query.campaignsCount( nonce => {

				const _state = {
					...state,
					nonce: nonce.toNumber()
				}
				setState( _state )
				// console.log('nonce',nonce.toNumber())

			}).then(unsub => {
				unsubscribe = unsub;
			}).catch(console.error);

		}
		subscribe()

		return () => unsubscribe && unsubscribe()

	}, [query.nonce, accountPair])

	useEffect(() => {

		if (!accountPair) return

		let unsubscribe;

		const subscribe = async () => {

			let all, contributed, owned

			api.queryMulti([
				query.campaignsCount,
				[query.campaignsContributedCount, accountPair.address],
				[query.campaignsOwnedCount, accountPair.address],
				// api.query.timestamp.now,
			],([all,contributed,owned,time]) => {

				const _state = {
					...state,
					all: all.toNumber(),
					contributed: contributed.toNumber(),
					owned: owned.toNumber(),
					// time: time.toNumber(),
				}
				setState( _state )

			}).then(unsub => {
				unsubscribe = unsub;
			}).catch(console.error);

		}
		subscribe()

		return () => unsubscribe && unsubscribe()

	}, [accountPair])

	useEffect(() => {

		if ( state.nonce === 0 ) return

		const nonce = state.nonce
		const req = [...new Array(nonce)].map((a,i)=>i)

		const queryHashes = async args => {
			const hashes = await query.campaignsArray.multi( req ).then(_=>_.map(_h=>_h.toHuman()))
			setHashes(hashes)
		}
		queryHashes()

	}, [state])

	useEffect(() => {

		if ( !hashes ) return

		// get campaign description
		const queryCampaigns = async args => {
			let _req = []
			try {
				for (var i = 0; i < args.length; i++) _req.push(api.query.gameDaoCrowdfunding.campaigns(args[i]))
				const _campaigns = await Promise.all(_req).then(_=>_.map(_c=>_c.toHuman()))
				setCampaigns(_campaigns)
				console.log(campaigns)
			} catch ( err ) {
				console.error( err )
			}
		}

		// get contributions
		// const queryContributions = async args => {
		// 	const query = api.query.gameDaoCrowdfunding.campaignBalance
		// 	let req = []
		// 	try {
		// 		for ( var i = 0; i < args.length; i++ ) req.push( query(hashes[i]) )
		// 		const res = ( await Promise.all( req ) )
		// 		setContributions( res )
		// 	} catch ( err ) {
		// 		console.error( err )
		// 	}
		// }

		// kick it
		queryCampaigns(hashes)
		// queryContributions(hashes)

	}, [hashes])

	return (
		<div>
			<h3>Total Campaigns: { state.all }</h3>
			<CampaignGrid campaigns={campaigns}/>
		</div>
	)

}

export default Campaigns

//
//
//
