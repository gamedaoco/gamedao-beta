import React, { useEffect } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'

import { SubstrateContextProvider } from './substrate-lib'
import { WalletProvider } from './context/Wallet'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { IconContext } from '@react-icons/all-files' 	
import { darkTheme, lightTheme } from './themes/minimal'
import { ToastContainer } from 'react-toastify'
import { StoreProvider } from './context/Store'
import { ThemeStateProvider, useThemeState } from './context/ThemeState'
import { NetworkProvider } from './context/Network'

// Toastify css
import './Toastify.css'

function Wrapper({ children }) {
	const { darkmodeEnabled } = useThemeState()
	return (
		<ThemeProvider theme={darkmodeEnabled ? darkTheme : lightTheme}>
			<CssBaseline />
			<SubstrateContextProvider>
				<WalletProvider>
					<BrowserRouter>
						<ScrollToTop />
						<IconContext.Provider
							value={{
								color: darkmodeEnabled ? 'white' : 'black',
								className: 'react-icon',
							}}
						>
							{children}
						</IconContext.Provider>
					</BrowserRouter>
				</WalletProvider>
			</SubstrateContextProvider>
			<ToastContainer theme={darkmodeEnabled ? 'dark' : 'light'} />
		</ThemeProvider>
	)
}

export const Providers = ({ children }) => {
	return (
		<StoreProvider>
			<ThemeStateProvider>
				<NetworkProvider>
					<Wrapper>{children}</Wrapper>
				</NetworkProvider>
			</ThemeStateProvider>
		</StoreProvider>
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
