import React, { useEffect, useState, lazy } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSubstrate } from '../../substrate-lib'
import { useWallet } from 'src/context/Wallet'
import { web3FromSource } from '@polkadot/extension-dapp'
import { encodeAddress } from '@polkadot/util-crypto'

import { ListItem } from '../../components/ListItem'
import ListTileSwitch, { ListTileEnum } from '../components/ListTileSwitch'

import { data as d } from '../lib/data'
import { gateway } from '../lib/ipfs'
import config from '../../config'

import {
	Button,
	Typography,
	Box,
	Stack,
	Container,
	Paper,
	Table as TableMUI,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	styled,
} from '../../components'

//
//
//

const defaultContent = {}

const Item = ({ content, mode }) => {
	const { api } = useSubstrate()
	const { address } = useWallet()
	const navigate = useNavigate()

	const [itemContent, setItemContent] = useState({})
	const [metadata, setMetadata] = useState({})
	const [imageURL, setImageURL] = useState(null)

	const updateContent = (newContent) => setItemContent({ ...itemContent, ...newContent })

	useEffect(() => {
		if (!content) return
		updateContent(content)
	}, [content])

	// get offchain data
	useEffect(() => {
		if(!itemContent) return
		if (!itemContent.cid || itemContent.cid.length < 3) return
		fetch(gateway + itemContent.cid)
			.then((res) => res.text())
			.then((txt) => setMetadata(JSON.parse(txt)))
			.catch((err) => console.log(err))
	}, [itemContent])

	// get project image

	useEffect(() => {
		if (!metadata) return
		setImageURL(metadata.logo ? gateway + metadata.logo : null)
	}, [metadata])

	// get onchain data

	useEffect(() => {
		if (!content) return
		const query = async () => {
			try {
				const [
					// config,
					controller,
					access,
					memberState,
					memberCount,
					treasury,
				] = await Promise.all([
					// api.query.gameDaoControl.bodyConfig(content.id),
					api.query.gameDaoControl.bodyController(content.id),
					api.query.gameDaoControl.bodyAccess(content.id),
					api.query.gameDaoControl.bodyMemberState([content.id, address]),
					api.query.gameDaoControl.bodyMemberCount(content.id),
					api.query.gameDaoControl.bodyTreasury(content.id),
				])
				updateContent({
					// ...config.toHuman(),
					controller: controller.toHuman(),
					access: access.toHuman(),
					memberState: memberState.toHuman(),
					memberCount: memberCount.toHuman(),
					treasury: treasury.toHuman(),
				})
			} catch (err) {
				console.error(err)
			}
		}
		query()
	}, [api, content])

	// useEffect(() => {

	// 	if (!content.treasury) return

	// 	const query = async () => {
	// 		const unsub = await api.queryMulti([
	// 			[api.query.system.account, content.treasury],
	// 		], ([{ data: balance }]) => {
	// 			console.log(`----> treasury of ${balance.free}`);
	// 			setItemContent({
	// 				...itemContent,
	// 				treasuryBalance: balance.free
	// 			})
	// 		});
	// 	}
	// 	query()

	// }, [content, api.query.system.account])

	//
	//
	//

	const handleMembership = async (e) => {
		const op = e.target.value

		switch (op) {
			case '0':
				console.log('join')
				await addMember(api, accountPair, itemContent.id, e.target)
				// join
				return
			case '1':
				console.log('apply')
				// apply for membership
				return
			case '2':
				console.log('leave')
				// remove member
				return
			default:
				return
		}
	}

	const handleAdmin = () => navigate('/app/organisations/admin/1234')
	const handleDashboard = () => navigate('/app/organisations/dashboard/1234');

	const buttonText = ['join', 'apply', 'leave']

	const isAdmin = () => (address === itemContent.controller ? true : false)
	const isMember = () => (itemContent.memberState > 0 ? true : false)

	const Interactions = () => {
		const text = buttonText[itemContent.access]
		return (
			<>
				{(isMember() || isAdmin()) && (
					<Button variant={'outlined'} fullWidth onClick={handleDashboard} value={itemContent.access}>{`Dashboard`}</Button>
				)}
				{isMember() && !isAdmin() && <Button variant={'outlined'} fullWidth onClick={handleMembership} value={itemContent.access}>{`leave`}</Button>}
				{!isMember() && text && <Button variant={'outlined'} fullWidth onClick={handleMembership} value={itemContent.access}>{`${text}`}</Button>}
				{isAdmin() && (
					<Button variant={'outlined'} fullWidth onClick={handleAdmin}>
						Admin
					</Button>
				)}
			</>
		)
	}

	const bodyToText = () => d.dao_bodies.filter((b) => b.value === Number(content.body))[0].text

	const metaContent = React.useMemo(() => {
		return (
			<Stack sx={{ width: '100%', height: '100%' }} direction={'column'} justifyContent={mode === ListTileEnum.TILE ? 'flex-end' : 'inherit'} spacing={1}>
				<Stack direction={'row'} spacing={1}>
					<WebsiteIcon /> <a href={metadata.website}>{metadata.website}</a>
				</Stack>
				{itemContent.access === '0' ? (
					<Stack direction={'row'} spacing={1}>
						<LockIcon /> <Typography>Locked</Typography>
					</Stack>
				) : (
					<Stack direction={'row'} spacing={1}>
						<OpenLockIcon /> <Typography>Open</Typography>
					</Stack>
				)}
				<Stack direction={'row'} spacing={1}>
					<MemberIcon />
					<Typography>{itemContent.memberCount || 0} Members</Typography>
				</Stack>
				{mode === ListTileEnum.LIST && <Box sx={{ flex: 1 }} />}
				<Interactions />
			</Stack>
		)
	}, [itemContent, metadata, mode])

	if (!itemContent) return null

	return mode === ListTileEnum.LIST ? (
		<ListItem imageURL={imageURL} headline={itemContent.name} metaHeadline={bodyToText()} metaContent={metaContent}>
			<Typography>{metadata.description}</Typography>
		</ListItem>
	) : (
		<TileItem imageURL={imageURL} headline={itemContent.name} metaHeadline={bodyToText()} metaContent={metaContent}>
			<Typography>{metadata.description}</Typography>
		</TileItem>
	)
}
