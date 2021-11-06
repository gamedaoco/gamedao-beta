import React, { useEffect, useState } from 'react'
import { useSubstrate } from '../../substrate-lib'

import { web3FromSource } from '@polkadot/extension-dapp'
// import { encodeAddress } from '@polkadot/util-crypto'
// import { data } from '../lib/data'
import { gateway } from '../lib/ipfs'
// import config from '../../config'
// const dev = config.dev

import { Grid, Card, Icon, Image, Segment } from 'semantic-ui-react'
import { Form } from 'semantic-ui-react'

import { Button } from '../../components'

const CampaignCard = ({ item, index, accountPair }) => {
	// console.log(item)
	const { api } = useSubstrate()

	const { id, /*protocol,*/ name, cap, cid, created, expiry, governance, owner, balance, state } = item

	// console.log(state)

	const [metadata, setMetadata] = useState({})
	const [imageURL, setImageURL] = useState(null)
	const [content, setContent] = useState()

	// const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(true)

	const [formData, updateFormData] = useState({ amount: 0 })

	const handleOnChange = (e, { name, value }) => updateFormData({ ...formData, [name]: value })

	useEffect(() => {
		if (!cid || cid.length < 4) return
		// console.log('cid',cid)
		fetch(gateway + cid)
			.then((res) => res.text())
			.then((txt) => setMetadata(JSON.parse(txt)))
			.catch((err) => console.log(err))
	}, [cid])

	useEffect(() => {
		if (!metadata) return
		// console.log('metadata',metadata)
		setImageURL(metadata.logo ? gateway + metadata.logo : 'https://gateway.pinata.cloud/ipfs/QmUxC9MpMjieyrGXZ4zC4yJZmH7s8H2bxMk7oQAMzfNLhY')
	}, [metadata])

	useEffect(() => {
		if (!id) return

		const query = async () => {
			try {
				const [backers, identity] = await Promise.all([
					api.query.gameDaoCrowdfunding.campaignContributorsCount(id),
					api.query.identity.identityOf(owner),
				])
				setContent({
					backers: backers.toHuman(),
					identity: identity.toHuman().info.display.Raw || null,
				})
				setLoading(false)
				// console.log('identity',identity.toHuman().info.display.Raw)
			} catch (err) {
				console.error(err)
			}
		}
		query()
	}, [api, id, owner])

	//

	// if (!item) return null

	// on chain

	// off chain
	// const image_url = 'https://gateway.pinata.cloud/ipfs/QmUxC9MpMjieyrGXZ4zC4yJZmH7s8H2bxMk7oQAMzfNLhY'
	// const json_url = 'https://gateway.pinata.cloud/ipfs/'+ cid
	// console.log(json_url)

	const blocksRemain = expiry

	// const remaining = blocksToTime(data.expiry) - new Date().now()
	// console.log('update',Date.now())

	const tags = ['game', '2d', 'pixel', 'steam']
	// const views = 1//Math.floor(Math.random()*10000)

	// icon type based on supporters
	// const icon = backers => {
	// 	if (backers > 10000) return 'fire'
	// 	if (backers > 1000) return 'heart'
	// 	if (backers > 100) return 'peace'
	// 	return 'plus circle'
	// }

	const epoch = created.replaceAll(',', '')
	const options = { year: 'numeric', month: 'long', day: 'numeric' }
	const date = new Date(epoch * 1).toLocaleDateString(undefined, options)

	// const handleContribute = () => setOpen(true)

	const getFromAcct = async () => {
		const {
			address,
			meta: { source, isInjected },
		} = accountPair
		let fromAcct
		if (isInjected) {
			const injected = await web3FromSource(source)
			fromAcct = address
			api.setSigner(injected.signer)
		} else {
			fromAcct = accountPair
		}
		return fromAcct
	}

	const sendTx = async (amount) => {
		if (!amount) return
		setLoading(true)

		const payload = [id, amount]
		console.log('payload', payload)
		const from = await getFromAcct()
		const tx = api.tx.gameDaoCrowdfunding.contribute(...payload)

		const hash = await tx.signAndSend(from, ({ status, events }) => {
			console.log(status, events)
			if (events.length) {
				events.forEach((record) => {
					const { event } = record
					if (event.section === 'gameDaoCrowdfunding' && event.method === 'CampaignContributed') {
						console.log('campaign contributed:', hash)
						setLoading(false)
					}
				})
			}
		})
	}

	// sendTx(id,1000000000000)

	const handleSubmit = () => {
		console.log('submit', formData.amount * 1000000000000)
		if (!formData.amount > 0) return
		setLoading(true)
		sendTx(formData.amount * 1000000000000)
	}

	// const Buy = ({
	// 	open,
	// 	imageURL,
	// 	handleOnChange,
	// 	handlesubmit,
	// 	formData
	// }) => {

	// 	return (
	// 		<Modal
	// 			onClose={() => setOpen(false)}
	// 			onOpen={() => setOpen(true)}
	// 			open={open}
	// 			trigger={<Button color='green' fluid>Support Campaign</Button>}
	// 		>
	// 			<Modal.Header>Contribute to Campaign</Modal.Header>
	// 			<Modal.Content image>
	// 				<Image size='medium' src={imageURL} wrapped />
	// 				<Modal.Description>
	// 					<Header>Contribute to Campaign</Header>
	// 					<p>{metadata.description}</p>
	// 					<p>Disclaimer</p>
	// 					<Form.Group widths='equal'>
	// 						<Form.Input
	// 							type='amount'
	// 							label='amount'
	// 							name='amount'
	// 							value={formData.amount}
	// 							onChange={handleOnChange}
	// 							/>
	// 					</Form.Group>
	// 				</Modal.Description>
	// 			</Modal.Content>
	// 			<Modal.Actions>
	// 				<Button color='black' onClick={() => setOpen(false)}>
	// 					Cancel
	// 				</Button>
	// 				<Button
	// 					content="Contribute Now"
	// 					labelPosition='right'
	// 					icon='checkmark'
	// 					onClick={handleSubmit}
	// 					positive
	// 				/>
	// 			</Modal.Actions>
	// 		</Modal>
	// 	)
	// }

	if (!content) return null

	return (
		<Grid.Column mobile={16} tablet={8} computer={4}>
			<Segment vertical loading={loading}>
				<Card href="" color={governance === '1' ? 'pink' : 'teal'}>
					<Image label={governance === '1' && { as: 'a', corner: 'right', icon: 'heart', color: 'pink' }} src={imageURL} wrapped ui={true} />
					<Card.Content>
						<Card.Header color="black">
							<a href={`/campaign/${id}`}>{name}</a>
						</Card.Header>
						<Card.Meta>
							{content.backers} backer{content.backers === 1 ? '' : 's'}.<br />
							{balance}/{cap} contributed.
						</Card.Meta>
						{/*					<Card.Description>
					</Card.Description>*/}
					</Card.Content>
					<Card.Content extra>
						{state === '1' && (
							<>
								Contribute to this campaign
								<Form.Input
									action={{
										color: 'green',
										icon: 'check',
										onClick: handleSubmit,
									}}
									placeholder="amount"
									size="mini"
									name="amount"
									value={formData.amount}
									onChange={handleOnChange}
									fluid
									type="number"
								/>
							</>
						)}

						{state === '3' && (
							<>
								Campaign Successful
								<Button color="green" size="small">
									Project Page
								</Button>
							</>
						)}

						{state === '4' && (
							<>
								Campaign Failed
								<Button color="orange" size="tiny">
									Project Page
								</Button>
							</>
						)}

						{/*
						<Form.Group widths='equal'>
							<Form.Input
								type='amount'
								label='amount'
								name='amount'
								value={formData.amount}
								onChange={handleOnChange}
								size='small'
								/>
							<Button
								content="Contribute Now"
								labelPosition='right'
								icon='checkmark'
								onClick={handleSubmit}
								positive
								size = 'small'
							/>
						</Form.Group>
				{ accountPair &&
					<Buy
						open={open}
						imageURL={imageURL}
						handleOnChange={handleOnChange}
						handleSubmit={handleSubmit}
						formData={formData}
					/>
				}
*/}
					</Card.Content>
					<Card.Content extra>
						{/*
					<Icon name='eye' />{views} views.<br/>
					<br/>
*/}
						<Icon name="rocket" />
						{date}
						<br />
						{state === '1' && (
							<>
								<Icon name="time" />
								{Math.floor((parseInt(blocksRemain) * 3) / 60)} min remaining
								<br />
							</>
						)}
						{content.identity ? (
							<>
								<a href={`/id/${owner}`}>
									<Icon color="green" name="certificate" />
									{content.identity}
								</a>
								<br />
							</>
						) : (
							<>
								<a href="/faq#unknown_entity">
									<Icon color="orange" name="warning" />
									unknown entity
								</a>
								<br />
							</>
						)}
						<Icon name="tag" />
						{tags.join(', ')} <br />
					</Card.Content>
				</Card>
			</Segment>
		</Grid.Column>
	)
}

export default CampaignCard
