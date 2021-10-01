import React, {
	useState, useEffect
} from 'react'
import { Container, Grid, Form, Radio, Pagination, Button, Icon, Menu } from 'semantic-ui-react'
import CampaignCard from './CampaignCard'
import { data, rnd } from '../lib/data'

const FilterBar = ({filter,setFilter}) => {

	const handleOnChange = (e, { value }) => setFilter(value)

	const options = [{ key: '-1', text: 'all', value: '-1' }].concat(data.campaign_states)

	return (
		<Form>
			<Form.Select
				floating
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
	const [ pageSize, setPageSize ] = useState(12)
	const [ totalPages, setTotalPages ] = useState(0)
	const [ filter, setFilter ] = useState('1')

	const iPP = [3,5,9,18,36,72]
	const handleShowMoreItems = () => setPageSize( ( pageSize < ( iPP.length - 1 ) ) ? pageSize + 1 : pageSize )
	const handleShowLessItems = () => setPageSize( ( pageSize > 0 ) ? pageSize - 1 : 0 )


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
			<Menu secondary>
				<Button.Group color='teal'>
					<FilterBar filter={filter} setFilter={setFilter}/>
				</Button.Group>
			<Menu.Menu position='right'>
				<Button.Group>
					<Button icon onClick={handleShowLessItems}><Icon name='block layout' /></Button>
					<Button icon onClick={handleShowMoreItems}><Icon name='grid layout' /></Button>
				</Button.Group>
			</Menu.Menu>
			</Menu>
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