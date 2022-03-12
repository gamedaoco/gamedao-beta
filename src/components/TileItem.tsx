import * as React from 'react'
import { Link } from 'react-router-dom'
import { alpha, useTheme } from '@mui/material/styles'
import { Typography } from '@mui/material'
import { styled } from '../components'
import { Paper, Card, Box, Divider, Stack, Slider } from './index'

const Image = styled(Box)(({ theme }) => ({
	width: '100%',
	backgroundSize: 'contain',
	backgroundRepeat: 'no-repeat',
	backgroundPosition: 'center center',
	['&:after']: {
		display: 'block',
		content: '" "',
		paddingTop: '100%',
	},
}))

export const TileItem: React.FC<
	React.PropsWithChildren<{
		feature?: boolean
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
		<Card sx={{
			minHeight: '100%',
			minWidth: '300px',
			maxWidth: '300px',
			border: '1px solid rgba(0,0,0,0)',
			'&:hover': {borderColor: 'primary.main'},
			...bgPlain
		}}>
			<Stack sx={{ height: '100%' }}>
				<Link to={props.linkTo || ''}>
					<img
						style={{ objectFit: 'cover' }}
						width="100%"
						height="300px"
						src={props.imageURL}
					/>
				</Link>

				<Stack
					sx={{
						p: 2,
					}}
				>
					<Typography variant="h4">
						{props.feature ? 'FEATURED:' : ''} {props.headline}
					</Typography>
					<Typography variant="h6">{props.metaHeadline}</Typography>
					{props.children}
					{typeof props.progressValue === 'number' ? (
						<Slider disabled defaultValue={props.progressValue} />
					) : null}
				</Stack>
				<Box sx={{ flex: 1 }} />
				<Box sx={{ padding: 2, flex: 1 }}>{props.metaContent}</Box>
			</Stack>
		</Card>
	)
}
