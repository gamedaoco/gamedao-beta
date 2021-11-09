import { Typography } from '@mui/material'
import * as React from 'react'
import { Paper, Card, Box, Divider, Stack, Slider } from './index'

export const TileItem: React.FC<
	React.PropsWithChildren<{
		feature?: boolean
		imageURL: string
		metaHeadline: string
		headline: string
		progressValue?: number
		achievedGoals?: string[]
	}>
> = (props) => (
	<>
		<Card>
			<Stack>
				<Box sx={{ maxHeight: props.feature ? '300px' : 'auto' }}>
					<img width="100%" height="100%" src={props.imageURL} />
				</Box>
				<Stack
					sx={{
						p: '1rem',
					}}
				>
					<Typography variant="h6">{props.metaHeadline}</Typography>
					<Typography variant="h4">
						{props.feature ? 'FEATURED:' : ''} {props.headline}
					</Typography>
					{typeof props.progressValue === 'number' ? <Slider disabled defaultValue={props.progressValue} /> : null}
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
						{props.achievedGoals &&
							props.achievedGoals.map((goal) => <Typography variant={props.feature ? 'h4' : 'subtitle2'}>✅ {goal}</Typography>)}
					</Box>
				</Stack>
			</Stack>
		</Card>
	</>
)

export default TileItem
