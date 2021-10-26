import React, { useEffect } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'

import { SubstrateContextProvider } from './substrate-lib'
import { WalletProvider } from './context/Wallet'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { IconContext } from 'react-icons'
import { darkTheme, lightTheme } from './themes/minimal'

import { Box } from './components'

export const Providers = (props) => {

	const [ isDarkMode, setDarkMode ] = React.useState(false)
	const toggleColorMode = () => setDarkMode( !isDarkMode )

	return (
		<>
			<ThemeProvider theme={ isDarkMode ? darkTheme : lightTheme }>
				<CssBaseline />
				<SubstrateContextProvider>
					 <WalletProvider>
						<BrowserRouter>
							<ScrollToTop />
							<IconContext.Provider value={{ color: ( isDarkMode ? 'white' : 'black'), className: 'react-icon' }}>{props.children}</IconContext.Provider>
						</BrowserRouter>
					</WalletProvider>
				</SubstrateContextProvider>
			</ThemeProvider>
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
