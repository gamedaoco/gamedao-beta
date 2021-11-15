import { createTheme } from '@mui/material/styles'

const globalTheme = {
	shape: {
		borderRadius: 1,
	},
	shadows: 0,
}

export const darkTheme = createTheme({
	...globalTheme,
	palette: {
		mode: 'dark',
		primary: {
			main: '#21E39E',
		},
		secondary: {
			main: '#3f51b5',
		},
	},
})

export const lightTheme = createTheme({
	...globalTheme,
	palette: {
		mode: 'light',
		primary: {
			main: '#21E39E',
		},
		secondary: {
			main: '#3f51b5',
		},
	},
})
