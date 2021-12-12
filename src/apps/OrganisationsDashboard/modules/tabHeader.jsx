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

const BUTTONS = ['Overview', 'Campaigns', 'Votings', 'Members', 'Settings']

export function TabHeader({ selectedTab, setSelectedTab }) {
	return (
		<TabContainer direction="row" justifyContent="space-between">
			{BUTTONS.map((text) => (
				<TabButton
					sx={{ backgroundColor: selectedTab === text ? '#1A1C1E' : undefined }}
					key={text}
					onClick={() => setSelectedTab(text)}
				>
					{text}
				</TabButton>
			))}
		</TabContainer>
	)
}
