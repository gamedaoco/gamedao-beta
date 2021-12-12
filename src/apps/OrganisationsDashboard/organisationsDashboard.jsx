import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { TabHeader } from './modules/tabHeader'
import { gateway } from '../lib/ipfs'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { Overview } from './modules/overview'
import { Members } from './modules/members'
import { to } from 'await-to-js'
import { useWallet } from 'src/context/Wallet'
import { Interactions } from 'src/apps/Organisations/modules/Interactions'
import { Box, Stack, Paper, Typography, Avatar } from '../../components'
import { createErrorNotification } from 'src/utils/notification'

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

export function OrganisationsDashboard() {
	const [selectedTabState, setSelectedTabState] = useState('Overview')
	const { address } = useWallet()
	const [metaDataState, setMetaDataState] = useState()
	const [dataState, setDataState] = useState()
	const [imageState, setImageState] = useState(
		`${gateway}QmUxC9MpMjieyrGXZ4zC4yJZmH7s8H2bxMk7oQAMzfNLhY`
	)
	const {
		bodyConfig,
		bodyMemberCount,
		bodies,
		bodyController,
		bodyAccess,
		bodyTreasury,
		queryBodyMemberState,
		bodyMemberState,
		bodyMembers,
	} = useGameDaoControl()
	const { id } = useParams()

	useEffect(() => {
		if (id) {
			if (
				bodyConfig &&
				bodyMemberCount &&
				bodies &&
				bodyController &&
				bodyAccess &&
				bodyTreasury &&
				bodyMembers
			) {
				const config = bodyConfig[id]
				const members = bodyMemberCount[id]
				const body = bodies[id]
				const controller = bodyController[id]
				const access = bodyAccess[id]
				const treasury = bodyTreasury[id]

				setDataState({
					hash: id,
					config,
					members,
					body,
					controller,
					access,
					treasury,
					bodyMembers: bodyMembers[id],
				})
			}
		}
	}, [
		id,
		bodyConfig,
		bodyMemberCount,
		bodies,
		bodyController,
		bodyAccess,
		bodyTreasury,
		bodyMembers,
	])

	useEffect(() => {
		if (dataState && dataState?.body?.cid) {
			fetchMetaData(dataState.body.cid, setMetaDataState)
		}
	}, [dataState])

	useEffect(() => {
		if (metaDataState && metaDataState.logo) {
			setImageState(`${gateway}${metaDataState.logo}`)
		}
	}, [metaDataState])

	useEffect(() => {
		if (address && dataState) {
			queryBodyMemberState(dataState.hash, address)
		}
	}, [address, dataState])

	if (!dataState) {
		return null
	}

	const isAdmin = () => (address === dataState?.controller ? true : false)
	const isMember = () => (bodyMemberState?.[dataState.hash]?.[address] > 0 ? true : false)

	return (
		<>
			<TabHeader
				selectedTab={selectedTabState}
				setSelectedTab={setSelectedTabState}
				isAdmin={isAdmin}
			/>

			<Box display="flex" padding={4}>
				<Box flex="1">
					<Paper>
						<Stack spacing={2} padding={4} justifyContent="center" alignItems="center">
							<Avatar
								sx={{ width: '50%', height: 'auto' }}
								alt="org"
								src={imageState}
							/>
							<Typography variant="h6" textAlign="center">
								{metaDataState?.name ?? ''}
							</Typography>
							<Typography textAlign="center">
								{dataState?.members || 0}{' '}
								{dataState?.members || 0 > 1 ? 'Members' : 'Member'}
							</Typography>
							<Interactions data={dataState} hideDashboard={true} />
						</Stack>
					</Paper>
				</Box>
				<Stack spacing={4} flex="3" paddingLeft={4}>
					{selectedTabState === 'Overview' && <Overview metaData={metaDataState} />}
					{selectedTabState === 'Members' && <Members data={dataState} />}
				</Stack>
			</Box>
		</>
	)
}
