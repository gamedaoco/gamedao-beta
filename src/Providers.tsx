import React, { useEffect } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'

import { SubstrateContextProvider } from './substrate-lib'
import { WalletProvider } from './context/Wallet'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { IconContext } from 'react-icons'
import { darkTheme, lightTheme } from './themes/minimal'
import { ToastContainer } from 'react-toastify'

import { Box } from './components'

export const Providers = (props) => {
	const [isDarkMode, setDarkMode] = React.useState(false)
	const toggleColorMode = () => {
		localStorage.setItem('darkMode', JSON.stringify(!isDarkMode))
		setDarkMode(!isDarkMode)
	}

	useEffect(() => {
		const localStorageDarkMode = localStorage.getItem('darkMode') || 'false'
		if (JSON.parse(localStorageDarkMode) === true) {
			setDarkMode(true)
		}
	}, [])

	return (
		<>
			<ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
				<CssBaseline />
				<SubstrateContextProvider>
					<WalletProvider>
						<BrowserRouter>
							<ScrollToTop />
							<IconContext.Provider value={{ color: isDarkMode ? 'white' : 'black', className: 'react-icon' }}>
								{props.children}
							</IconContext.Provider>
						</BrowserRouter>
					</WalletProvider>
				</SubstrateContextProvider>
			</ThemeProvider>
			<ToastContainer theme={isDarkMode ? 'dark' : 'light'} />
			<ThemeSwitcher isDarkMode={isDarkMode} onClick={toggleColorMode} />
		</>
	)
}

function ThemeSwitcher({ isDarkMode, onClick }) {
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

export function ScrollToTop() {
	const { pathname } = useLocation()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [pathname])

	return null
}

export default Providers
