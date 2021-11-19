// control - a dao interface
// invoke and manage organisations on chain

import React, { useEffect, useState, lazy } from 'react'
import { useWallet } from 'src/context/Wallet'
import { web3FromSource } from '@polkadot/extension-dapp'
import { encodeAddress } from '@polkadot/util-crypto'
import { NavLink } from 'react-router-dom'

import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import LanguageIcon from '@mui/icons-material/Language'
import LockIcon from '@mui/icons-material/Lock'
import OpenLockIcon from '@mui/icons-material/LockOpen'
import WebsiteIcon from '@mui/icons-material/Web'
import MemberIcon from '@mui/icons-material/AccountBox'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import GroupIcon from '@mui/icons-material/Group'
import { ListItem } from '../../components/ListItem'
import { TileItem } from '../../components/TileItem'
import { ListTileSwitch, ListTileEnum } from '../components/ListTileSwitch'

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
	Link,
} from '../../components'
import { useApiProvider } from '@substra-hooks/core'

const CreateDAO = lazy(() => import('./Create'))

const TileWrapper = styled(Box)(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: '1fr',
	rowGap: theme.spacing(2),
	columnGap: theme.spacing(2),
	[theme.breakpoints.up('md')]: {
		gridTemplateColumns: '1fr 1fr 1fr',
	},
	[theme.breakpoints.up('lg')]: {
		gridTemplateColumns: '1fr 1fr 1fr 1fr',
	},
}))

const ListWrapper = styled(Box)(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: '1fr',
	rowGap: theme.spacing(2),
	columnGap: theme.spacing(2),
}))

const dev = config.dev

const getFromAcct = async (api, account) => {
	const {
		address,
		meta: { source, isInjected },
	} = account
	let fromAcct
	if (isInjected) {
		const injected = await web3FromSource(source)
		fromAcct = address
		api.setSigner(injected.signer)
	} else {
		fromAcct = account
	}
	return fromAcct
}

