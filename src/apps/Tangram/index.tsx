import React, { useEffect, useState } from 'react'

import { useSubstrate } from '../../substrate-lib'
import { useWallet } from 'src/context/Wallet'

import { gateway } from '../lib/ipfs'
import config from '../../config'

import { Button, Grid, Typography } from '../../components'
import ItemGrid from './ItemGrid'

export const Content = (props) => {
	const { api } = useSubstrate()
	const { address } = useWallet()

	// every org runs on its own realm
	// classes exist in realms, where
	// class 0 is by default the tangram class
	// items live in classes and can possess
	// various attributes

	const [realms, setRealms] = useState()
	const [classes, setClasses] = useState()
	const [items, setItems] = useState()
	const [total, setTotal] = useState(0)
	const [owned, setOwned] = useState(0)

	useEffect(() => {
		let unsubscribe = null
		api.query.gameDaoTangram
			.total((n) => {
				setTotal(n.toNumber())
			})
			.then((unsub) => {
				unsubscribe = unsub
			})
			.catch(console.error)
		return () => unsubscribe && unsubscribe()
	}, [api.query.gameDaoTangram])

	useEffect(() => {
		if ( !total ) return
		const req = [...new Array(total)].map((a,i)=>i)
		const queryHashes = async args => {
			const hashes = await api.query.gameDaoTangram.itemsForAccount
				.multi( args ).then( _ => _.map( _h => _h.toHuman() ))
			// setHashes(hashes)
		}
		queryHashes(req)
	}, [total, api.query.gameDaoTangram])

	return !total || total === 0 ? (
		<React.Fragment>
			<Typography component="h1" variant="h3">Tangram</Typography>
			<Typography component="h2" variant="h5">No Tangram was minted yet.</Typography>
		</React.Fragment>
	) : (
		<React.Fragment>
			<Typography component="h1" variant="h3">Tangram</Typography>
			<Typography component="h2" variant="h5">Total minted: {total}</Typography>
			<Typography component="h2" variant="h5">Total owned: {owned}</Typography>
			{/*<ItemGrid hashes={hashes} accountPair={accountPair} />*/}
		</React.Fragment>
	)
}

export default function Module(props) {
	// const { accountPair } = useWallet()
	const { api } = useSubstrate()

	return api && api.query.gameDaoTangram /*&& accountPair*/ ? <Content {...props} /> : null
}
