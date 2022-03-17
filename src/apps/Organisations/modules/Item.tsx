import React, { useState, useEffect, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { to } from 'await-to-js'
import { gateway } from '../../lib/ipfs'
import { dao_bodies } from '../../lib/data'

import LockIcon from '@mui/icons-material/Lock'
import OpenLockIcon from '@mui/icons-material/LockOpen'
import WebsiteIcon from '@mui/icons-material/Web'
import MemberIcon from '@mui/icons-material/AccountBox'
import { createErrorNotification } from 'src/utils/notification'
import { Typography, Box, Stack, Link } from 'src/components'
import { ListItem } from 'src/components/ListItem'
import { TileItem } from 'src/components/TileItem'
import { ListTileEnum } from 'src/apps/components/ListTileSwitch'
import { Interactions } from './Interactions'

async function fetchMetaData(cid, setMetaData) {
	// Invalid ipfs hash
	if (cid?.length !== 46) return

	const [err, data] = await to(fetch(`${gateway}${cid}`))
	if (err) {
		createErrorNotification('Metadata for this organization could not be downloaded ')
		return console.error(err)
	}

	const [parseErr, parsedData] = await to(data.json())
	if (parseErr) {
		createErrorNotification('Metadata for this organization could not be parsed ')
		return console.error(parseErr)
	}

	setMetaData(parsedData)
}

export function Item({ data, displayMode }) {
	const [metaDataState, setMetaDataState] = useState<any>()
	const [imageState, setImageState] = useState<any>(
		`${gateway}QmUxC9MpMjieyrGXZ4zC4yJZmH7s8H2bxMk7oQAMzfNLhY`
	)
	const [textState, setTextState] = useState<any>('')

	useEffect(() => {
		if (data && data?.body?.cid) {
			fetchMetaData(data.body.cid, setMetaDataState)
		}

		if (data && data.body) {
			setTextState(
				dao_bodies.filter((b) => b.value === Number(data?.body?.body || '0'))[0].text
			)
		}
	}, [data])

	useEffect(() => {
		if (metaDataState && metaDataState.logo) {
			setImageState(`${gateway}${metaDataState.logo}`)
		}
	}, [metaDataState])

	if (!data) {
		return null
	}

	const metaContent = useMemo(() => {
		if (!data || !metaDataState) {
			return null
		}
		return (
			<Stack
				sx={{ width: '100%', height: '100%' }}
				direction={'column'}
				justifyContent={displayMode === ListTileEnum.TILE ? 'flex-end' : 'inherit'}
				spacing={1}
			>
				<Stack direction={'row'} spacing={1}>
					<WebsiteIcon />
					<Link
						component="a"
						rel={'noreferrer'}
						target={'_blank'}
						href={metaDataState.website || '#'}
					>
						{metaDataState.website}
					</Link>
				</Stack>

				<Stack direction={'row'} spacing={1}>
					{data.access === '0' ? (
						<>
							<OpenLockIcon /> <Typography>Public</Typography>
						</>
					) : (
						<>
							<LockIcon /> <Typography>Private</Typography>
						</>
					)}
				</Stack>

				<Stack direction={'row'} spacing={1}>
					<MemberIcon />
					<Typography>
						{data.members || 0} {data.members || 0 > 1 ? 'Members' : 'Member'}
					</Typography>
				</Stack>

				{displayMode === ListTileEnum.LIST && <Box sx={{ flex: 1 }} />}

				<Interactions data={data} hideDashboard={false} />
			</Stack>
		)
	}, [data, metaDataState, displayMode])

	const limit = displayMode === ListTileEnum.LIST ? 256 : 128
	const description =
		'' + (metaDataState?.description.length > limit)
			? metaDataState?.description.slice(0, limit) + '...'
			: metaDataState?.description

	if (displayMode === ListTileEnum.LIST) {
		return (
			<ListItem
				linkTo={`/app/organisations/${data.hash}`}
				imageURL={imageState}
				headline={metaDataState?.name}
				metaHeadline={textState}
				metaContent={metaContent}
			>
				<Typography>{description}</Typography>
			</ListItem>
		)
	}

	return (
		<TileItem
			linkTo={`/app/organisations/${data.hash}`}
			imageURL={imageState}
			headline={metaDataState?.name}
			metaHeadline={textState}
			metaContent={metaContent}
		>
			<Typography>{description}</Typography>
		</TileItem>
	)
}
