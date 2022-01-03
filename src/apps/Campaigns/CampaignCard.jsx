import RocketIcon from '@mui/icons-material/PlayArrowOutlined'
import TimeIcon from '@mui/icons-material/TimerOutlined'
import IdentityIcon from '@mui/icons-material/CircleOutlined'
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
import { NavLink } from 'react-router-dom'

import { useWallet } from 'src/context/Wallet'
import { useCrowdfunding } from 'src/hooks/useCrowdfunding'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { useBlock } from 'src/hooks/useBlock'
import { useIdentity } from 'src/hooks/useIdentity'
import { ListItem } from '../../components/ListItem'
import { TileItem } from '../../components/TileItem'
import { ListTileEnum } from '../components/ListTileSwitch'
import { Link } from '../../components'
import { gateway } from '../lib/ipfs'
import { BigNumber } from 'bignumber.js'
import { useBalance } from 'src/hooks/useBalance'

const CampaignCard = ({ displayMode, item, index }) => {
	const {
		id,
		/*protocol,*/ org,
		name,
		cap,
		cid,
		created,
		expiry,
		governance,
		owner,
		balance,
		state,
	} = item
	const apiProvider = useApiProvider()
	const blockheight = useBlock()
	const { identities } = useIdentity(owner)
	const { campaignContributorsCount } = useCrowdfunding()
	const { account, signAndNotify } = useWallet()
	const [metadata, setMetadata] = useState(null)
	const [imageURL, setImageURL] = useState(null)
	const [content, setContent] = useState()
	const [loading, setLoading] = useState(true)
	const [formData, updateFormData] = useState({ amount: 0 })
	const { updateBalance } = useBalance()
	const { bodies } = useGameDaoControl()

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
	}, [id, campaignContributorsCount, identities, blockheight])

	useEffect(() => {
		setContent({
			...content,
			identity: identities?.[owner]?.toHuman()?.info?.display?.Raw || null,
		})
	}, [identities])

	const blocksRemain = parseInt(expiry.replaceAll(',', '')) - blockheight

	const tags = ['game', '2d', 'pixel', 'steam']

	const epoch = created.replaceAll(',', '')
	const options = { year: 'numeric', month: 'long', day: 'numeric' }
	const date = new Date(epoch * 1).toLocaleDateString(undefined, options)

	const sendTx = async (amount) => {
		if (!amount) return
		setLoading(true)
		const payload = [id, amount]
		signAndNotify(
			apiProvider.tx.gameDaoCrowdfunding.contribute(...payload),
			{
				pending: 'Contribute to campaign',
				success: 'Contribution successful',
				error: 'Contribution failed',
			},
			(state) => {
				setLoading(false)
				updateBalance()

				if (!state) {
					// TODO: 2075 Do we need error handling here?
				}
			}
		)
	}

	const handleSubmit = () => {
		if (!formData.amount > 0) return
		let amount = new BigNumber(formData.amount)
		amount = amount.multipliedBy(new BigNumber(10).pow(18))
		console.log('submit', amount.toString())
		setLoading(true)
		sendTx(amount.toString())
	}

	const metaInfo = React.useMemo(() => {
		return (
			<Stack direction={'column'}>
				<Stack direction={'row'} spacing={1} alignItems="middle">
					<RocketIcon sx={{ height: '1rem'}} />
					<Typography sx={{ fontSize: '0.75rem'}}>{date}</Typography>
				</Stack>
				{state === '1' && (
					<Stack direction={'row'} spacing={1}>
						<TimeIcon sx={{ height: '1rem'}}/>
						<Typography sx={{ fontSize: '0.75rem'}}>
							{Math.floor((parseInt(blocksRemain) * 3) / 60)} min remaining
						</Typography>
					</Stack>
				)}
				{bodies && bodies[org] && bodies[org].name ? (
					<Stack direction={'row'} spacing={1}>
						<IdentityIcon sx={{ height: '1rem'}}/>
						<Link sx={{ fontSize: '0.75rem'}} component={NavLink} to={`/app/organisations/${org}`}>
							{bodies[org].name}
						</Link>
						<br />
					</Stack>
				) : (
					<Stack direction={'row'} spacing={2}>
						<WarningIcon />
						<Link component={NavLink} to="/faq#unknown_entity">
							unknown dao
						</Link>
					</Stack>
				)}
				{/*<Stack direction={'row'} spacing={2}>
					<TagIcon />
					<Typography>{tags.join(', ')}</Typography>
				</Stack>*/}
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

	//console.log(content)

	return displayMode === ListTileEnum.TILE ? (
		<TileItem
			linkTo={`/app/campaigns/${id}`}
			imageURL={
				imageURL ??
				'https://ipfs.gamedao.co/gateway/QmUxC9MpMjieyrGXZ4zC4yJZmH7s8H2bxMk7oQAMzfNLhY'
			}
			headline={name}
			metaHeadline={`${content.backers ? content.backers : ''} backer(s)`}
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
			linkTo={`/app/campaigns/${id}`}
			imageURL={
				imageURL ??
				'https://ipfs.gamedao.co/gateway/QmUxC9MpMjieyrGXZ4zC4yJZmH7s8H2bxMk7oQAMzfNLhY'
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
