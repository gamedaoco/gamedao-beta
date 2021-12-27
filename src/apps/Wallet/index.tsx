import React from 'react'
import { useApiProvider } from '@substra-hooks/core'
import { useWallet } from 'src/context/Wallet'

import { Container, Typography } from 'src/components'
import ConnectOrInstall from './ConnectOrInstall'
import WalletView from './WalletView'

const Component = (props) => {

	const { address, connected } = useWallet()

	return (
		<Container maxWidth="lg">

			<Typography variant="h3" sx={{
				mb: 2,
				opacity: ( address ) ? 1 : 0.1,
				transition: '150ms'
			}}>
				Wallet
			</Typography>

			{ !address || !connected
				? <ConnectOrInstall/>
				: <WalletView/>
			}

		</Container>
	)

}

export default function Dapp(props) {
	const apiProvider = useApiProvider()
	return apiProvider ? <Component /> : null
}
