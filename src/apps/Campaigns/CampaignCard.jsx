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
import { useApiProvider } from '@substra-hooks/core'
import React, { useEffect, useState } from 'react'
import { useWallet } from 'src/context/Wallet'
import { useCrowdfunding } from 'src/hooks/useCrowdfunding'
import { useIdentity } from 'src/hooks/useIdentity'
import { ListItem } from '../../components/ListItem'
import { TileItem } from '../../components/TileItem'
import { ListTileEnum } from '../components/ListTileSwitch'
import { gateway } from '../lib/ipfs'

const CampaignCard = ({ displayMode, item, index }) => {
	const { id, /*protocol,*/ name, cap, cid, created, expiry, governance, owner, balance, state } =
		item
	const apiProvider = useApiProvider()
	const identity = useIdentity(owner)
	const { campaignContributorsCount } = useCrowdfunding()
	const { account } = useWallet()

	// console.log(state)

	const [metadata, setMetadata] = useState(null)
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
		if (!metadata?.logo || imageURL) return
		// console.log('metadata',metadata)

		setImageURL(gateway + metadata.logo)
	}, [metadata])

	useEffect(() => {
		if (id && campaignContributorsCount) {
			setContent({
				...content,
				backers: campaignContributorsCount[id] || null,
			})
		}
	}, [id, campaignContributorsCount])

	useEffect(() => {
		setContent({
			...content,
			identity: identity?.toHuman()?.info?.display?.Raw || null,
		})
	}, [identity])

	//

	// if (!item) return null

	// on chain

	// off chain
	// const image_url = 'https://ipfs.gamedao.co/ipfs/QmUxC9MpMjieyrGXZ4zC4yJZmH7s8H2bxMk7oQAMzfNLhY'
	// const json_url = 'https://ipfs.gamedao.co/ipfs/'+ cid
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
		} = account
		let fromAcct
		if (isInjected) {
			const injected = await web3FromSource(source)
			fromAcct = address
			apiProvider.setSigner(injected.signer)
		} else {
			fromAcct = account
		}
		return fromAcct
	}

	const sendTx = async (amount) => {
		if (!amount) return
		setLoading(true)

		const payload = [id, amount]
		console.log('payload', payload)
		const from = await getFromAcct()
		const tx = apiProvider.tx.gameDaoCrowdfunding.contribute(...payload)

		const hash = await tx.signAndSend(from, ({ status, events }) => {
			console.log(status, events)
			if (events.length) {
				events.forEach((record) => {
					const { event } = record
					if (
						event.section === 'gameDaoCrowdfunding' &&
						event.method === 'CampaignContributed'
					) {
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
						<Typography>
							{Math.floor((parseInt(blocksRemain) * 3) / 60)} min remaining
						</Typography>
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
			imageURL={
				imageURL ??
				'https://ipfs.gamedao.co/ipfs/QmUxC9MpMjieyrGXZ4zC4yJZmH7s8H2bxMk7oQAMzfNLhY'
			}
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
			imageURL={
				imageURL ??
				'https://ipfs.gamedao.co/ipfs/QmUxC9MpMjieyrGXZ4zC4yJZmH7s8H2bxMk7oQAMzfNLhY'
			}
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
