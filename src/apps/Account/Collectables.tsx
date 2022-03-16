import { useEffect, useState } from 'react'
import { useWallet } from 'src/context/Wallet'
import { toKusamaAddress } from 'src/utils/helper'
import { Grid, Box } from 'src/components'
import Collectable from './Collectable'

const COLLECTION = 'a0afbe96d2541b6446-BETA'
const GRAPH_URL = 'https://gql-rmrk2-prod.graphcdn.app'

async function fetchCollectables(address) {

	// console.log(address)

	const headers = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	}

	const query = {
		query: `query( $id:String, $owner: [String!] ) {
			nfts( where: {
				collectionId: { _eq: $id },
				owner: { _in: $owner }
			}) {
				id
				metadata_name
				metadata_image
				metadata_properties
				metadata
				sn
			}
		}`,
		variables: {
			id: COLLECTION,
			owner: [address],
		},
	}

	try {
		const req = await fetch(GRAPH_URL, {
			method: 'POST', headers, body: JSON.stringify(query),
		})
		const parsed = await req.json()
		if (parsed.data.nfts.length > 0) {
			return parsed.data.nfts
		}
	} catch (e) {
		console.error(e)
		return []
	}
}

const CollectablesView = () => {

	const { address } = useWallet()
	const [ collection, setCollection ] = useState([]);

	useEffect( () => {
		if (!address) return
		const getCollectables = async () => {
			const _ = await fetchCollectables( toKusamaAddress(address) )
			setCollection(_)
		}
		getCollectables()
	}, [address]);

	return (
			<Box>
				<Grid container spacing={2}>
					{ !collection
						? ('Searching...')
						: ( collection.map( (nft, index) => <Collectable key={nft.id} content={nft}/> ) )
					}
				</Grid>
			</Box>
		)

}

export default CollectablesView