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

import  CampaignGrid from './CampaignGrid'

//
// campaigns component
// requires: api, accountpair
// queries / subscribes to chain
// TODO: subscriptions to event maybe more efficient
// than watching the state
//

export const Campaigns = props => {

	const { api } = useSubstrate()
	// const { accountPair } = props

	const [ nonce, updateNonce ] = useState()
	const [ hashes, setHashes ] = useState()
	const [ campaigns, setCampaigns ] = useState()
	const [ balances, setBalances ] = useState()
	const [ states, setStates ] = useState()

	const [ content, setContent ] = useState()

	// const [ state, setState ] = useState({
	// 	owned: 0,
	// 	contributed: 0,
	// })

	useEffect(() => {

		let unsubscribe = null

		api.query.gameDaoCrowdfunding.nonce(n => {
			if (n.isNone) {
				updateNonce('<None>')
			} else {
				updateNonce(n.toNumber())
			}
		}).then(unsub => {
			unsubscribe = unsub
		})
		.catch(console.error)

		return () => unsubscribe && unsubscribe()

	}, [api.query.gameDaoCrowdfunding])

	// useEffect(() => {

	// 	let unsubscribe = null

	// 	const query = api.query.gameDaoCrowdfunding
	// 	let contributed, owned

	// 	api.queryMulti([
	// 		[query.campaignsContributedCount, accountPair.address],
	// 		[query.campaignsOwnedCount, accountPair.address],
	// 	],([contributed,owned]) => {
	// 		setState({
	// 			...state,
	// 			contributed: contributed.toNumber(),
	// 			owned: owned.toNumber(),
	// 		})
	// 	}).then(unsub => {
	// 		unsubscribe = unsub;
	// 	}).catch(console.error);

	// 	return () => unsubscribe && unsubscribe()

	// }, [nonce, accountPair, api, state, api.query.gameDaoCrowdfunding])

	useEffect(() => {

		if ( nonce === 0 ) return
		const query = api.query.gameDaoCrowdfunding.campaignsArray
		const req = [...new Array(nonce)].map((a,i)=>i)
		const queryHashes = async args => {
			const res = await query.multi( req ).then(_=>_.map(_h=>_h.toHuman()))
			setHashes(res)
		}
		queryHashes()

	}, [nonce, api.query.gameDaoCrowdfunding])

	useEffect(() => {

		if ( !hashes ) return

		const query = api.query.gameDaoCrowdfunding.campaigns
		const queryCampaigns = async args => {
			let _req = []
			try {
				for (var i = 0; i < args.length; i++) _req.push(query(args[i]))
				const res = await Promise.all(_req).then(_=>_.map((_c,_i)=>_c.toHuman()))
				setCampaigns(res)
			} catch ( err ) {
				console.error( err )
			}
		}
		queryCampaigns(hashes)

	}, [hashes, api.query.gameDaoCrowdfunding])

	useEffect(() => {

		if ( !hashes ) return

		const query = api.query.gameDaoCrowdfunding.campaignBalance
		const queryContributions = async args => {
			let req = []
			try {
				for ( var i = 0; i < args.length; i++ ) req.push( query(args[i]) )
				const res = await Promise.all( req ).then(_=>_.map((_c,_i)=>[args[_i],_c.toHuman()]))
				setBalances( res )
			} catch ( err ) {
				console.error( err )
			}
		}
		queryContributions(hashes)

	}, [hashes, api.query.gameDaoCrowdfunding])

	useEffect(() => {

		if ( !hashes ) return

		const query = api.query.gameDaoCrowdfunding.campaignState
		const queryStates = async args => {
			let req = []
			try {
				for ( var i = 0; i < args.length; i++ ) req.push( query(args[i]) )
				const res = await Promise.all( req ).then(_=>_.map((_c,_i)=>[args[_i],_c.toHuman()]))
				setStates( res )
			} catch ( err ) {
				console.error( err )
			}
		}
		queryStates(hashes)

	}, [hashes, api.query.gameDaoCrowdfunding])

	useEffect(() => {

		if ( !campaigns || !balances || !states ) return

		const content = campaigns.map( ( item, index ) => {

			let state, balance = 0, id = item.id

			if ( states.length > 0 ) {
				const filter = states.filter( s => s[0] === id )
				state = ( filter.length === 0 ) ? 0 : filter[0][1]
			}

			if ( balances.length > 0 ) {
				const filter = balances.filter( s => s[0] === id )
				balance = ( filter.length === 0 ) ? 0 : filter[0][1]
			}

			const _item = {
				...item,
				state,
				balance
			}

			return _item

		})

		setContent( content )

	}, [campaigns, balances, states])

	console.log('update')

	return ( !content || nonce === 0 )
		?	<React.Fragment>
				<h1>Campaigns</h1>
				<h3>No campaigns yet. Create one!</h3>
			</React.Fragment>
		:	<React.Fragment>
				<h1>Campaigns</h1>
				<h3>Total Campaigns: { nonce }</h3>
				<CampaignGrid content={content} />
			</React.Fragment>

}

export default Campaigns
