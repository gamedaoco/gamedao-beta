import { useEffect, useState } from 'react'
import { useIsMountedRef } from './useIsMountedRef'
import { useApiProvider } from '@substra-hooks/core'
import { createErrorNotification } from 'src/utils/notification'
import { ApiPromise } from '@polkadot/api'
import { to } from 'await-to-js'
import {
	addGameDaoControlMemberStateAction,
	gameDaoControlRefreshSelector,
	gameDaoControlStateSelector,
	updateGameDaoControlAction,
} from 'src/redux/duck/gameDaoControl.duck'
import { useDispatch, useSelector } from 'react-redux'

type GameDaoControlState = {
	nonce: number
	bodyHash: object
	bodyIndex: object
	bodies: object
	bodyStates: object
	bodyAccess: object
	bodyConfig: object
	bodyController: object
	bodyCreator: object
	bodyMemberCount: object
	bodyTreasury: object
	memberships: object
	controlledBodies: object
	bodyMemberState: object

	queryControlledBodies: Function
	queryBodyMemberState: Function
	queryMemberships: Function
}

const INITIAL_STATE: GameDaoControlState = {
	nonce: null,
	bodyHash: null,
	bodyIndex: null,
	bodies: null,
	bodyStates: null,
	bodyAccess: null,
	bodyConfig: null,
	bodyController: null,
	bodyCreator: null,
	bodyMemberCount: null,
	bodyTreasury: null,
	memberships: null,
	controlledBodies: null,
	bodyMemberState: null,
	queryMemberships: (accountId) => {},
	queryBodyMemberState(hash, accountId) {},
	queryControlledBodies: (accountId) => {},
}

async function queryNonce(apiProvider: ApiPromise): Promise<number> {
	const [error, data] = await to(apiProvider.query.gameDaoControl.nonce())
	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoControl nonce')
		return null
	}

	return (data as any)?.toNumber() ?? 0
}

async function queryBodyByNonce(apiProvider: ApiPromise, nonces: Array<number>): Promise<any> {
	if (!Array.isArray(nonces) || nonces.length === 0) return null

	const [error, data] = await to(apiProvider.query.gameDaoControl.bodyByNonce.multi(nonces))

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoControl bodyByNonce')
		return null
	}

	// Create a mapping from id->hash and hash->id
	const bodyHash = {}
	const bodyIndex = {}

	data.map((hash) => hash.toHuman()).forEach((hash: any, i) => {
		bodyHash[hash] = i
		bodyIndex[i] = hash
	})

	return {
		bodyHash,
		bodyIndex,
	}
}

async function queryBodies(apiProvider: ApiPromise, hashes: Array<string>): Promise<any> {
	if (!Array.isArray(hashes) || hashes.length === 0) return null

	const [error, data] = await to(apiProvider.query.gameDaoControl.bodies.multi(hashes))

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoControl bodies')
		return null
	}

	const mapping = {}
	const formatedData = data.map((c) => c.toHuman())
	hashes.forEach((hash: any, i) => {
		mapping[hash] = formatedData?.[i] ?? null
	})

	return mapping
}

async function queryBodyAccess(apiProvider: ApiPromise, hashes: Array<string>): Promise<any> {
	if (!Array.isArray(hashes) || hashes.length === 0) return null

	const [error, data] = await to(apiProvider.query.gameDaoControl.bodyAccess.multi(hashes))

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoControl bodyAccess')
		return null
	}

	const mapping = {}
	const formatedData = data.map((c) => c.toHuman())
	hashes.forEach((hash: any, i) => {
		mapping[hash] = formatedData?.[i] ?? null
	})

	return mapping
}

async function queryBodyConfig(apiProvider: ApiPromise, hashes: Array<string>): Promise<any> {
	if (!Array.isArray(hashes) || hashes.length === 0) return null

	const [error, data] = await to(apiProvider.query.gameDaoControl.bodyConfig.multi(hashes))

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoControl bodyConfig')
		return null
	}

	const mapping = {}
	const formatedData = data.map((c) => c.toHuman())
	hashes.forEach((hash: any, i) => {
		mapping[hash] = formatedData?.[i] ?? null
	})

	return mapping
}

async function queryBodyController(apiProvider: ApiPromise, hashes: Array<string>): Promise<any> {
	if (!Array.isArray(hashes) || hashes.length === 0) return null

	const [error, data] = await to(apiProvider.query.gameDaoControl.bodyController.multi(hashes))

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoControl bodyController')
		return null
	}

	const mapping = {}
	const formatedData = data.map((c) => c.toHuman())
	hashes.forEach((hash: any, i) => {
		mapping[hash] = formatedData?.[i] ?? null
	})

	return mapping
}

