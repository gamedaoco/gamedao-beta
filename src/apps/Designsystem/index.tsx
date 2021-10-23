import * as React from 'react'
import { Card, Button, Divider, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Stack } from '../../components'
import { ModelCar } from '../webgl/ModelCar'

export const Designsystem = (props: any) => (
	<Stack>
		<Typography variant="h1">Designsystem</Typography>
		<Typography variant="h3">Buttons</Typography>
		<ModelCar/>
		<Divider />
		<Buttons />

		<Typography variant="h3">Cards</Typography>
		<Divider />
		<Cards />
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
