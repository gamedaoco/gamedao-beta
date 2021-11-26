import { useEffect, useState } from 'react'
import { useIsMountedRef } from './useIsMountedRef'
import { useApiProvider } from '@substra-hooks/core'
import { createErrorNotification } from 'src/utils/notification'
import { ApiPromise } from '@polkadot/api'
import { to } from 'await-to-js'
import { useHookState } from 'src/context/Hook'

type GameDaoControlState = {
	nonce: number
	bodyHash: object
	bodyIndex: object
	bodies: object
	bodyAccess: object
	bodyConfig: object
	bodyController: object
	bodyCreator: object
	bodyMemberCount: object
	bodyTreasury: object
	memberships: object
	controlledBodies: object

	queryControlledBodies: Function
	queryMemberships: Function
}

const INITIAL_STATE: GameDaoControlState = {
	nonce: null,
	bodyHash: null,
	bodyIndex: null,
	bodies: null,
	bodyAccess: null,
	bodyConfig: null,
	bodyController: null,
	bodyCreator: null,
	bodyMemberCount: null,
	bodyTreasury: null,
	memberships: null,
	controlledBodies: null,
	queryMemberships: (accountId) => {},
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

export const useGameDaoControl = (): GameDaoControlState => {
	const {gameDaoControl, updateState} = useHookState();
	const [lastBodyCount, setLastBodyCount] = useState<number>(null)
	const [isDataLoading, setIsDataLoading] = useState<boolean>(false)
	const apiProvider = useApiProvider()
	const isMountedRef = useIsMountedRef()

	const state: any = gameDaoControl;

	function setState(data) {
		updateState({ gameDaoControl: data });
	}

	async function handleQueryMemberships(accoutId: string): Promise<void> {
		const data = await queryMemberships(apiProvider, accoutId)

		setState({ memberships: { ...(gameDaoControl.memberships ?? {}), [accoutId]: data } })

	}

	async function handleQueryControlledBodies(accoutId: string): Promise<void> {
		const data = await queryControllerdBodies(apiProvider, accoutId)
		setState({

			controlledBodies: { ...(gameDaoControl.controlledBodies ?? {}), [accoutId]: data },
		})
	}

	// Fetch nonce
	useEffect(() => {
		if (apiProvider) {
			queryNonce(apiProvider).then((nonce) => {
				if (isMountedRef) {
					setState({  nonce: nonce })
				}
			})
		}
	}, [apiProvider, isMountedRef])

	// Fetch bodies
	useEffect(() => {
		if (state?.nonce >= 0 && (lastBodyCount ?? 0 !== gameDaoControl.nonce) && apiProvider) {
			const lastIndex = (gameDaoControl.nonce || 0) - lastBodyCount ?? 0;
			if (lastIndex <= 0) return;

			queryBodyByNonce(
				apiProvider,
				[...new Array(lastIndex)].map(
					(_, i) => i + lastBodyCount ?? 0
				)
			).then((opt) => {
				if (isMountedRef) {
					setState({
						bodyHash: {
							...(gameDaoControl.bodyHash ?? {}),
							...(opt?.bodyHash ?? {}),
						},
						bodyIndex: {
							...(gameDaoControl.bodyIndex ?? {}),
							...(opt?.bodyIndex ?? {}),
						},
					})
				}
			})
			setLastBodyCount(gameDaoControl.nonce)
		}
	}, [gameDaoControl.nonce])

	// Fetch bodie and details
	useEffect(() => {
		const keys = Object.keys(gameDaoControl.bodyHash ?? {})
		if (keys.length > 0 && apiProvider && !isDataLoading) {
			setIsDataLoading(true)
			;(async () => {
				const data = await Promise.all([
					queryBodies(
						apiProvider,
						keys.filter((hash) => !(gameDaoControl.bodies ?? {})[hash])
					),
					queryBodyAccess(
						apiProvider,
						keys.filter((hash) => !(gameDaoControl.bodyAccess ?? {})[hash])
					),
					queryBodyConfig(
						apiProvider,
						keys.filter((hash) => !(gameDaoControl.bodyConfig ?? {})[hash])
					),
					queryBodyController(
						apiProvider,
						keys.filter((hash) => !(gameDaoControl.bodyController ?? {})[hash])
					),
					queryBodyCreator(
						apiProvider,
						keys.filter((hash) => !(gameDaoControl.bodyCreator ?? {})[hash])
					),
					queryBodyMemberCount(
						apiProvider,
						keys.filter((hash) => !(gameDaoControl.bodyMemberCount ?? {})[hash])
					),
					queryBodyTreasury(
						apiProvider,
						keys.filter((hash) => !(gameDaoControl.bodyTreasury ?? {})[hash])
					),
				])

				setIsDataLoading(false)

				if (isMountedRef) {
					setState({
						bodies: {
							...(gameDaoControl.bodies ?? {}),
							...(data[0] ?? {}),
						},
						bodyAccess: {
							...(gameDaoControl.bodyAccess ?? {}),
							...(data[1] ?? {}),
						},
						bodyConfig: {
							...(gameDaoControl.bodyConfig ?? {}),
							...(data[2] ?? {}),
						},
						bodyController: {
							...(gameDaoControl.bodyController ?? {}),
							...(data[3] ?? {}),
						},
						bodyCreator: {
							...(gameDaoControl.bodyCreator ?? {}),
							...(data[4] ?? {}),
						},
						bodyMemberCount: {
							...(gameDaoControl.bodyMemberCount ?? {}),
							...(data[5] ?? {}),
						},
						bodyTreasury: {
							...(gameDaoControl.bodyTreasury ?? {}),
							...(data[6] ?? {}),
						},
					})
				}
			})()
		}
	}, [gameDaoControl.bodyHash])
	console.log('🚀 ~ file: useGameDaoControl.ts ~ line 386 ~ useGameDaoControl ~ state', state)

	return {
		...(gameDaoControl as any),
		queryMemberships: handleQueryMemberships,
		queryControlledBodies: handleQueryControlledBodies,
	}
}
