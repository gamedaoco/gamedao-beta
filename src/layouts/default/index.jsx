import { Box, Container } from '@mui/material'
import Header from './Header'
import Footer from './Footer'

const Page = ({ setAccountAddress, accountPair, children }) => {
	return (
		<Box
			sx={{
				height: '100%',
				display: 'flex',
				flexDirection: 'row',
			}}
		>
			<Box flexGrow={0}>
				<Header setAccountAddress={setAccountAddress} accountPair={accountPair} />
			</Box>
			<Box flexGrow={1}>
				<Container>
					<Box sx={{ m: '2em', minHeight: '95vh' }}>{children}</Box>
				</Container>
				<Footer />
			</Box>
		</Box>
	)
}

export default Page
