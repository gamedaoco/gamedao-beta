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
		<Box
			sx={{
				height: '100%',
				display: 'flex',
				flexDirection: 'row',
			}}
		>
			<Box flexGrow={0}>
				{ showHeader && <Header showNavigation={showNavigation?showNavigation:null} /> }
			</Box>
			<Box flexGrow={1}>
				<Container>
					<Box sx={{ m: '2em', minHeight: '95vh' }}>{children}</Box>
				</Container>
				{ showFooter && <Footer/> }
			</Box>
		</Box>
	)
}

export default Layout
