import React, { useEffect } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'

import { SubstrateContextProvider } from './substrate-lib'
import { WalletProvider } from './context/Wallet'

import { styled } from './components'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { IconContext } from '@react-icons/all-files'
import { darkTheme, lightTheme } from './themes/minimal'
import { ToastContainer } from 'react-toastify'
import { StoreProvider } from './context/Store'
import { ThemeStateProvider, useThemeState } from './context/ThemeState'
import { NetworkProvider } from './context/Network'
import { HookProvider } from './context/Hook'

// Toastify css
import './Toastify.css'

const StyledToastContainer = styled(ToastContainer)`
	.Toastify__progress-bar {
		background: linear-gradient(
			90deg,
			#00f2c4 0%,
			#66f16d 13%,
			#b5e653 25%,
			#f6e900 38%,
			#ffcc00 50%,
			#ffb316 63%,
			#ff747d 75%,
			#ff4ea7 88%,
			#ff00df 100%
		);
		border-radius: 8px;
		transform: matrix(1, 0, 0, -1, 0, 0);
	}
  `;

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
							<HookProvider>{children}</HookProvider>
						</IconContext.Provider>
					</BrowserRouter>
				</WalletProvider>
			</SubstrateContextProvider>
			<StyledToastContainer theme={darkmodeEnabled ? 'dark' : 'light'} />
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
