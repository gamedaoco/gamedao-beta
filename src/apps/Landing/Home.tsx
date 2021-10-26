import * as React from 'react'
import { Card, Button, Divider, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Stack } from '../../components'
import { App } from './App'
import { App as App2} from './App2'

export const Home = (props: any) => {
return <div>
	<Typography variant="h1">GameDAO</Typography>
	<Box sx={{ height: '50vh', position: 'absolute' }}>
	  <App2/>
	  <Typography>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
	  </Typography>
	</Box>
	<Box sx={{ height: '50vh', position: 'absolute' }}>
	  <App/>
	</Box>
</div>
}

export default Home

// https://opengameart.org/content/digital-drawing-images-1
