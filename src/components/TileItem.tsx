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
		metaContent?: React.ReactNode
	}>
> = (props) => (
	<Card sx={{ minHeight: '100%' }}>
		<Stack sx={{ height: '100%' }}>
			<Box sx={{ maxHeight: props.feature ? '300px' : 'auto' }}>
				<img width="100%" height="100%" src={props.imageURL} />
			</Box>
			<Stack
				sx={{
					p: 2,
				}}
			>
				<Typography variant="h6">{props.metaHeadline}</Typography>
				<Typography variant="h4">
					{props.feature ? 'FEATURED:' : ''} {props.headline}
				</Typography>
				{typeof props.progressValue === 'number' ? <Slider disabled defaultValue={props.progressValue} /> : null}
			</Stack>
			<Box sx={{ flex: 1 }} />
			<Box sx={{ padding: 2, flex: 1 }}>{props.metaContent}</Box>
		</Stack>
	</Card>
)

export default TileItem
