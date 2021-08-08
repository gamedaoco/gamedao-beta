import React, {
	// useState
} from 'react'
import { Container, Grid } from 'semantic-ui-react'
import CampaignCard from './CampaignCard'

const CampaignGrid = ({ content, accountPair}) => {

	// const [ pageContent, setPageContent ] = useState([])

	// const [ page, setPage ] = useState()
	// const [ pageSize, setPageSize ] = useState()
	// const [ totalPages, setTotalPages ] = useState()

	// useEffect(()=>{

	// 	if ( !content ) return

	// 	const filteredContent = content.slice( page * pageSize, pageSize)
	// 	setPageContent( filteredContent )

	// }, [content])


	return (
		<Container>
			<Grid stackable colums={5} >
				{
					content && content.map( ( item, index ) => {
						return <CampaignCard key={index} item={item} index={index} accountPair={accountPair} />
					})
				}

{/*				<Grid.Column mobile={16} tablet={16} computer={16}>
					<Pagination
						defaultActivePage={page}
						firstItem={null}
						lastItem={null}
						siblingRange={1}
						totalPages={(content)}
						/>
				</Grid.Column>
*/}
			</Grid>
		</Container>
	)

}

export default CampaignGrid