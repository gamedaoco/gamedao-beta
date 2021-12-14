import React from 'react'
import { Box, Stack, Paper, Typography, Button } from '../../../components'
import AddIcon from '@mui/icons-material/Add'
import CampaignCard from '../../Campaigns/CampaignCard'
import { ListTileEnum } from 'src/apps/components/ListTileSwitch'
import { ProposalItem } from '../../Governance/modules/ProposalItem'

export function Overview({
	metaData,
	campaigns,
	votings,
	blockNumber,
	setCreateCampaignState,
	setCreateVoatingState,
}) {
	return (
		<>
			<Paper>
				<Box padding={4}>
					<Typography>{metaData?.description || ''}</Typography>
				</Box>
			</Paper>
			<Paper padding={4}>
				<Box padding={4}>
					{votings?.length > 0 ? (
						<Stack spacing={2}>
							<Typography variant="h5">Votings</Typography>
							{votings.slice(0, 2).map((proposals, i) => (
								<ProposalItem blockNumber={blockNumber} proposal={proposals} />
							))}
						</Stack>
					) : (
						<>
							<Stack
								direction="row"
								justifyContent="space-between"
								alignItems="center"
							>
								<Stack spacing={2} maxWidth="60%">
									<Typography variant="h5">No proposals yet. </Typography>
									<Typography>
										Decisions are governed by proposals and voting to ensure
										everyone in the organisation has a voice. Create a new
										proposal.
									</Typography>
								</Stack>
								<Box>
									<Button
										variant="contained"
										startIcon={<AddIcon />}
										sx={{ whiteSpace: 'nowrap' }}
										onClick={() => setCreateVoatingState(true)}
									>
										New Proposal
									</Button>
								</Box>
							</Stack>
						</>
					)}
				</Box>
			</Paper>
			<Paper padding={4}>
				<Box padding={4}>
					{campaigns?.length > 0 ? (
						<Stack spacing={2}>
							<Typography variant="h5">Campaigns</Typography>
							{campaigns.slice(0, 2).map((campaign, i) => (
								<CampaignCard
									displayMode={ListTileEnum.LIST}
									key={campaign.id}
									item={campaign}
									index={i}
								/>
							))}
						</Stack>
					) : (
						<>
							<Stack
								direction="row"
								justifyContent="space-between"
								alignItems="center"
							>
								<Stack spacing={2} maxWidth="60%">
									<Typography variant="h5">Campaigns</Typography>
									<Typography>
										Pretty empty here :(. Create your first campain and unleash
										the power of the community.
									</Typography>
								</Stack>
								<Box>
									<Button
										variant="contained"
										startIcon={<AddIcon />}
										sx={{ whiteSpace: 'nowrap' }}
										onClick={() => setCreateCampaignState(true)}
									>
										Create Campaign
									</Button>
								</Box>
							</Stack>
						</>
					)}
				</Box>
			</Paper>
		</>
	)
}