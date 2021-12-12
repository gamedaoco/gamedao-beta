import React, { useState } from 'react'
import { TabHeader } from './modules/tabHeader'

export function OrganisationsDashboard() {
	const [selectedTabState, setSelectedTabState] = useState('Overview')
	return (
		<>
			<TabHeader selectedTab={selectedTabState} setSelectedTab={setSelectedTabState} />
		</>
	)
}
