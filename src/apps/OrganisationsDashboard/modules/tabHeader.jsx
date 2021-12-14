import React from 'react'
import { Stack, Button, styled } from '../../../components'

const TabContainer = styled(Stack)(
	({
		theme: {
			palette: {
				background: { paper },
			},
		},
	}) => ({
		backgroundColor: paper,
		border: '1px solid #30353C',
		boxSizing: 'border-box',
		boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
		borderRadius: '68px',
		padding: '0.2rem',
	})
)

const TabButton = styled(Button)({
	borderRadius: '68px',
	color: '#FFFFFF',
	padding: '0.5rem 1.5rem',
})

export function TabHeader({
	selectedTab,
	setSelectedTab,
	isAdmin,
	campaignsCount,
	votingCount,
	memberCount,
}) {
	return (
		<TabContainer direction="row" justifyContent="space-between">
			<TabButton
				sx={{ backgroundColor: selectedTab === 'Overview' ? '#1A1C1E' : undefined }}
				onClick={() => setSelectedTab('Overview')}
			>
				{'Overview'}
			</TabButton>
			{campaignsCount > 0 && (
				<TabButton
					sx={{ backgroundColor: selectedTab === 'Campaigns' ? '#1A1C1E' : undefined }}
					onClick={() => setSelectedTab('Campaigns')}
				>
					{`Campaigns ( ${campaignsCount} )`}
				</TabButton>
			)}

			{votingCount > 0 && (
				<TabButton
					sx={{ backgroundColor: selectedTab === 'Votings' ? '#1A1C1E' : undefined }}
					onClick={() => setSelectedTab('Votings')}
				>
					{`Votings ( ${votingCount} )`}
				</TabButton>
			)}
			<TabButton
				sx={{ backgroundColor: selectedTab === 'Members' ? '#1A1C1E' : undefined }}
				onClick={() => setSelectedTab('Members')}
			>
				{`Members ( ${memberCount} )`}
			</TabButton>

			{isAdmin() && (
				<TabButton
					sx={{ backgroundColor: selectedTab === 'Settings' ? '#1A1C1E' : undefined }}
					onClick={() => setSelectedTab('Settings')}
				>
					{'Settings'}
				</TabButton>
			)}
		</TabContainer>
	)
}
