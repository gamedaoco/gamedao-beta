import * as React from 'react'
import {
	Card,
	Button,
	Divider,
	FontIcon,
	FormControlLabel,
	Checkbox,
	Link,
	Grid,
	Box,
	Typography,
	Stack,
	Icon,
} from '../../components'
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
	<Stack direction="row">
		<FontIcon fontSize="large" name="calendar" />
		<br />
		<FontIcon fontSize="large" name="arrowdown" />
		<br />
		<FontIcon fontSize="large" name="arrowup" />
		<br />
		<FontIcon fontSize="large" name="campaign" />
		<br />
		<FontIcon fontSize="large" name="check" />
		<br />
		<FontIcon fontSize="large" name="dashboard" />
		<br />
		<FontIcon fontSize="large" name="document" />
		<br />
		<FontIcon fontSize="large" name="howto" />
		<br />
		<FontIcon fontSize="large" name="image" />
		<br />
		<FontIcon fontSize="large" name="organization" />
		<br />
		<FontIcon fontSize="large" name="organization2" />
		<br />
		<FontIcon fontSize="large" name="store" />
		<br />
		<FontIcon fontSize="large" name="tangram" />
		<br />
		<FontIcon fontSize="large" name="voting" />
		<br />
		<FontIcon fontSize="large" name="waööet" />
		<br />
	</Stack>
)

export default Designsystem
