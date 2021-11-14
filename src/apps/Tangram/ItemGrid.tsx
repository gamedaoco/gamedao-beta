import React, { useEffect, useState } from 'react'
import { Grid } from '../../components'
import Item from './Item'

const ItemGrid = ({ hashes }) => {
	if (!hashes) return null

	return (
		<Grid container>
			{hashes &&
				hashes.map((itemHash, index) => {
					return <Item hash={itemHash} />
				})}
		</Grid>
	)
}

export default ItemGrid