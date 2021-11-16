import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Select from '@mui/material/Select'
import React, { useEffect, useState } from 'react'
import { data } from '../lib/data'
import CampaignCard from './CampaignCard'
import { styled } from '../../components'
import { ListTileSwitch, ListTileEnum } from '../components/ListTileSwitch'
import { useWallet } from 'src/context/Wallet'

const TileWrapper = styled(Box)(({ theme }) => ({
	display: 'grid',
	rowGap: theme.spacing(2),
	columnGap: theme.spacing(2),
	gridTemplateColumns: 'repeat( auto-fit, minmax(250px, 1fr) )',
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
		<Select value={filter} fullWidth onChange={handleOnChange}>
			{options.map((o) => (
				<MenuItem key={o.key} value={o.value}>
					{o.text}
				</MenuItem>
			))}
		</Select>
	)
}

const ScopeBar = ({ filter, setFilter }) => {
	const handleOnChange = (e) => setFilter(e.target.value)

	const options = [{ key: '-1', text: 'all', value: '-1' }].concat(data.protocol_types)

	return (
		<Select value={filter} fullWidth onChange={handleOnChange}>
			{options.map((o) => (
				<MenuItem key={o.key} value={o.value}>
					{o.text}
				</MenuItem>
			))}
		</Select>
	)
}

const CampaignGrid = ({ content }) => {
	const [pageContent, setPageContent] = useState([])
	const [page, setPage] = useState(0)
	const [pageSize, setPageSize] = useState(12)
	const [totalPages, setTotalPages] = useState(0)
	const [displayMode, setDisplayMode] = useState(ListTileEnum.TILE)
	const { account } = useWallet()

	const [filter, setFilter] = useState('1')
	const [scope, setScope] = useState(0) // 0 any 1 owned 2 contributed

	const iPP = [3, 5, 9, 18, 36, 72]
	const handleShowMoreItems = () =>
		setPageSize(pageSize < iPP.length - 1 ? pageSize + 1 : pageSize)
	const handleShowLessItems = () => setPageSize(pageSize > 0 ? pageSize - 1 : 0)

	const handlePaginationChange = (e, { activePage }) => setPage(activePage - 1)

	useEffect(() => {
		setTotalPages(Math.ceil(content.length / pageSize))
	}, [content, pageSize])

	useEffect(() => {
		if (totalPages === 0) return
		setPageContent(content.slice(page * pageSize, page * pageSize + pageSize))
	}, [content, page, pageSize, totalPages])

	useEffect(() => {
		if (!content) return

		// filter by campaign state
		const filterByState =
			filter === '-1'
				? content
				: content.filter((item) => (item.state === filter ? item : null))

		// filter by protocol

		// filter by scope
		const scopedContent =
			scope === '0'
				? filterByState
				: filterByState.filter((item) => {
						// owned / admin / controller
						if (scope === 1) return account.address === owner ? item : null
						if (scope === 2) return account.address === admin ? item : null
				  })

		// reset page
		setPage(0)
	}, [content, filter, scope])

	const Wrapper = React.useMemo(
		() => (displayMode === ListTileEnum.TILE ? TileWrapper : ListWrapper),
		[displayMode]
	)


	return (
		<Stack direction={'column'} spacing={2}>
			<Stack direction={'row'} spacing={2}>
				<FilterBar filter={filter} setFilter={setFilter} />
				<ScopeBar filter={scope} setFilter={setScope} />
				<ListTileSwitch mode={displayMode} onSwitch={(mode) => setDisplayMode(mode)} />
			</Stack>
			<Wrapper>
				{pageContent &&
					pageContent.map((item, index) => {
						// console.log(item)
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
		</Stack>
	)
}

export default CampaignGrid
