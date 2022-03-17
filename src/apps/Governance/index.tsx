import React, { useState } from 'react'
import { useApiProvider } from '@substra-hooks/core'
import { useWallet } from 'src/context/Wallet'
import { useTheme } from '@mui/material/styles'

import Add from '@mui/icons-material/Add'
import Close from '@mui/icons-material/Close'
import { Badge, Box, Button, Container, styled, Typography, Paper } from 'src/components'

import CreateProposal from './modules/Create'
import ProposalList from './modules/ProposalList'

const NavBadge = styled(Badge)(({ theme }) => ({
	'& .MuiBadge-badge': {
		color: theme.palette.background.default,
		borderRadius: 6,
		right: 'initial',
	},
}))

export const Main = () => {
	const theme = useTheme()
	const { connected } = useWallet()
	const [proposalCount, setProposalCount] = useState(0)
	const [showCreateMode, setCreateMode] = useState(false)
	const bgPlain = { backgroundColor: theme.palette.grey[500_16] }

	return (
		<Container maxWidth="xl">
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Box>
					<Typography variant="h6">
						{!proposalCount || proposalCount === 0
							? proposalCount === 0
								? showCreateMode
									? `Create Proposal`
									: `No proposals yet. Create one!`
								: `Loading...`
							: `Total proposals: ${proposalCount}`}
					</Typography>
				</Box>

				<Box display="flex" justifyContent="flex-end" alignItems="center" flex="1">
					{connected && (
						<Button
							variant="outlined"
							onClick={() => setCreateMode(!showCreateMode)}
							startIcon={showCreateMode ? <Close /> : <Add />}
						>
							{showCreateMode ? 'Cancel' : 'New Proposal'}
						</Button>
					)}
				</Box>
			</Box>

			{/*			<Box>
				<Typography variant='body2'>
					Collective decisions are made through proposals and votes
					to ensure everyone in the organisation has a voice.
				</Typography>
			</Box>*/}

			<br />
			{showCreateMode && connected && <CreateProposal />}
			{!showCreateMode && <ProposalList setProposalCount={setProposalCount} />}
		</Container>
	)
}

export default function Module(props) {
	const apiProvider = useApiProvider()
	return apiProvider ? <Main {...props} /> : null
}
