// material
import { alpha, useTheme } from '@mui/material/styles'
import { GlobalStyles } from '@mui/material'

// ----------------------------------------------------------------------

export function BaseOptionChartStyle() {
	const theme = useTheme()

	const background = {
		backdropFilter: 'blur(6px)',
		WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
		backgroundColor: alpha(theme.palette.background.default, 0.72),
	}

	return (
		<GlobalStyles
			styles={{
				'&.apexcharts-canvas': {
					// Tooltip
					'.apexcharts-xaxistooltip': {
						...background,
						border: 0,
						boxShadow: theme.customShadows.z24,
						color: theme.palette.text.primary,
						borderRadius: theme.shape.borderRadiusSm,
						'&:before': { borderBottomColor: 'transparent' },
						'&:after': {
							borderBottomColor: alpha(theme.palette.background.default, 0.72),
						},
					},
					'.apexcharts-tooltip.apexcharts-theme-light': {
						...background,
						border: 0,
						boxShadow: theme.customShadows.z24,
						borderRadius: theme.shape.borderRadiusSm,
						'& .apexcharts-tooltip-title': {
							border: 0,
							textAlign: 'center',
							fontWeight: theme.typography.fontWeightBold,
							backgroundColor: theme.palette.grey[500_16],
							color: theme.palette.text[
								theme.palette.mode === 'light' ? 'secondary' : 'primary'
							],
						},
					},
					// Legend
					'.apexcharts-legend': {
						padding: 0,
					},
					'.apexcharts-legend-series': {
						display: 'flex !important',
						alignItems: 'center',
					},
					'.apexcharts-legend-marker': {
						marginRight: 8,
					},
					'.apexcharts-legend-text': {
						lineHeight: '18px',
						textTransform: 'capitalize',
					},
				},
			}}
		/>
	)
}

export function ChartBaseOptions() {
	const theme = useTheme()

	const LABEL_TOTAL = {
		show: false,
		label: 'Total',
		color: theme.palette.text.secondary,
		...theme.typography.subtitle2,
	}

	const LABEL_VALUE = {
		offsetY: 0,
		color: theme.palette.text.primary,
		...theme.typography.h3,
	}

	return {
		// Colors
		colors: [
			theme.palette.primary.main,
			theme.palette.chart.yellow[0],
			theme.palette.chart.blue[0],
			theme.palette.chart.violet[0],
			theme.palette.chart.green[0],
			theme.palette.chart.red[0],
		],

		// Chart
		chart: {
			parentHeightOffset: 0,
			toolbar: { show: false },
			zoom: { enabled: false },
			// animations: { enabled: false },
			foreColor: theme.palette.text.disabled,
			fontFamily: theme.typography.fontFamily,
		},

		// States
		states: {
			hover: {
				filter: {
					type: 'lighten',
					value: 0.04,
				},
			},
			active: {
				filter: {
					type: 'darken',
					value: 0.88,
				},
			},
		},

		// Fill
		fill: {
			colors: ['#888888'],
			opacity: 1,
			gradient: {
				type: 'vertical',
				shadeIntensity: 0,
				opacityFrom: 0.6,
				opacityTo: 0,
				stops: [0, 100],
			},
		},

		// Datalabels
		dataLabels: { enabled: false },

		// Stroke
		stroke: {
			width: 3,
			curve: 'smooth',
			lineCap: 'round',
		},

		// Grid
		grid: {
			show: false,
			strokeDashArray: 0,
			borderColor: theme.palette.divider,
		},

		xaxis: {
			labels: { show: false },
			axisBorder: { show: false },
			axisTicks: { show: false },
			crosshairs: { show: false },
			tooltip: { enabled: false },
		},

		yaxis: {
			labels: { show: false },
			axisBorder: { show: false },
			axisTicks: { show: false },
			crosshairs: { show: false },
			tooltip: { enabled: false },
		},

		// Markers
		markers: {
			size: 0,
			strokeColors: theme.palette.background.paper,
		},

		// Tooltip
		tooltip: {
			enabled: false,
			x: {
				show: false,
			},
		},

		// Legend
		legend: {
			show: false,
			fontSize: 13,
			position: 'top',
			horizontalAlign: 'right',
			markers: {
				radius: 12,
			},
			fontWeight: 500,
			itemMargin: { horizontal: 0 },
			labels: {
				colors: theme.palette.text.primary,
			},
		},

		// plotOptions
		plotOptions: {
			// Bar
			bar: {
				columnWidth: '28%',
				borderRadius: 4,
			},
			// Pie + Donut
			pie: {
				donut: {
					labels: {
						show: true,
						value: LABEL_VALUE,
						total: LABEL_TOTAL,
					},
				},
			},
			// Radialbar
			radialBar: {
				track: {
					strokeWidth: '100%',
					background: theme.palette.grey[500_16],
				},
				dataLabels: {
					value: LABEL_VALUE,
					total: LABEL_TOTAL,
				},
			},
			// Radar
			radar: {
				polygons: {
					fill: { colors: ['transparent'] },
					strokeColors: theme.palette.divider,
					connectorColors: theme.palette.divider,
				},
			},
			// polarArea
			polarArea: {
				rings: {
					strokeColor: theme.palette.divider,
				},
				spokes: {
					connectorColors: theme.palette.divider,
				},
			},
		},

		// Responsive
		responsive: [
			{
				// sm
				breakpoint: theme.breakpoints.values.sm,
				options: {
					plotOptions: { bar: { columnWidth: '40%' } },
				},
			},
			{
				// md
				breakpoint: theme.breakpoints.values.md,
				options: {
					plotOptions: { bar: { columnWidth: '32%' } },
				},
			},
		],
	}
}
