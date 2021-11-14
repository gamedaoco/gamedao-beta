import { Typography } from '@mui/material'
import * as React from 'react'
import { Card, Box, Divider, Stack, Slider } from './index'

export const ListItem = () => (
	<>
		<Card
			sx={{
				p: 2,
				my: 2,
			}}
		>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { sm: '2fr 7fr 3fr' },
					gap: 2,
				}}
			>
				<Box>
					<img alt="howdy" width="200px" height="100%" src="https://picsum.photos/200" />
				</Box>
				<Stack>
					<Typography variant="h6">✅ Activions Blizzard</Typography>
					<Typography variant="h4">Discovery of the Metaverse</Typography>
					<Typography>
						Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
						sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
						ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.
					</Typography>
					<Slider disabled defaultValue={30} />
				</Stack>

				<Stack direction="row">
					<Divider sx={{ mx: 2, height: '100%' }} orientation="vertical" flexItem />
					<Stack justifyContent="space-around" sx={{ height: '100%' }}>
						<Typography>✅ 13249 backers</Typography>
						<Typography>✅ 380k/500k PLAY</Typography>
						<Typography>✅ Dec 1. 2021</Typography>
						<Typography>✅ Space, JumpNRun, 2D</Typography>
					</Stack>
				</Stack>
			</Box>
		</Card>
	</>
)
