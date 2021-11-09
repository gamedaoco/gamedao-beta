import * as React from 'react'
import { Typography } from '@mui/material'
import { Card, Box, Divider, Stack, Slider } from './index'

export const ListItem: React.FC<
	React.PropsWithChildren<{
		imageURL: string
		metaHeadline: string
		headline: string
		progressValue?: number
		achievedGoals?: string[]
	}>
> = (props) => (
	<>
		<Card
			sx={{
				p: 2,
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
					<img width="200px" height="100%" src={props.imageURL} />
				</Box>
				<Stack>
					<Typography variant="h6">{props.metaHeadline}</Typography>
					<Typography variant="h4">{props.headline}</Typography>
					{props.children}
					<Box sx={{ flex: 1 }} />
					{typeof props.progressValue === 'number' ? <Slider disabled defaultValue={props.progressValue} /> : null}
				</Stack>

				<Stack direction="row">
					<Divider sx={{ mx: 2, height: '100%' }} orientation="vertical" flexItem />
					<Stack justifyContent="space-around" sx={{ height: '100%' }}>
						{props.achievedGoals?.map((goal) => (
							<Typography>✅ {goal}</Typography>
						))}
					</Stack>
				</Stack>
			</Box>
		</Card>
	</>
)

export default ListItem
