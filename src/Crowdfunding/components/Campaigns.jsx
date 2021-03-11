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
	const { accountPair } = props
	const [ hashes, setHashes ] = useState()
	const [ campaigns, setCampaigns ] = useState()
	const [ state, setState ] = useState({
		all: 0,
		owned: 0,
		contributed: 0,
		time: 0,
		block: 0,
	})

	useEffect(() => {

		if (!accountPair) return

		const asyncSubscription = async () => {

			let unsubscribe;
			let all, contributed, owned

			api.queryMulti([
				api.query.gameDao.allCampaignsCount,
				[api.query.gameDao.contributedCampaignsCount,accountPair.address],
				[api.query.gameDao.ownedCampaignsCount,accountPair.address],
				api.query.timestamp.now,
				// api.derive.chain.bestNumber,
			],([all,contributed,owned,time,block]) => {

				const _state = {
					...state,
					all: all.toNumber(),
					contributed: contributed.toNumber(),
					owned: owned.toNumber(),
					time: time.toNumber(),
					// block: block.toNumber(),
				}
				setState( _state )

			}).then(unsub => {
				unsubscribe = unsub;
			}).catch(console.error);

			return () => unsubscribe && unsubscribe()
		}

		asyncSubscription()

	}, [api.query.gameDao.allCampaignsCount, accountPair])

	useEffect(() => {

		if ( !accountPair ) return

		// collect campaign hashes
		const getHashes = async () => {
			let _req = []
			try {
				for (var i = 0; i < state.all; i++) { _req.push(api.query.gameDao.allCampaignsArray(i)) }
				const _hashes = await Promise.all(_req).then(_=>_.map(_h=>_h.toHuman()))
				getCampaigns(_hashes)
				getContributions(_hashes)
			} catch ( err ) {
				console.error( err )
			}
		}

		// get campaign description
		const getCampaigns = async args => {
			let _req = []
			try {
				for (var i = 0; i < args.length; i++) _req.push(api.query.gameDao.campaigns(args[i]))
				const _campaigns = await Promise.all(_req).then(_=>_.map(_c=>_c.toHuman()))
				setCampaigns(_campaigns)
				console.log(campaigns)
			} catch ( err ) {
				console.error( err )
			}
		}

		// get campaign meta data
		const getMeta = async args => {
			console.log('args',args)
			let _req = []
			try {
				for (var i = 0; i < args.length; i++) _req.push(api.query.gameDao.campaigns(args[i]))
				const _campaigns = await Promise.all(_req).then(_=>_.map(_c=>_c.toHuman()))
				setCampaigns(_campaigns)
			} catch ( err ) {
				console.error( err )
			}
		}

		// get contributions
		const getContributions = async args => {
			const query = api.query.gameDao.totalContributions
			let req = []
			try {
				for ( var i = 0; i < args.length; i++ ) req.push( query(hashes[i]) )
				const res = ( await Promise.all( req ) )
				setContributions( res )
			} catch ( err ) {
				console.error( err )
			}

		}

		// kick it
		getHashes()

	}, [state.all])

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
