import React from 'react'
import { Button, Stack, styled, useTheme } from '../../../components'

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

const TabButton = styled(Button)(
	({
		theme: {
			palette: {
				text: { primary },
			},
		},
	}) => ({
		borderRadius: '68px',
		color: primary,
		padding: '0.5rem 1.5rem',
	})
)

export function TabHeader({
	selectedTab,
	setSelectedTab,
	isAdmin,
	campaignsCount,
	votingCount,
	memberCount,
}) {
	const {
		palette: {
			tabButton: { normal, active },
		},
	} = useTheme()
	return (
		<TabContainer direction="row" justifyContent="space-between">
			<TabButton
				sx={{ backgroundColor: selectedTab === 'Overview' ? active : normal }}
				onClick={() => setSelectedTab('Overview')}
			>
				{'Overview'}
			</TabButton>
			{campaignsCount > 0 && (
				<TabButton
					sx={{ backgroundColor: selectedTab === 'Campaigns' ? active : normal }}
					onClick={() => setSelectedTab('Campaigns')}
				>
					{`Campaigns ( ${campaignsCount} )`}
				</TabButton>
			)}

			{votingCount > 0 && (
				<TabButton
					sx={{ backgroundColor: selectedTab === 'Votings' ? active : normal }}
					onClick={() => setSelectedTab('Votings')}
				>
					{`Votings ( ${votingCount} )`}
				</TabButton>
			)}
			<TabButton
				sx={{ backgroundColor: selectedTab === 'Members' ? active : normal }}
				onClick={() => setSelectedTab('Members')}
			>
				{`Members ( ${memberCount} )`}
			</TabButton>

			{isAdmin() && (
				<TabButton
					sx={{ backgroundColor: selectedTab === 'Settings' ? active : normal }}
					onClick={() => setSelectedTab('Settings')}
				>
					{'Settings'}
				</TabButton>
			)}
		</TabContainer>
	)
}
