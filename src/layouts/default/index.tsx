import { Box, Container } from '@mui/material'
import Header from './Header'
import Footer from './Footer'

interface ComponentProps {
	showHeader?: boolean
	showFooter?: boolean
	showDrawer?: boolean
	showNavigation?: boolean
	children?: React.ReactNode
}

const Layout = ({ showHeader, showFooter, showDrawer, children, showNavigation }: ComponentProps) => {
	return (
		<Box sx={{ height: '100%' }}>
			{ showHeader && <Header showNavigation={showNavigation?showNavigation:null} /> }
			<Container>
				<Box sx={{ m: '2em', minHeight: '95vh' }}>{children}</Box>
			</Container>
			{ showFooter && <Footer/> }
		</Box>
	)
}

export default Layout
