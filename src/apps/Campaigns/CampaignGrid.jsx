import React, { useState, useEffect } from 'react'
import { Container, Grid, Form, Radio, Pagination, Button, Icon, Menu } from 'semantic-ui-react'
import CampaignCard from './CampaignCard'
import { data, rnd } from '../lib/data'

const FilterBar = ({ filter, setFilter }) => {
	const handleOnChange = (e, { value }) => setFilter(value)

	const options = [{ key: '-1', text: 'all', value: '-1' }].concat(data.campaign_states)

	return (
		<Form>
			<Form.Select floating placeholder="State" name="state" options={options} value={filter} onChange={handleOnChange} />
		</Form>
	)
}

const ScopeBar = ({ filter, setFilter }) => {
	const handleOnChange = (e, { value }) => setFilter(value)

	const options = [{ key: '-1', text: 'all', value: '-1' }].concat(data.protocol_types)

	return (
		<Form>
			<Form.Select floating placeholder="Type" name="type" options={options} value={filter} onChange={handleOnChange} />
		</Form>
	)
}

const CampaignGrid = ({ content, accountPair }) => {
	const [pageContent, setPageContent] = useState([])
	const [page, setPage] = useState(0)
	const [pageSize, setPageSize] = useState(12)
	const [totalPages, setTotalPages] = useState(0)

	const [filter, setFilter] = useState('1')
	const [scope, setScope] = useState(0) // 0 any 1 owned 2 contributed

	const iPP = [3, 5, 9, 18, 36, 72]
	const handleShowMoreItems = () => setPageSize(pageSize < iPP.length - 1 ? pageSize + 1 : pageSize)
	const handleShowLessItems = () => setPageSize(pageSize > 0 ? pageSize - 1 : 0)

	const handlePaginationChange = (e, { activePage }) => setPage(activePage - 1)

	useEffect(() => {
		setTotalPages(Math.ceil(content.length / pageSize))
	}, [content, pageSize])

	useEffect(() => {
		if (totalPages === 0) return
		setPageContent(content.slice(page * pageSize, page * pageSize + pageSize))
	}, [content, page, pageSize])

	useEffect(() => {
		if (!content) return

		// filter by campaign state
		const filterByState = filter === '-1' ? content : content.filter((item) => (item.state === filter ? item : null))

		// filter by protocol

		// filter by scope
		const scopedContent =
			scope === '0'
				? filterByState
				: filterByState.filter((item) => {
						// owned / admin / controller
						if (scope === 1) return accountPair.address === owner ? item : null
						if (scope === 2) return accountPair.address === admin ? item : null
				  })

		// reset page
		setPage(0)
	}, [content, filter, scope])

	return (
		<Container>
			<Menu secondary>
				<Button.Group color="teal">
					<FilterBar filter={filter} setFilter={setFilter} />
					<ScopeBar filter={scope} setFilter={setScope} />
				</Button.Group>
				<Menu.Menu position="right">
					<Button.Group>
						<Button icon onClick={handleShowLessItems}>
							<Icon name="block layout" />
						</Button>
						<Button icon onClick={handleShowMoreItems}>
							<Icon name="grid layout" />
						</Button>
					</Button.Group>
				</Menu.Menu>
			</Menu>
			<Grid stackable colums={5}>
				{pageContent &&
					pageContent.map((item, index) => {
						const c = <CampaignCard key={index} item={item} index={index} accountPair={accountPair} />
						if (filter === '-1') return c
						return item.state === filter ? c : null
					})}

				<Grid.Column mobile={16} tablet={16} computer={16}>
					<Pagination activePage={page + 1} totalPages={totalPages} onPageChange={handlePaginationChange} firstItem={null} lastItem={null} />
				</Grid.Column>
			</Grid>
		</Container>
	)
}

export default CampaignGrid
