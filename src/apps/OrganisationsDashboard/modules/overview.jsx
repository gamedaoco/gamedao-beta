import React from 'react'
import { Box, Stack, Paper, Typography } from '../../../components'

export function Overview({ metaData }) {
	return (
		<>
			<Paper>
				<Box padding={4}>
					<Typography>{metaData?.description || ''}</Typography>
				</Box>
			</Paper>
			<Paper padding={4}>
				<Box padding={4}>Votings</Box>
			</Paper>
			<Paper padding={4}>
				<Box padding={4}>Campaigns</Box>
			</Paper>
		</>
	)
}
