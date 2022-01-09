import { merge } from 'lodash'
import ReactApexChart from 'react-apexcharts'
import { alpha, useTheme, styled } from '@mui/material/styles'
import { Card, CardHeader } from '@mui/material'
import { BaseOptionChart } from './BaseOptionChart'

const CHART_HEIGHT = 392
const LEGEND_HEIGHT = 72

const ChartWrapperStyle = styled('div')(({ theme }) => ({
	height: CHART_HEIGHT,
	marginTop: theme.spacing(2),
	'& .apexcharts-canvas svg': {
		height: CHART_HEIGHT,
	},
	'& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
		overflow: 'visible',
	},
	'& .apexcharts-legend': {
		height: LEGEND_HEIGHT,
		alignContent: 'center',
		position: 'relative !important',
		borderTop: `solid 1px ${theme.palette.divider}`,
		top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
	},
}))

// ----------------------------------------------------------------------

const CHART_DATA = [
	{ name: 'Europe', data: [80, 50, 30, 40, 100, 20] },
	{ name: 'APAC', data: [20, 30, 40, 80, 20, 80] },
	{ name: 'USA', data: [44, 76, 78, 13, 43, 10] },
]

export default function AppCurrentSubject() {

	const theme = useTheme()
	const bgPlain = { backgroundColor: theme.palette.grey[500_16] }

	const chartOptions = merge(BaseOptionChart(), {
		stroke: { width: 1 },
		fill: { opacity: 0.48 },
		legend: { floating: true, horizontalAlign: 'center' },
		xaxis: {
			categories: ['MMORPG', 'Metaverse', 'Shooter', 'Hyper Casual', 'Story', 'RPG'],
			labels: {
				style: {
					colors: [
						theme.palette.text.secondary,
						theme.palette.text.secondary,
						theme.palette.text.secondary,
						theme.palette.text.secondary,
						theme.palette.text.secondary,
						theme.palette.text.secondary,
					],
				},
			},
		},
	})

	return (
		<Card sx={{ ...bgPlain, minHeight: '80px', height: '100%' }}>
			<CardHeader title="Popular Categories" />
			<ChartWrapperStyle dir="ltr">
				<ReactApexChart
					type="radar"
					series={CHART_DATA}
					options={chartOptions}
					height={340}
				/>
			</ChartWrapperStyle>
		</Card>
	)
}
