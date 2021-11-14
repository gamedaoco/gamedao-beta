import { useApiProvider } from '@substra-hooks/core'
import React, { useEffect, useState } from 'react'
import { Grid, Modal, Button, Card } from 'semantic-ui-react'

function Main(props) {
	const apiProvider = useApiProvider()
	const [metadata, setMetadata] = useState({ data: null, version: null })

	useEffect(() => {
		const getMetadata = async () => {
			try {
				const data = await apiProvider.rpc.state.getMetadata()
				setMetadata({ data, version: data.version })
			} catch (e) {
				console.error(e)
			}
		}
		getMetadata()
	}, [apiProvider.rpc.state])

	return (
		<Grid.Column>
			<Card>
				<Card.Content>
					<Card.Header>Metadata</Card.Header>
					<Card.Meta>
						<span>v{metadata.version}</span>
					</Card.Meta>
				</Card.Content>
				<Card.Content extra>
					<Modal trigger={<Button>Show Metadata</Button>}>
						<Modal.Header>Runtime Metadata</Modal.Header>
						<Modal.Content scrolling>
							<Modal.Description>
								<pre>
									<code>{JSON.stringify(metadata.data, null, 2)}</code>
								</pre>
							</Modal.Description>
						</Modal.Content>
					</Modal>
				</Card.Content>
			</Card>
		</Grid.Column>
	)
}

export default function Metadata(props) {
	const apiProvider = useApiProvider()
	return apiProvider.rpc && apiProvider.rpc.state && apiProvider.rpc.state.getMetadata ? (
		<Main {...props} />
	) : null
}
