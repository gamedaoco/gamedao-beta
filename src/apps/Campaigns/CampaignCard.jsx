import RocketIcon from '@mui/icons-material/Launch'
import TimeIcon from '@mui/icons-material/LockClock'
import IdentityIcon from '@mui/icons-material/PermIdentity'
import SendIcon from '@mui/icons-material/Send'
import TagIcon from '@mui/icons-material/Tag'
import WarningIcon from '@mui/icons-material/Warning'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { web3FromSource } from '@polkadot/extension-dapp'
import React, { useEffect, useState } from 'react'
import { useIdentity } from 'src/hooks/useIdentity'
import ListItem from '../../components/ListItem'
import TileItem from '../../components/TileItem'
import { useSubstrate } from '../../substrate-lib'
import { ListTileEnum } from '../components/ListTileSwitch'
// import { encodeAddress } from '@polkadot/util-crypto'
// import { data } from '../lib/data'
import { gateway } from '../lib/ipfs'

const CampaignCard = ({ displayMode, item, index, accountPair }) => {
	// console.log(item)
	const { api } = useSubstrate()
	const { id, /*protocol,*/ name, cap, cid, created, expiry, governance, owner, balance, state } = item
	const identity = useIdentity(owner)

	// console.log(state)

	const [metadata, setMetadata] = useState({})
	const [imageURL, setImageURL] = useState(null)
	const [content, setContent] = useState()

	// const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(true)

	const [formData, updateFormData] = useState({ amount: 0 })

	const handleOnChange = (e) => {
		updateFormData({ ...formData, [e.target.name]: e.target.value })
	}

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
				const [backers] = await Promise.all([api.query.gameDaoCrowdfunding.campaignContributorsCount(id)])
				setContent({
					...(content ?? {}),
					backers: backers.toHuman(),
				})
				setLoading(false)
				// console.log('identity',identity.toHuman().info.display.Raw)
			} catch (err) {
				console.error(err)
			}
		}
		query()
	}, [api, id, owner, content])

	useEffect(() => {
		if (identity) {
			setContent({ ...(content ?? {}), identity: identity.toHuman()?.info?.display?.Raw ?? null })
		}
	}, [identity, content])

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

	const metaInfo = React.useMemo(() => {
		return (
			<Stack direction={'column'} spacing={1}>
				<Stack direction={'row'} spacing={1}>
					<RocketIcon />
					<Typography>{date}</Typography>
				</Stack>
				{state === '1' && (
					<Stack direction={'row'} spacing={2}>
						<TimeIcon />
						<Typography>{Math.floor((parseInt(blocksRemain) * 3) / 60)} min remaining</Typography>
					</Stack>
				)}
				{content?.identity ? (
					<Stack direction={'row'} spacing={2}>
						<IdentityIcon />
						<a href={`/id/${owner}`}>{content.identity}</a>
						<br />
					</Stack>
				) : (
					<Stack direction={'row'} spacing={2}>
						<WarningIcon />
						<a href="/faq#unknown_entity">unknown entity</a>
					</Stack>
				)}
				<Stack direction={'row'} spacing={2}>
					<TagIcon />
					<Typography>{tags.join(', ')}</Typography>
				</Stack>
			</Stack>
		)
	}, [content])

	const metaActions = React.useMemo(() => {
		switch (state) {
			case '1': {
				return (
					<TextField
						InputLabelProps={{ shrink: true }}
						placeholder="amount"
						name="amount"
						value={formData.amount}
						onChange={handleOnChange}
						fullWidth
						type="number"
						label={'Contribute to this campaign'}
						InputProps={{
							endAdornment: (
								<IconButton onClick={() => handleSubmit()}>
									<SendIcon />
								</IconButton>
							),
						}}
					/>
				)
			}

			case '3': {
				return <Typography>Campaign successful</Typography>
			}
			case '4': {
				return <Typography>Campaign failed</Typography>
			}
		}
	}, [content, state, formData])

	if (!content) return null

	return displayMode === ListTileEnum.TILE ? (
		<TileItem
			imageURL={imageURL}
			headline={name}
			metaHeadline={`${content.backers} backer(s)`}
			metaContent={
				<Stack direction={'column'} spacing={2}>
					{metaInfo}
					{metaActions}
				</Stack>
			}
		>
			<Typography>
				{balance} / {cap} contributed
			</Typography>
		</TileItem>
	) : (
		<ListItem
			imageURL={imageURL}
			headline={name}
			metaHeadline={`${content.backers} backer(s)`}
			metaContent={
				<Stack direction={'column'} spacing={2}>
					{metaInfo}
					{metaActions}
				</Stack>
			}
		>
			<Typography>
				{balance} / {cap} contributed
			</Typography>
		</ListItem>
	)
}

export default CampaignCard