async function queryBodyCreator(apiProvider: ApiPromise, hashes: Array<string>): Promise<any> {
	if (!Array.isArray(hashes) || hashes.length === 0) return null

	const [error, data] = await to(apiProvider.query.gameDaoControl.bodyCreator.multi(hashes))

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoControl bodyCreator')
		return null
	}

	const mapping = {}
	const formatedData = data.map((c) => c.toHuman())
	hashes.forEach((hash: any, i) => {
		mapping[hash] = formatedData?.[i] ?? null
	})

	return mapping
}

async function queryBodyTreasury(apiProvider: ApiPromise, hashes: Array<string>): Promise<any> {
	if (!Array.isArray(hashes) || hashes.length === 0) return null

	const [error, data] = await to(apiProvider.query.gameDaoControl.bodyTreasury.multi(hashes))

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoControl bodyTreasury')
		return null
	}

	const mapping = {}
	const formatedData = data.map((c) => c.toHuman())
	hashes.forEach((hash: any, i) => {
		mapping[hash] = formatedData?.[i] ?? null
	})

	return mapping
}

async function queryBodyStates(apiProvider: ApiPromise, hashes: Array<string>): Promise<any> {
	if (!Array.isArray(hashes) || hashes.length === 0) return null

	const [error, data] = await to(apiProvider.query.gameDaoControl.bodyState.multi(hashes))

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoControl bodyStates')
		return null
	}

	const mapping = {}
	const formatedData = data.map((c) => c.toHuman())
	hashes.forEach((hash: any, i) => {
		mapping[hash] = formatedData?.[i] ?? null
	})

	return mapping
}

async function queryBodyMemberCount(apiProvider: ApiPromise, hashes: Array<string>): Promise<any> {
	if (!Array.isArray(hashes) || hashes.length === 0) return null

	const [error, data] = await to(apiProvider.query.gameDaoControl.bodyMemberCount.multi(hashes))

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoControl bodyMemberCount')
		return null
	}

	const mapping = {}
	const formatedData = data.map((c) => c.toHuman())
	hashes.forEach((hash: any, i) => {
		mapping[hash] = formatedData?.[i] ?? null
	})

	return mapping
}

async function queryMemberships(apiProvider: ApiPromise, accoutId: string): Promise<any> {
	const [error, data] = await to(apiProvider.query.gameDaoControl.memberships(accoutId))

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoControl memberships')
		return null
	}

	return data.toHuman()
}

async function queryControllerdBodies(apiProvider: ApiPromise, accountId: string): Promise<any> {
	const [error, data] = await to(apiProvider.query.gameDaoControl.controllerdBodies(accountId))

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoControl controllerdBodies')
		return null
	}

	return data.toHuman()
}

async function queryBodyMemberState(
	apiProvider: ApiPromise,
	hash: string,
	accountId: string
): Promise<any> {
	const [error, data] = await to(
		apiProvider.query.gameDaoControl.bodyMemberState([hash, accountId])
	)

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoControl bodyMemberState')
		return null
	}

	return data.toHuman()
}

