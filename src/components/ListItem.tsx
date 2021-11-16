import * as React from 'react'
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { Card, Box, Divider, Stack, Slider } from './index'

export const ListItem: React.FC<
	React.PropsWithChildren<{
		imageURL: string
		metaHeadline: string
		headline: string
		progressValue?: number
		metaContent?: React.ReactNode
		linkTo?: string
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
					<Link to={props.linkTo}>
						<img width="200px" height="100%" src={props.imageURL} />
					</Link>
				</Box>
				<Stack>
					<Typography variant="h6">{props.metaHeadline}</Typography>
					<Typography variant="h4">{props.headline}</Typography>
					{props.children}
					{typeof props.progressValue === 'number' ? (
						<>
							<Box sx={{ flex: 1 }} />
							<Slider disabled defaultValue={props.progressValue} />
						</>
					) : null}
				</Stack>

				<Stack direction="row">
					<Divider sx={{ mx: 2, height: '100%' }} orientation="vertical" flexItem />
					{props.metaContent}
				</Stack>
			</Box>
		</Card>
	</>
)
