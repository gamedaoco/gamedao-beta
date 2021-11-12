import React from 'react'
import { Box, Button, Card, Divider, FontIcon, Stack, Typography } from '../../components'
import { ListItem } from '../../components/ListItem'
import { TileItem } from '../../components/TileItem'
import ListTileSwitch from '../components/ListTileSwitch'

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
		<ListTileSwitch />

		<Divider />

		<Typography variant="h3">ListItem</Typography>
		<Divider />
		<ListItem
			imageURL="https://picsum.photos/200"
			metaHeadline={'ipsum dolor sit amet Charivari i bin a woschechta Bayer '}
			headline={'Discovery of the Metaverse'}
			progressValue={50}
			achievedGoals={['13249 backers', '380k/500k PLAY', 'Dec 1. 2021', "Space, Jump'n'Run, 2d"]}
		>
			<Typography>
				Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
				diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor
				sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.
			</Typography>
		</ListItem>

		<Typography variant="h3">TileItem & TileItem Feature</Typography>
		<Divider />
		<Box
			sx={{
				display: 'flex',
				flexFlow: 'row wrap',
			}}
		>
			<TileItem
				imageURL="https://picsum.photos/200"
				metaHeadline={'ipsum dolor sit amet Charivari i bin a woschechta Bayer '}
				headline={'Discovery of the Metaverse'}
				progressValue={50}
				achievedGoals={['13249 backers', '380k/500k PLAY', 'Dec 1. 2021', "Space, Jump'n'Run, 2d"]}
			/>
			<TileItem
				feature
				imageURL="https://picsum.photos/200"
				metaHeadline={'ipsum dolor sit amet Charivari i bin a woschechta Bayer '}
				headline={'Discovery of the Metaverse'}
				progressValue={50}
				achievedGoals={['13249 backers', '380k/500k PLAY', 'Dec 1. 2021', "Space, Jump'n'Run, 2d"]}
			/>
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
