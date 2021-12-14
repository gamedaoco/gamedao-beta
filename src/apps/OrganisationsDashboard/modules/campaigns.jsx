import React from 'react'
import CampaignCard from '../../Campaigns/CampaignCard'
import { ListTileEnum } from 'src/apps/components/ListTileSwitch'
import {
	Box,
	Paper,
	Stack,
	Avatar,
	Typography,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
} from '../../../components'

export function Campaigns({ campaigns }) {
	if (!campaigns || campaigns.length === 0) {
		return null
	}

	return (
		<Stack spacing={4}>
			<Stack direction="row" justifyContent="space-between">
				<Typography variant="h5">Campaigns</Typography>
				<Box>Filter TBD</Box>
			</Stack>
			{campaigns?.map((campaign, i) => (
				<CampaignCard
					displayMode={ListTileEnum.LIST}
					key={campaign.id}
					item={campaign}
					index={i}
				/>
			))}
		</Stack>
	)
}
