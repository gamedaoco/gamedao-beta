import React from 'react'
//import { store } from './store';
//import { Provider as ReduxProvider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { IconContext } from 'react-icons'
import { SubstrateContextProvider } from './substrate-lib'

import { darkTheme, lightTheme } from './themes/minimal'

import { Box } from './components'

export const Providers = (props) => {
	const [isDarkMode, setDarkMode] = React.useState(false)

	function toggleColorMode() {
		setDarkMode(!isDarkMode)
	}

	return (
		<>
			<ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
				<CssBaseline />
				{/*<ReduxProvider store={store}>*/}
				<SubstrateContextProvider>
					<BrowserRouter>
						<ScrollToTop />
						<IconContext.Provider value={{ color: 'black', className: 'react-icon' }}>{props.children}</IconContext.Provider>
					</BrowserRouter>
				</SubstrateContextProvider>
				{/*</ReduxProvider>*/}
			</ThemeProvider>
			<DarkModeSwitch isDarkMode={isDarkMode} onClick={toggleColorMode} />
		</>
	)
}

function DarkModeSwitch({ isDarkMode, onClick }) {
	return (
		<Box
			onClick={onClick}
			sx={{
				position: 'fixed',
				bottom: '1rem',
				right: '1rem',
				cursor: 'pointer',
			}}
		>
			{isDarkMode ? '☀️' : '🌙'}
		</Box>
	)
}

export default function ScrollToTop() {
	const { pathname } = useLocation()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [pathname])

	return null
}
