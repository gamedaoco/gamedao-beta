import { createTheme } from '@mui/material/styles'
// hooks
// import useSettings from '../hooks/useSettings';
//
import shape from './shape'
import palette from './palette'
import typography from './typography'
import breakpoints from './breakpoints'
import componentsOverride from './overrides'
import shadows, { customShadows } from './shadows'

const regular = require('../NotoSans-Regular.ttf')
const bold = require('../NotoSans-Bold.ttf')
const italic = require('../NotoSans-Italic.ttf')
const bolditalic = require('../NotoSans-BoldItalic.ttf')

const components = {
	MuiCssBaseline: {
		styleOverrides: `
        @font-face {
          font-family: 'Noto Sans';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: url(${regular}) format('truetype');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }

		@font-face {
			font-family: 'Noto Sans Bold';
			font-style: normal;
			font-display: swap;
			font-weight: 400;
			src: url(${bold}) format('truetype');
			unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
		  }

		  @font-face {
			font-family: 'Noto Sans Bold';
			font-style: normal;
			font-display: swap;
			font-weight: 400;
			src: url(${italic}) format('truetype');
			unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
		  }

		  @font-face {
			font-family: 'Noto Sans Bold';
			font-style: normal;
			font-display: swap;
			font-weight: 400;
			src: url(${bolditalic}) format('truetype');
			unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
		  }
      `,
	},
}

export const darkTheme = createTheme({
	palette: palette.dark,
	shape,
	typography,
	breakpoints,
	shadows: shadows.dark,
	customShadows: customShadows.dark,
	components,
})

darkTheme.components = componentsOverride(darkTheme)

export const lightTheme = createTheme({
	palette: palette.light,
	shape,
	typography,
	breakpoints,
	shadows: shadows.light,
	customShadows: customShadows.light,
	components,
})

lightTheme.components = componentsOverride(lightTheme)
