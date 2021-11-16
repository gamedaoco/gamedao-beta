import { Typography } from '@mui/material'
import * as React from 'react'
import { Paper, Card, Box, Divider, Stack, Slider,Image16to9 } from '../../components'

export const TileReward = ({ disabled, feature }) => (
	<>
		<Card
			sx={{
				opacity: disabled ? '0.25' : '1',
				width: feature ? 'calc( ( ( 100% / 3 ) * 2) - 20px )' : 'calc( (100% / 3) - 20px )',
				my: 1,
				mx: 1,
				backgroundColor: "primary.main"
			}}
		>
			<Stack>
				<Box sx={{ overflow: 'hidden', maxHeight: feature ? '300px' : 'auto' }}>
					<Image16to9 width="100%" height="100%" src="https://picsum.photos/200" />
				</Box>
				<Stack
					sx={{
						p: '1rem',
					}}
				>
					<Typography variant="h6">Reward #1</Typography>
					<Typography>At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Typography>
					<Slider disabled defaultValue={30} />
					<Typography variant="subtext1">100/1000</Typography>

				</Stack>
			</Stack>
		</Card>
	</>
)
