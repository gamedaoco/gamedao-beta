import React, { useEffect, useState } from 'react'
import { useWallet } from 'src/context/Wallet'
import { data } from '../lib/data'
import { Container, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { styled } from '../../components'
import { ListTileSwitch, ListTileEnum } from '../components/ListTileSwitch'
import CampaignCard from './CampaignCard'

const TileWrapper = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexWrap: 'wrap',
	rowGap: theme.spacing(2),
	columnGap: theme.spacing(2),
	// gridTemplateColumns: 'repeat( auto-fit, minmax(200px, 1fr) )',
}))

const ListWrapper = styled(Box)(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: '1fr',
	rowGap: theme.spacing(2),
	columnGap: theme.spacing(2),
}))

const FilterBar = ({ filter, setFilter }) => {
	const handleOnChange = (e) => setFilter(e.target.value)
	const options = [{ key: '-1', text: 'all', value: '-1' }].concat(data.campaign_states)
	return (
		<FormControl fullWidth>
			<InputLabel id="filter-status-label">Campaign State</InputLabel>
			<Select
				size="small"
				label="Campaign State"
				labelId="filter-status-label"
				sx={{ mr: 1 }}
				value={filter}
				onChange={handleOnChange}
			>
				{options.map((o) => (
					<MenuItem key={o.key} value={o.value}>
						{' '}
						{o.text}{' '}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	)
}

const ProtocolBar = ({ filter, setFilter }) => {
	const handleOnChange = (e) => setFilter(e.target.value)
	const options = [{ key: '-1', text: 'all protocols', value: '-1' }].concat(data.protocol_types)
	return (
		<FormControl fullWidth>
			<InputLabel id="filter-protocol-label">Protocol</InputLabel>
			<Select
				labelId="filter-protocol-label"
				size="small"
				sx={{ mr: 1 }}
				label="Protocol"
				value={filter}
				onChange={handleOnChange}
			>
				{options.map((o) => (
					<MenuItem key={o.key} value={o.value}>
						{' '}
						{o.text}{' '}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	)
}

/*const ScopeBar = ({ filter, setFilter }) => {
	const handleOnChange = (e) => setFilter(e.target.value)
	const options = [
		{ key: '-1', text: 'all scopes', value: '-1' },
		{ key: '1', text: 'all campaigns', value: '1' },
		{ key: '2', text: 'created campaigns', value: '2' }
	]
	return (
		<Select label="Scope" value={filter} fullWidth onChange={handleOnChange}>
			{options.map((o) => <MenuItem key={o.key} value={o.value}> {o.text} </MenuItem>)}
		</Select>
	)
}*/

const CampaignGrid = ({ content }) => {
	const { account } = useWallet()

	const [pageContent, setPageContent] = useState([])
	const [filteredContent, setFilteredContent] = useState([])

	const [filter, setFilter] = useState('-1')
	const [protocol, setProtocol] = useState('-1')
	const [scope, setScope] = useState('1') // 0 any 1 owned 2 contributed

	const [page, setPage] = useState(0)
	const [pageSize, setPageSize] = useState(30)
	const [totalPages, setTotalPages] = useState(0)
	const [displayMode, setDisplayMode] = useState(ListTileEnum.TILE)
	const iPP = [3, 5, 9, 18, 36, 72]

	const handleShowMoreItems = () =>
		setPageSize(pageSize < iPP.length - 1 ? pageSize + 1 : pageSize)
	const handleShowLessItems = () => setPageSize(pageSize > 0 ? pageSize - 1 : 0)
	const handlePaginationChange = (e, { activePage }) => setPage(activePage - 1)

	useEffect(() => {
		if (!content) return
		// console.log('content',content)

		// filter by campaign state
		const filterByState =
			filter === '-1'
				? content
				: content.filter((item) => (item.state === filter ? item : null))

		// filter by protocol
		const filterByProtocol =
			protocol === '-1'
				? filterByState
				: filterByState.filter((item) => (item.protocol === protocol ? item : null))

		// filter by scope
		// const scopedContent =
		// 	scope === '0'
		// 		? filterByState
		// 		: filterByState.filter((item) => {
		// 				// owned / admin / controller
		// 				if (scope === 1) return account.address === owner ? item : null
		// 				if (scope === 2) return account.address === admin ? item : null
		// 		  })

		let new_set = [].concat(filterByProtocol)

		// console.log('filter:', filter, protocol, scope, filterByProtocol)
		// setFilteredContent(filterByProtocol)
		setPageContent(new_set)

		// reset page
		setPage(0)
	}, [content, filter, scope, protocol])

	// useEffect(() => {
	// 	if (totalPages === 0) return
	// 	// setPageContent(content.slice(page * pageSize, page * pageSize + pageSize))
	// 	setPageContent(filteredContent)
	// }, [filteredContent, page, pageSize, totalPages])

	useEffect(() => {
		setTotalPages(Math.ceil(pageContent.length / pageSize))
	}, [pageContent, pageSize])

	const Wrapper = React.useMemo(
		() => (displayMode === ListTileEnum.TILE ? TileWrapper : ListWrapper),
		[displayMode]
	)

	// console.log('pageContent',pageContent)

	return (
		<Container>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<FilterBar filter={filter} setFilter={setFilter} />
				<ProtocolBar filter={protocol} setFilter={setProtocol} />
				<ListTileSwitch mode={displayMode} onSwitch={(mode) => setDisplayMode(mode)} />
			</Box>
			<Wrapper>
				{pageContent &&
					pageContent.map((item, index) => {
						const c = (
							<CampaignCard
								displayMode={displayMode}
								key={index}
								item={item}
								index={index}
							/>
						)
						if (filter === '-1') return c
						return item.state === filter ? c : null
					})}
			</Wrapper>
		</Container>
	)
}

export default CampaignGrid
