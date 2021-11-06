import * as React from 'react'
import { Card, Button, Divider, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Stack } from '../../components'
import { ListItem } from '../../components/ListItem'
import { TileItem } from '../../components/TileItem'

export const Designsystem = (props) => (
	<Stack>
		<Typography variant="h1">Designsystem</Typography>
		<Divider />
		<Divider />

		<Typography variant="h3">Buttons</Typography>
		<Divider />
		<Buttons />

		<Typography variant="h3">ListItem</Typography>
		<Divider />
		<ListItem />

		<Typography variant="h3">TileItem & TileItem Feature</Typography>
		<Divider />
		<Box
			sx={{
				display: 'flex',
				flexFlow: 'row wrap',
			}}
		>
			<TileItem />
			<TileItem feature />
		</Box>

		<Typography variant="h3">Tiles</Typography>
		<Divider />
		<Box
			sx={{
				display: 'flex',
				flexFlow: 'row wrap',
			}}
		>
			<TileItem />
			<TileItem feature />
			<TileItem />
			<TileItem />
			<TileItem />
			<TileItem />
			<TileItem />
		</Box>
	</Stack>
)

const Buttons = () => (
	<Stack>
		<br />
		<Button>default</Button>
		<br />
		<Button variant="outlined">variant="outlined"</Button>
		<br />
		<Button variant="contained">variant="contained"</Button>
		<br />
	</Stack>
)

const Cards = () => (
	<Stack>
		<br />
		<Card>default card</Card>
		<br />
	</Stack>
)

export default Designsystem
