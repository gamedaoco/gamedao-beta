import React, { useEffect, useState } from 'react'
import { useGameDaoControl } from '../../../hooks/useGameDaoControl'
import { useWallet } from '../../../context/Wallet'
import { Button } from '../../../components'
import { useApiProvider } from '@substra-hooks/core'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
	clearGameDaoControlAction,
	gameDaoControlRefreshSelector,
} from 'src/redux/duck/gameDaoControl.duck'
import { useBalance } from 'src/hooks/useBalance'

export function Interactions({ data, hideDashboard }) {
	const [isMemberState, setIsMemberState] = useState(false)
	const { address, connected, signAndNotify } = useWallet()
	const { updateBalance } = useBalance()
	const apiProvider = useApiProvider()
	const navigate = useNavigate()
	const { queryBodyMemberState, queryMemberships } = useGameDaoControl()
	const refresh = useSelector(gameDaoControlRefreshSelector)
	const dispatch = useDispatch()

	function updatePageState() {
		setTimeout(() => {
			dispatch(clearGameDaoControlAction())
			updateBalance()
		}, 1500)
	}

	async function handleApply() {
		const payload = [data.hash, address]
		signAndNotify(
			apiProvider.tx.gameDaoControl.addMember(...payload),
			{
				pending: 'Apply to DAO in progress',
				success: 'Apply to DAO successful',
				error: 'Apply to DAO failed',
			},
			(state) => {
				updatePageState()
				if (!state) {
					// TODO: 2075 Do we need error handling here?
				}
			}
		)
	}

	async function handleJoin() {
		const payload = [data.hash, address]
		signAndNotify(
			apiProvider.tx.gameDaoControl.addMember(...payload),
			{
				pending: 'Join organisations in progress',
				success: 'Join organisations successfully',
				error: 'Join organisations failed',
			},
			(state) => {
				updatePageState()
				if (!state) {
					// TODO: 2075 Do we need error handling here?
				}
			}
		)
	}

	async function handleLeave() {
		const payload = [data.hash, address]
		signAndNotify(
			apiProvider.tx.gameDaoControl.removeMember(...payload),
			{
				pending: 'Leave DAO in progress',
				success: 'Leave DAO successful',
				error: 'Leave DAO failed',
			},
			(state) => {
				updatePageState()
				if (!state) {
					// TODO: 2075 Do we need error handling here?
				}
			}
		)
	}

	useEffect(() => {
		;(async () => {
			if (address) {
				queryBodyMemberState(data.hash, address)
				queryMemberships(address)
				const memberships = await queryMemberships(address)
				setIsMemberState(memberships?.includes(data.hash))
			}
		})()
	}, [address, refresh])

	if (!connected || !data || !data?.access) return null

	const isAdmin = () => (address === data?.controller ? true : false)

	const actionType = ['join', 'apply', 'leave'][data.access]
	const actionCallback = [handleJoin, handleApply, handleLeave][data.access]

	return (
		<>
			{(isMemberState || isAdmin()) && !hideDashboard && (
				<Button
					variant={'outlined'}
					fullWidth
					onClick={() => navigate(`/app/organisations/${data.hash}`)}
					value={data.access}
					size="small"
				>{`Dashboard`}</Button>
			)}
			{isMemberState && !isAdmin() && (
				<Button
					variant={'outlined'}
					fullWidth
					onClick={handleLeave}
					value={data.access}
					size="small"
				>{`leave`}</Button>
			)}
			{!isMemberState && actionType && (
				<Button
					variant={'outlined'}
					fullWidth
					onClick={actionCallback}
					value={data.access}
					size="small"
				>{`${actionType}`}</Button>
			)}
			{isAdmin() && (
				<Button variant={'outlined'} fullWidth size="small" onClick={() => {}}>
					Admin
				</Button>
			)}
		</>
	)
}
