import { merge } from 'lodash'
import ReactApexChart from 'react-apexcharts'

import { Card, CardHeader, Box, useTheme } from '../index'
//
import { ChartBaseOptions } from './ChartBaseOptions'

// ----------------------------------------------------------------------

const CHART_DATA = [
	{
		name: 'GAME',
		type: 'area',
		data: [3, 10, 12, 16, 12, 15, 20, 21, 23, 27, 34],
	},
]

const color = []

export default function SingleChart() {
	const theme = useTheme()
	const colors = [
		theme.palette.success.light,
		theme.palette.info.light,
		theme.palette.primary.light,
	]
	const randomColor = colors[Math.floor(Math.random() * colors.length)]
	const chartOptions = merge(ChartBaseOptions(), {
		stroke: { width: [0] },
		fill: {
			colors: [randomColor],
			type: ['gradient'],
		},
	})

	return (
		<Box dir="ltr">
			<ReactApexChart type="line" series={CHART_DATA} options={chartOptions} height={175} />
		</Box>
	)
}
