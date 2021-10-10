import { Button, Modal } from 'semantic-ui-react'

//
// modal component
//

const TransactionModal = props => {

	const {
		campaign_name,
		campaign_hash
	} = props

	const modalReducer = ( state, action ) => {
		switch ( action.type ) {
			case 'OPEN_MODAL':
				return { open: true, dimmer: action.dimmer }
			case 'CLOSE_MODAL':
				return { open: false }
			default:
				throw new Error()
		}
	}

	const modalDimmer = () => {
		const [state, dispatch] = React.useReducer(
			exampleReducer,
			{
				open: false,
				dimmer: undefined,
			}
		)
	}

	const [ visible, setVisible] = useState(false)

	return (
		<Modal
			open={visible}
			onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
			>
			<Modal.Header>
				Support {campaign_name}
			</Modal.Header>
			<Modal.Content>
				Let Google help apps determine location. This means sending anonymous
				location data to Google, even when no apps are running.
			</Modal.Content>
			<Modal.Actions>
				<Button negative onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>
					Disagree
				</Button>
				<Button positive onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>
					Agree
				</Button>
			</Modal.Actions>
		</Modal>
	)
}
