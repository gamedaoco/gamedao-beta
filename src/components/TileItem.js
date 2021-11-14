import { Typography } from '@mui/material'
import * as React from 'react'
import { Card, Box, Stack, Slider } from './index'

export const TileItem = ({ feature }) => (
	<>
		<Card
			sx={{
				width: feature ? 'calc( ( ( 100% / 3 ) * 2) - 20px )' : 'calc( (100% / 3) - 20px )',
				m: '10px',
			}}
		>
			<Stack>
				<Box sx={{ maxHeight: feature ? '300px' : 'auto' }}>
					<img alt={'campaign.title'} width="100%" height="100%" src="https://picsum.photos/200" />
				</Box>
				<Stack
					sx={{
						p: '1rem',
					}}
				>
					<Typography variant="h6">✅ Activions Blizzard</Typography>
					<Typography variant="h4">{feature ? 'FEATURED:' : ''} Discovery of the Metaverse</Typography>
					<Slider disabled defaultValue={30} />
				</Stack>
				<Stack
					direction="row"
					sx={{
						p: '1rem',
					}}
				>
					<Box
						sx={{
							display: 'grid',
							margin: '0 auto',
							gridTemplateColumns: { sm: '2fr 2fr' },
						}}
					>
						{feature && [
							<Typography variant="h4">✅ 13249 backers</Typography>,
							<Typography variant="h4">✅ 380k/500k PLAY</Typography>,
							<Typography variant="h4">✅ Dec 1. 2021</Typography>,
							<Typography variant="h4">✅ Space, JumpNRun</Typography>,
						]}
						{!feature && [
							<Typography variant="subtitle2">✅ 13249 backers</Typography>,
							<Typography variant="subtitle2">✅ 380k/500k PLAY</Typography>,
							<Typography variant="subtitle2">✅ Dec 1. 2021</Typography>,
							<Typography variant="subtitle2">✅ Space, JumpNRun</Typography>,
						]}
					</Box>
				</Stack>
			</Stack>
		</Card>
	</>
)
