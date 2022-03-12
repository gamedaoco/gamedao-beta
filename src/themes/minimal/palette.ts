import { alpha } from '@mui/material/styles'

// ----------------------------------------------------------------------

function createGradient(color1: string, color2: string) {
	return `linear-gradient(to bottom, ${color1}, ${color2})`
}

interface GradientsPaletteOptions {
	primary: string
	info: string
	success: string
	warning: string
	error: string
}

interface ChartPaletteOptions {
	violet: string[]
	blue: string[]
	green: string[]
	yellow: string[]
	red: string[]
}

declare module '@mui/material/styles/createPalette' {
	interface TypeBackground {
		neutral: string
	}

	interface SimplePaletteColorOptions {
		lighter: string
		darker: string
	}

	interface PaletteColor {
		lighter: string
		darker: string
	}

	interface Palette {
		gradients: GradientsPaletteOptions
		chart: ChartPaletteOptions
	}

	interface PaletteOptions {
		gradients: GradientsPaletteOptions
		chart: ChartPaletteOptions
	}
}

declare module '@mui/material' {
	interface Color {
		0: string
		500_8: string
		500_12: string
		500_16: string
		500_24: string
		500_32: string
		500_48: string
		500_56: string
		500_80: string
	}
}

// SETUP COLORS
const PRIMARY = {
	// lighter: '#C8FACD',
	// light: '#5BE584',
	// main: '#00AB55',
	// dark: '#007B55',
	// darker: '#005249',

	lighter: '#ee55ff',
	light: '#dd44cc',
	main: '#cc3399',
	dark: '#bb2266',
	darker: '#aa1133',

	// lighter: '#ABE5D0',
	// light: '#70E4BB',
	// main: '#21E39E',
	// dark: '#27BD88',
	// darker: '#880ef4',
}
const SECONDARY = {
	// lighter: '#D6E4FF',
	// light: '#84A9FF',
	// main: '#3366FF',
	// dark: '#1939B7',
	// darker: '#091A7A',
	lighter: '#fefefe',
	light: '#cdcdcd',
	main: '#ababab',
	dark: '#696969',
	darker: '#363636',
}
const INFO = {
	lighter: '#D0F2FF',
	light: '#74CAFF',
	main: '#1890FF',
	dark: '#0C53B7',
	darker: '#04297A',
}
const SUCCESS = {
	lighter: '#E9FCD4',
	light: '#AAF27F',
	main: '#54D62C',
	dark: '#229A16',
	darker: '#08660D',
}
const WARNING = {
	lighter: '#FFF7CD',
	light: '#FFE16A',
	main: '#FFC107',
	dark: '#B78103',
	darker: '#7A4F01',
}
const ERROR = {
	lighter: '#FFE7D9',
	light: '#FFA48D',
	main: '#FF4842',
	dark: '#B72136',
	darker: '#7A0C2E',
}

const GREY = {
	0: '#fcfcfc',
	100: '#f2f0ef',
	200: '#c2c0bf',
	300: '#b2b0af',
	400: '#a2a09f',
	500: '#82807f',
	600: '#62605f',
	700: '#42403f',
	800: '#22201f',
	900: '#12100f',

	500_8: alpha('#82807f', 0.08),
	500_12: alpha('#82807f', 0.12),
	500_16: alpha('#82807f', 0.16),
	500_24: alpha('#82807f', 0.24),
	500_32: alpha('#82807f', 0.32),
	500_48: alpha('#82807f', 0.48),
	500_56: alpha('#82807f', 0.56),
	500_80: alpha('#82807f', 0.8),
}

const GRADIENTS = {
	primary: createGradient(PRIMARY.light, PRIMARY.main),
	info: createGradient(INFO.light, INFO.main),
	success: createGradient(SUCCESS.light, SUCCESS.main),
	warning: createGradient(WARNING.light, WARNING.main),
	error: createGradient(ERROR.light, ERROR.main),
}

const CHART_COLORS = {
	violet: ['#826AF9', '#9E86FF', '#D0AEFF', '#F7D2FF'],
	blue: ['#2D99FF', '#83CFFF', '#A5F3FF', '#CCFAFF'],
	green: ['#2CD9C5', '#60F1C8', '#A4F7CC', '#C0F2DC'],
	yellow: ['#FFE700', '#FFEF5A', '#FFF7AE', '#FFF3D6'],
	red: ['#FF6C40', '#FF8F6D', '#FFBD98', '#FFF2D4'],
}

const COMMON = {
	common: { black: '#000', white: '#FCFCFC' },
	primary: { ...PRIMARY, contrastText: '#FCFCFC' },
	secondary: { ...SECONDARY, contrastText: '#FCFCFC' },
	info: { ...INFO, contrastText: '#FCFCFC' },
	success: { ...SUCCESS, contrastText: GREY[800] },
	warning: { ...WARNING, contrastText: GREY[800] },
	error: { ...ERROR, contrastText: '#FCFCFC' },
	grey: GREY,
	gradients: GRADIENTS,
	chart: CHART_COLORS,
	divider: GREY[500_24],

	action: {
		hover: GREY[500_8],
		selected: GREY[500_16],
		disabled: GREY[500_80],
		disabledBackground: GREY[500_24],
		focus: GREY[500_24],
		hoverOpacity: 0.08,
		disabledOpacity: 0.48,
	},
}

const palette = {
	light: {
		...COMMON,
		text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
		background: { paper: '#fcfcfc', default: '#fcfcfc', neutral: GREY[200] },
		action: { active: GREY[600], ...COMMON.action },
		tabButton: {
			normal: '#fcfcfc',
			active: '#82807f29',
		},
		proposalStates: {
			active: '#F9C49D',
			expired: '#848484',
			accepted: '#A1F1D8',
			rejected: '#F2ADAD',
			default: '#F9C49D',
		},
	},
	dark: {
		...COMMON,
		text: { primary: '#fcfcfc', secondary: GREY[500], disabled: GREY[600] },
		background: { paper: '#25282B', default: GREY[900], neutral: GREY[500_16] },
		action: { active: GREY[500], ...COMMON.action },
		tabButton: {
			normal: '#25282B',
			active: '#12100f',
		},
		proposalStates: {
			active: '#F9C49D',
			expired: '#848484',
			accepted: '#A1F1D8',
			rejected: '#F2ADAD',
			default: '#F9C49D',
		},
	},
}

export default palette
