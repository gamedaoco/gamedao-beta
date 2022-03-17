import React, { useEffect, useState } from 'react'
import { useGameDaoGovernance } from 'src/hooks/useGameDaoGovernance'
import { useTheme } from '@mui/material/styles'
import { Box, Paper, Stack, Typography } from 'src/components'
import { ProposalItem } from './ProposalItem'
import { useGameDaoControl } from '../../../hooks/useGameDaoControl'
import { useCrowdfunding } from '../../../hooks/useCrowdfunding'
import { useWallet } from '../../../context/Wallet'

export function ProposalList({ setProposalCount }) {
	const theme = useTheme()
	const bgPlain = { backgroundColor: theme.palette.grey[500_16] }

	const { address } = useWallet()
	const { proposals } = useGameDaoGovernance()
	const { memberships, queryMemberships } = useGameDaoControl()
	const { campaigns, campaignContributors, campaignState } = useCrowdfunding()

	const [filteredProposals, setFilteredProposals] = useState([])

	// Load memberships
	useEffect(() => {
		if (!address) return

		queryMemberships(address)
	}, [address])

	// Filter proposals by membership of an DAO
	useEffect(() => {
		if (!proposals) return
		const membershipIds = memberships?.[address] ?? []

		const filteredProposals = Object.values(proposals).filter((proposal) => {
			switch (`${proposal.proposal_type}`) {
				case '0':
					return membershipIds.includes(proposal.context_id)
				case '3':
					const campaign = campaigns?.[proposal.context_id]
					if (campaign?.org) {
						return (
							membershipIds.includes(campaign.org) ||
							(campaignState?.[campaign.id] === '3' &&
								campaignContributors?.[campaign.id]?.includes(address))
						)
					}

					return false
			}

			console.error(`Invalid proposal type: ${proposal.proposal_type}`, proposal)
			return false
		})

		setProposalCount(filteredProposals.length)
		setFilteredProposals(filteredProposals)
	}, [proposals, memberships, campaignContributors])

	return proposals ? (
		<Paper sx={{ ...bgPlain }}>
			<Box display="flex" padding={4}>
				<Stack width={'100%'} spacing={5}>
					{/*					<Typography variant="h6">Open votings</Typography> */}
					<Box>
						{filteredProposals.map((proposal: any, i: number, arr: string[]) => (
							<ProposalItem
								proposal={proposal}
								showDivider={i + 1 < arr.length}
								key={`proposal_${proposal.proposal_id}`}
							/>
						))}
					</Box>
				</Stack>
			</Box>
		</Paper>
	) : null
}
export default ProposalList
