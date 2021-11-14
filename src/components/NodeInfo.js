import { useApiProvider } from '@substra-hooks/core'
import React, { useEffect, useState } from 'react'
import { Card, Icon, Grid } from 'semantic-ui-react'

function Main(props) {
	const apiProvider = useApiProvider()
	const [nodeInfo, setNodeInfo] = useState({})

	useEffect(() => {
		const getInfo = async () => {
			try {
				const [chain, nodeName, nodeVersion] = await Promise.all([
					apiProvider.rpc.system.chain(),
					apiProvider.rpc.system.name(),
					apiProvider.rpc.system.version(),
				])
				setNodeInfo({ chain, nodeName, nodeVersion })
			} catch (e) {
				console.error(e)
			}
		}
		getInfo()
	}, [apiProvider.rpc.system])

	return (
		<Grid.Column>
			<Card>
				<Card.Content>
					<Card.Header>{nodeInfo.nodeName}</Card.Header>
					<Card.Meta>
						<span>{nodeInfo.chain}</span>
					</Card.Meta>
					<Card.Description>
						Built using the{' '}
						<a href="https://github.com/substrate-developer-hub/substrate-front-end-template">
							Substrate Front End Template
						</a>
					</Card.Description>
				</Card.Content>
				<Card.Content extra>
					<Icon name="setting" />v{nodeInfo.nodeVersion}
				</Card.Content>
			</Card>
		</Grid.Column>
	)
}

export default function NodeInfo(props) {
	const apiProvider = useApiProvider()
	return apiProvider.rpc &&
		apiProvider.rpc.system &&
		apiProvider.rpc.system.chain &&
		apiProvider.rpc.system.name &&
		apiProvider.rpc.system.version ? (
		<Main {...props} />
	) : null
}
