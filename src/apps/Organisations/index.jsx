import React, { useEffect, useState } from 'react'
import { useApiProvider } from '@substra-hooks/core'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useWallet } from 'src/context/Wallet'
import { useTheme } from '@mui/material/styles'

import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import { Box, Button, Container } from '../../components'
import { ItemList } from './modules/ItemList'

import CreateDAO from './Create'

export const Main = (props) => {
	const theme = useTheme()
	const bgPlain = { backgroundColor: theme.palette.grey[500_16] }

	const { address, connected } = useWallet()
	const { account } = useWallet()
	const [content, setContent] = useState()
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
			const content = Object.keys(bodyIndex).map((index) => {
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

			setContent(content)
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
		<Container>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Box>
					{!nonce || nonce === 0 ? (
						nonce === 0 ? (
							<h4>No organisations yet. Create one!</h4>
						) : (
							<h4>Loading...</h4>
						)
					) : (
						<h4>Total organisations: {nonce}</h4>
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
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				{showCreateMode && connected && <CreateDAO />}
				{!showCreateMode && content && <ItemList data={content} />}
			</Box>
		</Container>
	)
}

export default function Module(props) {
	const apiProvider = useApiProvider()
	return apiProvider ? <Main {...props} /> : null
}
