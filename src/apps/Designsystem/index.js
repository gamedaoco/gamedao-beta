import * as React from 'react'
import { Card, Button, Divider, FontIcon, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Stack, Icon } from '../../components'
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

		
		<Typography variant="h3">Icons</Typography>
		<Divider />
		<Icons />

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

const Icons = () => (
	<Stack>
		<FontIcon name="calendar"/>
		<br />
		<FontIcon name="arrowdown"/>
		<br />
		<FontIcon name="arrowup"/>
		<br />
		<FontIcon name="campaign"/>
		<br />
		<FontIcon name="check"/>
		<br />
		<FontIcon name="dashboard"/>
		<br />
		<FontIcon name="document"/>
		<br />
		<FontIcon name="howto"/>
		<br />
		<FontIcon name="image"/>
		<br />
		<FontIcon name="organization"/>
		<br />
		<FontIcon name="organization2"/>
		<br />
		<FontIcon name="store"/>
		<br />
		<FontIcon name="tangram"/>
		<br />
		<FontIcon name="voting"/>
		<br />
		<FontIcon name="waööet"/>
		<br />
	</Stack>
)

export default Designsystem
