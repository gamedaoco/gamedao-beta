import React, { useEffect } from 'react'
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

export function Interactions({ data }) {
	const { address, signAndNotify } = useWallet()
	const { updateBalance } = useBalance()
	const apiProvider = useApiProvider()
	const navigate = useNavigate()
	const { queryBodyMemberState, bodyMemberState } = useGameDaoControl()
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
				pending: 'Apply organisations in progress',
				success: 'Apply organisations successfully',
				error: 'Apply organisations failed',
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
				pending: 'Leave organisations in progress',
				success: 'Leave organisations successfully',
				error: 'Leave organisations failed',
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
		if (address) {
			queryBodyMemberState(data.hash, address)
		}
	}, [address, refresh])

	if (!data || !data?.access) return null

	const isAdmin = () => (address === data?.controller ? true : false)
	const isMember = () => (bodyMemberState?.[data.hash]?.[address] > 0 ? true : false)

	const actionType = ['join', 'apply', 'leave'][data.access]
	const actionCallback = [handleJoin, handleApply, handleLeave][data.access]

	return (
		<>
			{(isMember() || isAdmin()) && (
				<Button
					variant={'outlined'}
					fullWidth
					onClick={() => navigate(`/app/organisations/${data.hash}`)}
					value={data.access}
				>{`Dashboard`}</Button>
			)}
			{isMember() && !isAdmin() && (
				<Button
					variant={'outlined'}
					fullWidth
					onClick={handleLeave}
					value={data.access}
				>{`leave`}</Button>
			)}
			{!isMember() && actionType && (
				<Button
					variant={'outlined'}
					fullWidth
					onClick={actionCallback}
					value={data.access}
				>{`${actionType}`}</Button>
			)}
			{isAdmin() && (
				<Button variant={'outlined'} fullWidth onClick={() => {}}>
					Admin
				</Button>
			)}
		</>
	)
}
