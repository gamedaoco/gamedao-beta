import { merge } from 'lodash'
import ReactApexChart from 'react-apexcharts'
// material
import { Card, CardHeader, Box } from '@mui/material'
//
import { ChartBaseOptions } from './ChartBaseOptions'

// ----------------------------------------------------------------------

const CHART_DATA = [
	{
		name: 'GAME',
		type: 'area',
		data: [3, 10, 12, 16, 12, 15, 20, 21, 23, 27, 34],
	}
]

export default function SingleChart() {
	const chartOptions = merge(ChartBaseOptions(), {
		stroke: { width: [0] },
		fill: { type: ['gradient'] },
	})

	return (
			<Box dir="ltr">
				<ReactApexChart
					type="line"
					series={CHART_DATA}
					options={chartOptions}
					height={175}
				/>
			</Box>
	)
}
