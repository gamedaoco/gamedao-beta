import React, { useEffect, useState } from 'react'
import { useIdentity } from 'src/hooks/useIdentity'
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

export function Members({ data }) {
	const { queryAccountIdentity, identities } = useIdentity()

	useEffect(() => {
		if (data?.bodyMembers) {
			queryAccountIdentity(data?.bodyMembers)
		}
	}, [data])

	return (
		<Paper>
			<Box padding={4}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Member</TableCell>
							<TableCell align="right">Shares</TableCell>
							<TableCell align="right">Join Date</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.bodyMembers?.map((member, index) => (
							<TableRow
								key={index}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell>
									<Stack direction="row" spacing={2} alignItems="center">
										<Avatar alt="user"></Avatar>
										<Stack>
											<Typography variant="h6">
												{identities?.[member]?.toHuman()?.info?.display
													?.Raw ?? ''}
											</Typography>
											<Typography variant="body1">{`${member.substr(
												0,
												15
											)}...${member.substr(member.length - 6)}`}</Typography>
										</Stack>
									</Stack>
								</TableCell>
								<TableCell align="right">TBD</TableCell>
								<TableCell align="right">TBD</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Box>
		</Paper>
	)
}
