import * as React from 'react'
import { Link } from 'react-router-dom'
import { alpha, useTheme } from '@mui/material/styles'
import { Typography } from '@mui/material'
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
> = (props) => {

	const theme = useTheme()
	const bgPlain = { backgroundColor: theme.palette.grey[500_16] }

	return (
		<>
			<Card sx={{ p: 2, ...bgPlain }} >
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: { sm: '2fr 7fr 3fr' },
						gap: 2,
					}}
				>
					<Box>
						<Link to={props.linkTo || ''}>
							<img
								style={{ objectFit: 'cover' }}
								width="200px"
								height="200px"
								src={props.imageURL}
							/>
						</Link>
					</Box>
					<Stack>
						<Typography variant="h4">{props.headline}</Typography>
						<Typography variant="h6">{props.metaHeadline}</Typography>
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
}