export const useGameDaoControl = (): GameDaoControlState => {
	const [lastBodyCount, setLastBodyCount] = useState<number>(null)
	const [isDataLoading, setIsDataLoading] = useState<boolean>(false)
	const gameDaoControlState = useSelector(gameDaoControlStateSelector)
	const refresh = useSelector(gameDaoControlRefreshSelector)

	const apiProvider = useApiProvider()
	const isMountedRef = useIsMountedRef()
	const dispatch = useDispatch()

	function setState(data) {
		dispatch(updateGameDaoControlAction(data))
	}

	async function handleQueryMemberships(accoutId: string): Promise<void> {
		const data = await queryMemberships(apiProvider, accoutId)
		setState({ memberships: { ...(gameDaoControlState.memberships ?? {}), [accoutId]: data } })
	}

	async function handleQueryControlledBodies(accoutId: string): Promise<void> {
		const data = await queryControllerdBodies(apiProvider, accoutId)
		setState({
			controlledBodies: { ...(gameDaoControlState.controlledBodies ?? {}), [accoutId]: data },
		})
	}

	async function handleQueryBodyMemberState(hash: string, accoutId: string): Promise<void> {
		const data = await queryBodyMemberState(apiProvider, hash, accoutId)

		dispatch(addGameDaoControlMemberStateAction(hash, { [accoutId]: data }))
	}

	useEffect(() => {
		if (refresh === true && apiProvider) {
			setLastBodyCount(null)
			queryNonce(apiProvider).then((nonce) => {
				setState({ nonce: nonce })
			})
		}
	}, [refresh])

	// Fetch nonce
	useEffect(() => {
		if (apiProvider) {
			queryNonce(apiProvider).then((nonce) => {
				if (isMountedRef) {
					setState({ nonce: nonce })
				}
			})
		}
	}, [apiProvider, isMountedRef])

	// Fetch bodies
	useEffect(() => {
		if (
			gameDaoControlState?.nonce >= 0 &&
			(lastBodyCount ?? 0 !== gameDaoControlState.nonce) &&
			apiProvider
		) {
			queryBodyByNonce(
				apiProvider,
				[...new Array(gameDaoControlState.nonce - lastBodyCount ?? 0)].map(
					(_, i) => i + lastBodyCount ?? 0
				)
			).then((opt) => {
				if (isMountedRef) {
					setState({
						bodyHash: {
							...(gameDaoControlState.bodyHash ?? {}),
							...(opt?.bodyHash ?? {}),
						},
						bodyIndex: {
							...(gameDaoControlState.bodyIndex ?? {}),
							...(opt?.bodyIndex ?? {}),
						},
					})
				}
			})
			setLastBodyCount(gameDaoControlState.nonce)
		}
	}, [gameDaoControlState.nonce])

	// Fetch bodie and details
	useEffect(() => {
		const keys = Object.keys(gameDaoControlState.bodyHash ?? {})
		if (keys.length > 0 && apiProvider && !isDataLoading) {
			setIsDataLoading(true)
			;(async () => {
				const data = await Promise.all([
					queryBodies(
						apiProvider,
						keys.filter((hash) => !(gameDaoControlState.bodies ?? {})[hash])
					),
					queryBodyAccess(
						apiProvider,
						keys.filter((hash) => !(gameDaoControlState.bodyAccess ?? {})[hash])
					),
					queryBodyConfig(
						apiProvider,
						keys.filter((hash) => !(gameDaoControlState.bodyConfig ?? {})[hash])
					),
					queryBodyController(
						apiProvider,
						keys.filter((hash) => !(gameDaoControlState.bodyController ?? {})[hash])
					),
					queryBodyCreator(
						apiProvider,
						keys.filter((hash) => !(gameDaoControlState.bodyCreator ?? {})[hash])
					),
					queryBodyMemberCount(
						apiProvider,
						keys.filter((hash) => !(gameDaoControlState.bodyMemberCount ?? {})[hash])
					),
					queryBodyTreasury(
						apiProvider,
						keys.filter((hash) => !(gameDaoControlState.bodyTreasury ?? {})[hash])
					),
					queryBodyStates(
						apiProvider,
						keys.filter((hash) => !(gameDaoControlState.bodyStates ?? {})[hash])
					),
				])

				setIsDataLoading(false)

				if (isMountedRef) {
					setState({
						bodies: {
							...(gameDaoControlState.bodies ?? {}),
							...(data[0] ?? {}),
						},
						bodyAccess: {
							...(gameDaoControlState.bodyAccess ?? {}),
							...(data[1] ?? {}),
						},
						bodyConfig: {
							...(gameDaoControlState.bodyConfig ?? {}),
							...(data[2] ?? {}),
						},
						bodyController: {
							...(gameDaoControlState.bodyController ?? {}),
							...(data[3] ?? {}),
						},
						bodyCreator: {
							...(gameDaoControlState.bodyCreator ?? {}),
							...(data[4] ?? {}),
						},
						bodyMemberCount: {
							...(gameDaoControlState.bodyMemberCount ?? {}),
							...(data[5] ?? {}),
						},
						bodyTreasury: {
							...(gameDaoControlState.bodyTreasury ?? {}),
							...(data[6] ?? {}),
						},
						bodyStates: {
							...(gameDaoControlState.bodyStates ?? {}),
							...(data[7] ?? {}),
						},
					})
				}
			})()
		}
	}, [gameDaoControlState.bodyHash])

	return {
		...gameDaoControlState,
		queryMemberships: handleQueryMemberships,
		queryControlledBodies: handleQueryControlledBodies,
		queryBodyMemberState: handleQueryBodyMemberState,
	}
}
