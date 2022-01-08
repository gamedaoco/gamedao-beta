import React, { useEffect, useState } from 'react'
import { useApiProvider } from '@substra-hooks/core'

import { useWallet } from 'src/context'
import { useIdentity, useCrowdfunding, useGameDaoControl, useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'

import { Button, Grid, Typography } from 'src/components'
import { Icons, ICON_MAPPING } from 'src/components/Icons'
import { Box, Stack, Divider, Card } from 'src/components'

import DashboardUserConnected from 'src/apps/DashboardUserConnected'

const Dashboard = (props) => {
	const apiProvider = useApiProvider()
	const { address, signAndNotify } = useWallet()
	const { identities } = useIdentity(address)
	const crowdfunding = useCrowdfunding()
	const { nonce } = useGameDaoControl()
	const { proposalsCount } = useGameDaoGovernance()
	const [name, setName] = useState('')

	useEffect(() => {
		setName(identities?.[address]?.toHuman()?.info?.display?.Raw ?? '')
	}, [identities])

	// if logged in render custom dashboard instead
	if (identities?.[address]) return <DashboardUserConnected />

	return (
		<>
			<Grid container spacing={2}>

				<Grid item xs={12} sx={{ display: 'flex', justifyContent: 'start' }}>
					<Typography variant="h5">Global Dashboard</Typography>
				</Grid>

			</Grid>
		</>
	)
}

export default function Dapp(props) {
	const apiProvider = useApiProvider()
	return apiProvider ? <Dashboard {...props} /> : null
}
