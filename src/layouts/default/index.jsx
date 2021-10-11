import { ReactNode } from 'react'
import { Box, Container } from '@mui/material'
import Header from './Header'
import Footer from './Footer'

const Page = ({ setAccountAddress, accountPair, children }) => {
	return (
		<Box sx={{ height: '100%' }}>
			<Header setAccountAddress={setAccountAddress} accountPair={accountPair} />
			<Container>
				<Box sx={{ m: '2em', minHeight: '95vh' }}>{children}</Box>
			</Container>
			<Footer />
		</Box>
	)
}

export default Page
