import { Box, Container } from '@mui/material'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

interface ComponentProps {
	showHeader?: boolean
	showFooter?: boolean
	showSidebar?: boolean
	showNavigation?: boolean
	showWallet?: boolean
	children?: React.ReactNode
}

const Layout = ({ showHeader, showFooter, showSidebar, children, showNavigation, showWallet = true }: ComponentProps) => {
	return (
		<>
			<Box
				sx={{
					height: '100%',
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				<Box flexGrow={0}>{showSidebar && <Sidebar showNavigation={showNavigation ? showNavigation : null} />}</Box>

				<Box flexGrow={1}>
					{showHeader && <Header showWallet={showWallet ? showWallet : null} />}
					<Container>
						<Box sx={{ minHeight: '95vh' }}>{children}</Box>
					</Container>
				</Box>
			</Box>
			<Box flexGrow={1}>{showFooter && <Footer />}</Box>
		</>
	)
}

export default Layout
