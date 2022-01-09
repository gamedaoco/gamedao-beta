import PropTypes from 'prop-types'
import { alpha, useTheme } from '@mui/material/styles'
import { Card, Typography, CardHeader, CardContent } from '@mui/material'
import {
	Timeline,
	TimelineItem,
	TimelineContent,
	TimelineConnector,
	TimelineSeparator,
	TimelineDot,
} from '@mui/lab'
import { fDateTime } from '../../../utils/formatTime'

// ----------------------------------------------------------------------

const TIMELINES = [
	{
		title: 'koijam',
		time: Date.now() + 1000 * 60 * 60 * 24 * 1,
		type: 'order1',
	},
	{
		title: 'pixzoo',
		time: Date.now() + 1000 * 60 * 60 * 5 * 2,
		type: 'order2',
	},
	{
		title: 'chaos league',
		time: Date.now() + 1000 * 60 * 60 * 8 * 3,
		type: 'order3',
	},
	{
		title: 'dark souls 6',
		time: Date.now() + 1000 * 60 * 60 * 13 * 5,
		type: 'order4',
	},
]

// ----------------------------------------------------------------------

OrderItem.propTypes = {
	item: PropTypes.object,
	isLast: PropTypes.bool,
}

function OrderItem({ item, isLast }) {

	const { type, title, time } = item
	return (
		<TimelineItem>
			<TimelineSeparator>
				<TimelineDot
					sx={{
						bgcolor:
							(type === 'order1' && 'primary.main') ||
							(type === 'order2' && 'success.main') ||
							(type === 'order3' && 'info.main') ||
							(type === 'order4' && 'warning.main') ||
							'error.main',
					}}
				/>
				{isLast ? null : <TimelineConnector />}
			</TimelineSeparator>
			<TimelineContent>
				<Typography variant="subtitle2">{title}</Typography>
				<Typography variant="caption" sx={{ color: 'text.secondary' }}>
					{fDateTime(time)}
				</Typography>
			</TimelineContent>
		</TimelineItem>
	)
}

export default function AppOrderTimeline() {

	const theme = useTheme()
	const bgPlain = { backgroundColor: theme.palette.grey[500_16] }

	return (
		<Card sx={{ ...bgPlain, minHeight: '80px', height: '100%',
				'& .MuiTimelineItem-missingOppositeContent:before': {
					display: 'none',
				},
			}}
		>
			<CardHeader title="Ending Soon:" />
			<CardContent>
				<Timeline>
					{TIMELINES.map((item, index) => (
						<OrderItem
							key={item.title}
							item={item}
							isLast={index === TIMELINES.length - 1}
						/>
					))}
				</Timeline>
			</CardContent>
		</Card>
	)
}
