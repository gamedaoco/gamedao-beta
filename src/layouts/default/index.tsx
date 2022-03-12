import { styled } from '../../components'
import { Box, Container } from '@mui/material'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

interface ComponentProps {
	showHeader?: boolean
	showFooter?: boolean
	showSidebar?: boolean
	showNavigation?: boolean
	noContainer?: boolean
	children?: React.ReactNode
}

const Wrapper = styled(Container)( ({ theme }) => ({
	minHeight: '100vh',
	padding: '0.5rem',
	[theme.breakpoints.up('sm')]: {
		padding: '1rem'
	},
	[theme.breakpoints.up('md')]: {
		padding: '1rem'
	},
	[theme.breakpoints.up('lg')]: {
		padding: '2rem'
	},
}))

const Layout = ({
	showHeader,
	showFooter,
	showSidebar,
	children,
	showNavigation,
	noContainer,
}: ComponentProps) => {
	return (
		<>
			{showHeader && (
				<Box flexGrow={1}>
					<Header />
				</Box>
			)}

			<Box
				sx={{
					height: '100%',
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				{showSidebar && (
					<Box flexGrow={0}>
						<Sidebar showNavigation={showNavigation ? showNavigation : null} />
					</Box>
				)}

				<Box flexGrow={1}>
					{noContainer ? (
						<Box>{children}</Box>
					) : (
						<Wrapper>{children}</Wrapper>
					)}
				</Box>
			</Box>

			{showFooter && (
				<Box flexGrow={1}>
					<Footer />
				</Box>
			)}
		</>
	)
}

export default Layout
