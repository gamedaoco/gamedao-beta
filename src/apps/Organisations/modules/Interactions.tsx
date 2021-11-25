import React, { useEffect } from 'react'
import { useGameDaoControl } from '../../../hooks/useGameDaoControl'
import { useWallet } from '../../../context/Wallet'
import { Button } from '../../../components'
import { useApiProvider } from '@substra-hooks/core'

export function Interactions({ data }) {
	const { address, signAndNotify } = useWallet()
	const apiProvider = useApiProvider()

	const { queryBodyMemberState, bodyMemberState } = useGameDaoControl()

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
	}, [address])

	if (!data || !data?.access) return null

	const isAdmin = () => (address === data?.controller ? true : false)
	const isMember = () => (queryBodyMemberState?.[data.hash]?.[address] > 0 ? true : false)

	const actionType = ['join', 'apply', 'leave'][data.access]
	const actionCallback = [handleJoin, handleApply, handleLeave][data.access]

	console.log(
		'🚀 ~ file: Interactions.tsx ~ line 9 ~ Interactions ~ bodyMemberState',
		bodyMemberState
	)

	return (
		<>
			{(isMember() || isAdmin()) && (
				<Button
					variant={'outlined'}
					fullWidth
					onClick={() => {}}
					value={data.access}
				>{`Dashboard`}</Button>
			)}
			{isMember() && !isAdmin() && (
				<Button
					variant={'outlined'}
					fullWidth
					onClick={() => {}}
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
