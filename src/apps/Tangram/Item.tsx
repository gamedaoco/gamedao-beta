import React, { useEffect, useState } from 'react'
import { useSubstrate } from '../../substrate-lib'
import { useWallet } from 'src/context/Wallet'
import { gateway } from '../lib/ipfs'

import { CardActionArea, CardActions, CardContent, CardMedia } from '@mui/material'
import { Button, Grid, Card, Typography } from '../../components'

const ItemMedia = () =>
<Card sx={{ maxWidth: 345 }}>
	<CardActionArea>
		<CardMedia
			component="img"
			height="140"
			image="/static/images/cards/contemplative-reptile.jpg"
			alt="green iguana"
		/>
		<CardContent>
		<Typography gutterBottom variant="h5" component="div">
			Lizard
		</Typography>
		<Typography variant="body2" color="text.secondary">
			Lizards are a widespread group of squamate reptiles, with over 6,000
			species, ranging across all continents except Antarctica
		</Typography>
		</CardContent>
	</CardActionArea>
	<CardActions>
		<Button size="small" color="primary">
			Share
		</Button>
	</CardActions>
</Card>

const Item = ({ hash }) => {

	const { api } = useSubstrate()
	const { address, accountPair } = useWallet()
	const [ content, setContent ] = useState(null)

	// useEffect(() => {
	// 	if (!hash) return
	// 	const query = async () => {
	// 		try {
	// 			const [
	// 				config,
	// 			] = await Promise.all([
	// 				api.query.gameDaoTangram.bodyConfig(hash),
	// 			])
	// 			setContent({
	// 				...config.toHuman(),
	// 			})
	// 		} catch ( err ) {
	// 			console.error( err )
	// 		}
	// 	}
	// 	query()
	// }, [api, hash])

	if (!content) return null

	// todo: isLoading
	// {content.imageURL}
	// href={`https://ryse.exchange/${content.id}`}
	// color={content.owned === true ? 'pink' : 'white'}

	return (
		<Grid item xs={12} md={6} lg={2}>
			<Card sx={{ maxWidth: 345 }}>
				<CardActionArea>
					<CardMedia
						component="img"
						height="140"
						image="/static/images/cards/contemplative-reptile.jpg"
						alt="green iguana"
					/>
					<CardContent>
						<Typography gutterBottom variant="h5" component="div">
							{content.name}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{content.dob}
						</Typography>
					</CardContent>
				</CardActionArea>
				<CardActions>
					<Button size="small" color="primary">
						{content.love}
					</Button>
				</CardActions>
			</Card>
		</Grid>
	)
}

export default Item