import React, { useEffect, useState, lazy } from 'react'
import { useApiProvider } from '@substra-hooks/core'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useWallet } from 'src/context/Wallet'
import { alpha, useTheme } from '@mui/material/styles'

import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import { Button, Box, Container } from '../../components'
import { ItemList } from './modules/ItemList'

const CreateDAO = lazy(() => import('./Create'))

export const Main = (props) => {

	const theme = useTheme()
	const bgPlain = { backgroundColor: theme.palette.grey[500_16] }

	const { address, connected } = useWallet()
	const { account } = useWallet()
	const [dataState, setDataState] = useState()
	const {
		nonce,
		bodyIndex,
		bodyConfig,
		bodyMemberCount,
		bodies,
		bodyController,
		bodyAccess,
		bodyTreasury,
	} = useGameDaoControl()

	useEffect(() => {
		if (
			nonce &&
			bodyIndex &&
			bodyConfig &&
			bodyMemberCount &&
			bodies &&
			bodyController &&
			bodyAccess &&
			bodyTreasury
		) {
			const data = Object.keys(bodyIndex).map((index) => {
				const hash = bodyIndex[index]
				const config = bodyConfig[hash]
				const members = bodyMemberCount[hash]
				const body = bodies[hash]
				const controller = bodyController[hash]
				const access = bodyAccess[hash]
				const treasury = bodyTreasury[hash]

				return {
					hash,
					config,
					members,
					body,
					controller,
					access,
					treasury,
				}
			})

			setDataState(data)
		}
	}, [
		nonce,
		bodyIndex,
		bodyConfig,
		bodyMemberCount,
		bodies,
		bodyController,
		bodyAccess,
		bodyTreasury,
	])

	const [showCreateMode, setCreateMode] = useState(false)
	const handleCreateBtn = (e) => setCreateMode(true)
	const handleCloseBtn = (e) => setCreateMode(false)

	return (
		<Container maxWidth="lg">
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				<Box>
					{!nonce || nonce === 0 ? (
						nonce === 0 ? (
							<h4>No organizations yet. Create one!</h4>
						) : (
							<h4>Loading...</h4>
						)
					) : (
						<h4>Total organizations: {nonce}</h4>
					)}
				</Box>
				<Box>
					{address && showCreateMode ? (
						<Button
							variant="outlined"
							startIcon={<ClearIcon />}
							onClick={handleCloseBtn}
						>
							Close
						</Button>
					) : account && connected ? (
						<Button
							variant="outlined"
							startIcon={<AddIcon />}
							onClick={handleCreateBtn}
						>
							New DAO
						</Button>
					) : null}
				</Box>
			</Box>
			<br />
			{showCreateMode && connected && <CreateDAO />}
			{!showCreateMode && dataState && <ItemList data={dataState} />}
		</Container>
	)
}

export default function Module(props) {
	const apiProvider = useApiProvider()
	return apiProvider ? <Main {...props} /> : null
}
