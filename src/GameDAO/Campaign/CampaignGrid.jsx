import React, {
	useState, useEffect
} from 'react'
import { Container, Grid, Form, Radio, Pagination } from 'semantic-ui-react'
import CampaignCard from './CampaignCard'
import { data, rnd } from '../lib/data'

const FilterBar = ({filter,setFilter}) => {

	const handleOnChange = (e, { value }) => setFilter(value)

	const options = [{ key: '-1', text: 'all', value: '-1' }].concat(data.campaign_states)

	return (
		<Form>
			<Form.Select
				label='Filter'
				placeholder='Filter'
				name='filter'
				options={options}
				value={filter}
				onChange={handleOnChange}
				/>
		</Form>
	)
}

const CampaignGrid = ({ content, accountPair }) => {

	const [ pageContent, setPageContent ] = useState([])
	const [ page, setPage ] = useState(0)
	const [ pageSize, setPageSize ] = useState(2)
	const [ totalPages, setTotalPages ] = useState(0)
	const [ filter, setFilter ] = useState('-1')

	const handlePaginationChange = (e, { activePage }) => setPage( activePage - 1)

	useEffect(()=>{
		setTotalPages( Math.ceil( content.length / pageSize ) )
	},[content, pageSize])

	useEffect(()=>{
		if ( totalPages === 0 ) return
		setPageContent( content.slice( page * pageSize, page * pageSize + pageSize) )
	}, [content, page, pageSize])

	useEffect(()=>{
		setPage(0)
	},[filter])

	return (
		<Container>
			<FilterBar filter={filter} setFilter={setFilter}/>
			<Grid stackable colums={5} >

				{
					pageContent && pageContent.map( ( item, index ) => {
						const c = <CampaignCard key={index} item={item} index={index} accountPair={accountPair} />
						if ( filter === '-1' ) return c
						return ( item.state === filter ) ? c : null
					})
				}

				<Grid.Column mobile={16} tablet={16} computer={16}>
					<Pagination
						activePage={ page + 1 }
						totalPages={totalPages}
			            onPageChange={handlePaginationChange}
						firstItem={null}
						lastItem={null}
						/>
				</Grid.Column>

			</Grid>
		</Container>
	)

}

export default CampaignGrid