const addMember = async (api, account, id, target) => {
	console.log(account.address, id)

	target.disabled = true

	const payload = [id, account.address]

	const from = await getFromAcct(api, account)
	const tx = api.tx.gameDaoControl.addMember(...payload)
	const hash = await tx.signAndSend(from, ({ status, events }) => {
		console.log('Transaction status:', status.type)
		if (events.length) {
			events.forEach((record) => {
				const { event, phase } = record
				const types = event.typeDef

				// Show what we are busy with
				console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`)
				console.log(`\t\t${event.meta.documentation.toString()}`)

				// Loop through each of the parameters, displaying the type and data
				event.data.forEach((data, index) => {
					console.log(`\t\t\t${types[index].type}: ${data.toString()}`)
				})
			})
			if (status.isFinalized) {
				console.log('Finalized block hash', status.asFinalized.toHex())
			}
		}
	})
	target.disabled = false
}

//
//
//

const defaultContent = {}

const Item = ({ content, mode }) => {
	const apiProvider = useApiProvider()
	const { address, account } = useWallet()

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
					// apiProvider.query.gameDaoControl.bodyConfig(content.id),
					apiProvider.query.gameDaoControl.bodyController(content.id),
					apiProvider.query.gameDaoControl.bodyAccess(content.id),
					apiProvider.query.gameDaoControl.bodyMemberState([content.id, address]),
					apiProvider.query.gameDaoControl.bodyMemberCount(content.id),
					apiProvider.query.gameDaoControl.bodyTreasury(content.id),
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
	}, [apiProvider, content])

	// useEffect(() => {

	// 	if (!content.treasury) return

	// 	const query = async () => {
	// 		const unsub = await apiProvider.queryMulti([
	// 			[apiProvider.query.system.account, content.treasury],
	// 		], ([{ data: balance }]) => {
	// 			console.log(`----> treasury of ${balance.free}`);
	// 			setItemContent({
	// 				...itemContent,
	// 				treasuryBalance: balance.free
	// 			})
	// 		});
	// 	}
	// 	query()

	// }, [content, apiProvider.query.system.account])

	//
	//
	//

	const handleMembership = async (e) => {
		const op = e.target.value

		switch (op) {
			case '0':
				console.log('join')
				await addMember(apiProvider, account, itemContent.id, e.target)
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

	const handleAdmin = () => console.log('open admin')
	const handleDashboard = () => console.log('open dashboard')

	const buttonText = ['join', 'apply', 'leave']

	const isAdmin = () => (address === itemContent.controller ? true : false)
	const isMember = () => (itemContent.memberState > 0 ? true : false)

	const Interactions = () => {
		const text = buttonText[itemContent.access]
		return (
			<>
				{(isMember() || isAdmin()) && (
					<Button
						variant={'outlined'}
						fullWidth
						onClick={handleDashboard}
						value={itemContent.access}
					>{`Dashboard`}</Button>
				)}
				{isMember() && !isAdmin() && (
					<Button
						variant={'outlined'}
						fullWidth
						onClick={handleMembership}
						value={itemContent.access}
					>{`leave`}</Button>
				)}
				{!isMember() && text && (
					<Button
						variant={'outlined'}
						fullWidth
						onClick={handleMembership}
						value={itemContent.access}
					>{`${text}`}</Button>
				)}
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
			<Stack
				sx={{ width: '100%', height: '100%' }}
				direction={'column'}
				justifyContent={mode === ListTileEnum.TILE ? 'flex-end' : 'inherit'}
				spacing={1}
			>
				<Stack direction={'row'} spacing={1}>
					<WebsiteIcon />{' '}
					<Link
						component={NavLink}
						rel={'noreferrer'}
						target={'_blank'}
						to={metadata.website || ''}
					>
						{metadata.website}
					</Link>
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
		<ListItem
			linkTo={`/app/organisations/${itemContent.id}`}
			imageURL={imageURL}
			headline={itemContent.name}
			metaHeadline={bodyToText()}
			metaContent={metaContent}
		>
			<Typography>{metadata.description}</Typography>
		</ListItem>
	) : (
		<TileItem
			linkTo={`/app/organisations/${itemContent.id}`}
			imageURL={imageURL}
			headline={itemContent.name}
			metaHeadline={bodyToText()}
			metaContent={metaContent}
		>
			<Typography>{metadata.description}</Typography>
		</TileItem>
	)
}

const ItemList = (props) => {
	const { content } = props

	///
	const [page, setPage] = React.useState(0)
	const [rowsPerPage, setRowsPerPage] = React.useState(10)

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value)
		setPage(0)
	}
	///

	const [activePage, setActivePage] = useState(1)
	const [totalPages, setTotalPages] = useState(0)
	const [offset, setOffset] = useState(0)
	const [itemsPerPage, setItemsPerPage] = useState(3)
	const [displayMode, setDisplayMode] = useState(ListTileEnum.LIST)

	const iPP = [3, 5, 9, 18, 36, 72]
	const handleShowMoreItems = () =>
		setItemsPerPage(itemsPerPage < iPP.length - 1 ? itemsPerPage + 1 : itemsPerPage)
	const handleShowLessItems = () => setItemsPerPage(itemsPerPage > 0 ? itemsPerPage - 1 : 0)

	useEffect(() => {
		const _totalPages = Math.ceil(content.length / iPP[itemsPerPage])
		setTotalPages(_totalPages)
		if (activePage > _totalPages) setActivePage(_totalPages)
	}, [content, itemsPerPage, activePage])

	const handlePaginationChange = (e, { activePage }) => {
		setActivePage(activePage)
		setOffset((activePage - 1) * iPP[itemsPerPage])
	}

	const Wrapper = React.useMemo(
		() => (displayMode === ListTileEnum.LIST ? ListWrapper : TileWrapper),
		[displayMode]
	)

	if (!content) return null

	// console.log(activePage,totalPages,offset,itemsPerPage)

	return (
		<Box>
			<ListTileSwitch mode={displayMode} onSwitch={setDisplayMode} />
			<Wrapper>
				{content.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((d, i) => {
					const _content = {
						...d,
					}
					return <Item mode={displayMode} key={offset + i} content={_content} />
				})}
			</Wrapper>
			<Box sx={{ my: 2 }} />
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component="div"
				count={content.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Box>
	)
}

export const Main = (props) => {
	const apiProvider = useApiProvider()
	const { address } = useWallet()
	const { account } = useWallet()

	const [nonce, setNonce] = useState()
	const [hashes, setHashes] = useState()
	// eslint-disable-next-line
	const [configs, setConfigs] = useState([])
	// eslint-disable-next-line
	const [balances, setBalances] = useState([])
	// eslint-disable-next-line
	const [members, setMembers] = useState([])
	const [content, setContent] = useState()
	const [access, setAccess] = useState([])

	// nonce

	useEffect(() => {
		let unsubscribe = null
		apiProvider.query.gameDaoControl
			.nonce((n) => {
				if (n.isNone) {
					setNonce('<None>')
				} else {
					setNonce(n.toNumber())
				}
			})
			.then((unsub) => {
				unsubscribe = unsub
			})
			.catch(console.error)
		return () => unsubscribe && unsubscribe()
	}, [apiProvider.query.gameDaoControl])

	// on nonce change get hashes

	useEffect(() => {
		if (nonce === 0) return
		const req = [...new Array(nonce)].map((a, i) => i)
		const queryHashes = async (args) => {
			const hashes = await apiProvider.query.gameDaoControl.bodyByNonce
				.multi(req)
				.then((_) => _.map((_h) => _h.toHuman()))
			setHashes(hashes)
		}
		queryHashes()
	}, [nonce, apiProvider.query.gameDaoControl])

	// on hashes get content

	useEffect(() => {
		if (!hashes) return
		const getContent = async (args) => {
			let _req = []
			try {
				for (var i = 0; i < args.length; i++)
					_req.push(apiProvider.query.gameDaoControl.bodies(args[i]))
				const res = await Promise.all(_req).then((_) => _.map((_c, _i) => _c.toHuman()))
				setContent(res)
			} catch (err) {
				console.error(err)
			}
		}
		getContent(hashes)
	}, [hashes, apiProvider.query.gameDaoControl])

	// on hashes get config

	useEffect(() => {
		if (!hashes) return
		const getContent = async (args) => {
			let _req = []
			try {
				for (var i = 0; i < args.length; i++)
					_req.push(apiProvider.query.gameDaoControl.bodyConfig(args[i]))
				const res = await Promise.all(_req).then((_) =>
					_.map((_c, _i) => {
						const _res = { id: args[_i], ..._c.toHuman() }
						return _res
					})
				)
				setConfigs(res)
			} catch (err) {
				console.error(err)
			}
		}
		getContent(hashes)
	}, [hashes, apiProvider.query.gameDaoControl])

	const [showCreateMode, setCreateMode] = useState(false)
	const handleCreateBtn = (e) => setCreateMode(true)
	const handleCloseBtn = (e) => setCreateMode(false)

	return (
		<Container maxWidth="lg">
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				<Box>
					{!content || nonce === 0 ? (
						<h4>No organizations yet. Create one!</h4>
					) : (
						<h4>Total organizations: {nonce}</h4>
					)}
				</Box>
				<Box>
					{address && showCreateMode ? (
						<Button
							variant="outlined"
							startIcon={<ClearIcon />}
							onClick={handleCloseBtn}
						>
							Close {address}
						</Button>
					) : account ? (
						<Button
							variant="outlined"
							startIcon={<AddIcon />}
							onClick={handleCreateBtn}
						>
							New DAO
						</Button>
					) : null}
				</Box>
			</Box>
			<br />
			{showCreateMode && <CreateDAO />}
			{!showCreateMode && content && nonce !== 0 && (
				<ItemList content={content} configs={configs} members={members} />
			)}
		</Container>
	)
}

export default function Module(props) {
	const apiProvider = useApiProvider()
	return apiProvider && apiProvider.query.gameDaoControl ? <Main {...props} /> : null
}
//
//
//
