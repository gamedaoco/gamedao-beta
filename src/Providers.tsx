import React, { createContext, useContext, useEffect } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'

import { SubstrateContextProvider } from './substrate-lib'
import { WalletProvider } from './context/Wallet'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { IconContext } from 'react-icons'
import { darkTheme, lightTheme } from './themes/minimal'
import { ToastContainer } from 'react-toastify'

export type ThemeState = {
	darkmodeEnabled: boolean
	setDarkmodeEnabled: (enabled: boolean) => void
}

const INITIAL_STATE: ThemeState = {
	darkmodeEnabled: false,
	setDarkmodeEnabled: (enabled: boolean) => {},
}

const ThemeContext = createContext<ThemeState>(INITIAL_STATE)
export const useThemeState = () => useContext(ThemeContext)

export const Providers = (props) => {
	const [state, setState] = React.useState(INITIAL_STATE)

	useEffect(() => {
		const localStorageDarkMode = localStorage.getItem('darkMode') || 'false'
		if (JSON.parse(localStorageDarkMode) === true) {
			setState({ ...state, darkmodeEnabled: true })
		}
	}, [])

	function handleSetDarkModeEnabled(enabled: boolean) {
		setState({ ...state, darkmodeEnabled: enabled })
		localStorage.setItem('darkMode', enabled.toString())
	}

	return (
		<>
			<ThemeProvider theme={state.darkmodeEnabled ? darkTheme : lightTheme}>
				<CssBaseline />
				<SubstrateContextProvider>
					<WalletProvider>
						<ThemeContext.Provider
							value={{
								...state,
								setDarkmodeEnabled: handleSetDarkModeEnabled,
							}}
						>
							<BrowserRouter>
								<ScrollToTop />
								<IconContext.Provider value={{ color: state.darkmodeEnabled ? 'white' : 'black', className: 'react-icon' }}>
									{props.children}
								</IconContext.Provider>
							</BrowserRouter>
						</ThemeContext.Provider>
					</WalletProvider>
				</SubstrateContextProvider>
			</ThemeProvider>
			<ToastContainer theme={state.darkmodeEnabled ? 'dark' : 'light'} />
		</>
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
