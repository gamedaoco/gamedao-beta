import * as React from 'react'
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

export const darkTheme = createTheme({
	palette: palette.dark,
	shape,
	typography,
	breakpoints,
	shadows: shadows.dark,
	customShadows: customShadows.dark,
})

darkTheme.components = componentsOverride(darkTheme)

export const lightTheme = createTheme({
	palette: palette.light,
	shape,
	typography,
	breakpoints,
	shadows: shadows.light,
	customShadows: customShadows.light,
})

lightTheme.components = componentsOverride(lightTheme)
