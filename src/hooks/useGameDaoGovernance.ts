import { ApiPromise } from '@polkadot/api'
import { useApiProvider } from '@substra-hooks/core'
import { useState, useEffect } from 'react'
import { to } from 'await-to-js'
import { createErrorNotification } from 'src/utils/notification'
import { useIsMountedRef } from './useIsMountedRef'

type GameDaoGovernanceState = {
	proposalsCount: number
	proposalsArray: object
	proposalsIndex: object
	campaignBalanceUsed: object
	proposals: object
	metadata: object
	owners: object
	proposalSimpleVotes: object
	proposalStates: object
}

const INITIAL_STATE: GameDaoGovernanceState = {
	proposalsCount: null,
	proposalsArray: null,
	proposalsIndex: null,
	campaignBalanceUsed: null,
	proposals: null,
	metadata: null,
	owners: null,
	proposalSimpleVotes: null,
	proposalStates: null,
}

async function queryProposalsCount(apiProvider: ApiPromise): Promise<number> {
	const [error, data] = await to(apiProvider.query.gameDaoGovernance.proposalsCount())

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoGovernance proposalsCount')
		return null
	}

	return (data as any)?.toNumber() ?? 0
}

async function queryProposalsArray(
	apiProvider: ApiPromise,
	lastCount: number,
	proposalsCount: number
): Promise<any> {
	const [error, data] = await to(
		apiProvider.query.gameDaoGovernance.proposalsArray.multi(
			[...new Array(proposalsCount - lastCount)].map((_, i) => i + lastCount)
		)
	)

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoGovernance proposalsArray')
		return null
	}

	// Create a mapping from id->hash and hash->id
	const proposalsArray = {}
	const proposalsIndex = {}

	data.map((hash) => hash.toHuman()).forEach((hash: any, i) => {
		proposalsArray[hash] = i
		proposalsIndex[i] = hash
	})

	return {
		proposalsArray,
		proposalsIndex,
	}
}

async function queryCampaignBalanceUsed(apiProvider: ApiPromise, hashes: any): Promise<object> {
	if (!Array.isArray(hashes) || hashes.length === 0) return null

	const [error, data] = await to(
		apiProvider.query.gameDaoGovernance.campaignBalanceUsed.multi(hashes)
	)

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoGovernance campaignBalanceUsed')
		return null
	}

	const mapping = {}
	const formatedData = data.map((c) => c.toHuman())
	hashes.forEach((hash: any, i) => {
		mapping[hash] = formatedData?.[i] ?? null
	})

	return mapping
}

async function queryOwners(apiProvider: ApiPromise, hashes: any): Promise<any> {
	if (!Array.isArray(hashes) || hashes.length === 0) return null

	const [error, data] = await to(apiProvider.query.gameDaoGovernance.owners.multi(hashes))

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoGovernance owners')
		return null
	}

	const mapping = {}
	const formatedData = data.map((c) => c.toHuman())
	hashes.forEach((hash: any, i) => {
		mapping[hash] = formatedData?.[i] ?? null
	})

	return mapping
}

async function queryMetadata(apiProvider: ApiPromise, hashes: any): Promise<any> {
	if (!Array.isArray(hashes) || hashes.length === 0) return null

	const [error, data] = await to(apiProvider.query.gameDaoGovernance.metadata.multi(hashes))

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoGovernance metadata')
		return null
	}

	const mapping = {}
	const formatedData = data.map((c) => c.toHuman())
	hashes.forEach((hash: any, i) => {
		mapping[hash] = formatedData?.[i] ?? null
	})

	return mapping
}

async function queryProposalSimpleVotes(apiProvider: ApiPromise, hashes: any): Promise<any> {
	const [error, data] = await to(
		apiProvider.query.gameDaoGovernance.proposalSimpleVotes.multi(hashes)
	)

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoGovernance proposalSimpleVotes')
		return null
	}

	const mapping = {}
	const formatedData = data.map((c) => c.toHuman())
	hashes.forEach((hash: any, i) => {
		mapping[hash] = formatedData?.[i] ?? null
	})

	return mapping
}

async function queryProposalStates(apiProvider: ApiPromise, hashes: any): Promise<any> {
	const [error, data] = await to(apiProvider.query.gameDaoGovernance.proposalStates.multi(hashes))

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoGovernance proposalStates')
		return null
	}

	const mapping = {}
	const formatedData = data.map((c) => c.toHuman())
	hashes.forEach((hash: any, i) => {
		mapping[hash] = formatedData?.[i] ?? null
	})

	return mapping
}

async function queryProposals(apiProvider: ApiPromise, hashes: any): Promise<any> {
	const [error, data] = await to(apiProvider.query.gameDaoGovernance.proposals.multi(hashes))

	if (error) {
		console.error(error, hashes)
		createErrorNotification('Error while querying the gameDaoGovernance proposals')
		return null
	}

	const mapping = {}
	const formatedData = data.map((c) => c.toHuman())
	hashes.forEach((hash: any, i) => {
		mapping[hash] = formatedData?.[i] ?? null
	})

	return mapping
}

export const useGameDaoGovernance = (): GameDaoGovernanceState => {
	const [state, setState] = useState<GameDaoGovernanceState>(INITIAL_STATE)
	const [lastProposalsCount, setLastProposalsCount] = useState<number>(null)
	const [isDataLoading, setIsDataLoading] = useState<boolean>(false)
	const apiProvider = useApiProvider()
	const isMountedRef = useIsMountedRef()

	// Fetch proposalsCount
	useEffect(() => {
		if (apiProvider) {
			queryProposalsCount(apiProvider).then((proposalsCount) => {
				if (isMountedRef) {
					setState({ ...state, proposalsCount: proposalsCount ?? 0 })
				}
			})
		}
	}, [apiProvider, isMountedRef])

	// Fetch new proposalsArray
	useEffect(() => {
		if (
			state?.proposalsCount >= 0 &&
			(lastProposalsCount ?? 0 !== state.proposalsCount) &&
			apiProvider
		) {
			queryProposalsArray(apiProvider, lastProposalsCount ?? 0, state.proposalsCount).then(
				(opt) => {
					if (isMountedRef) {
						setState({
							...state,
							proposalsArray: {
								...(state.proposalsArray ?? {}),
								...(opt?.proposalsArray ?? {}),
							},
							proposalsIndex: {
								...(state.proposalsIndex ?? {}),
								...(opt?.proposalsIndex ?? {}),
							},
						})
					}
				}
			)
			setLastProposalsCount(state.proposalsCount)
		}
	}, [state.proposalsCount])

	// Fetch data with hash
	useEffect(() => {
		const keys = Object.keys(state.proposalsArray ?? {})
		if (keys.length > 0 && apiProvider && !isDataLoading) {
			setIsDataLoading(true)
			;(async () => {
				const data = await Promise.all([
					queryCampaignBalanceUsed(
						apiProvider,
						keys.filter((hash) => !(state.campaignBalanceUsed ?? {})[hash])
					),
					queryMetadata(
						apiProvider,
						keys.filter((hash) => !(state.metadata ?? {})[hash])
					),
					queryOwners(
						apiProvider,
						keys.filter((hash) => !(state.owners ?? {})[hash])
					),
					queryProposalSimpleVotes(
						apiProvider,
						keys.filter((hash) => !(state.proposalSimpleVotes ?? {})[hash])
					),
					queryProposalStates(
						apiProvider,
						keys.filter((hash) => !(state.proposalStates ?? {})[hash])
					),
					queryProposals(
						apiProvider,
						keys.filter((hash) => !(state.proposalStates ?? {})[hash])
					),
				])

				setIsDataLoading(false)
				if (isMountedRef) {
					setState({
						...state,
						campaignBalanceUsed: {
							...(state.campaignBalanceUsed ?? {}),
							...(data[0] ?? {}),
						},
						metadata: {
							...(state.metadata ?? {}),
							...(data[1] ?? {}),
						},
						owners: {
							...(state.owners ?? {}),
							...(data[2] ?? {}),
						},
						proposalSimpleVotes: {
							...(state.proposalSimpleVotes ?? {}),
							...(data[3] ?? {}),
						},
						proposalStates: {
							...(state.proposalStates ?? {}),
							...(data[4] ?? {}),
						},
						proposals: {
							...(state.proposals ?? {}),
							...(data[5] ?? {}),
						},
					})
				}
			})()
		}
	}, [state.proposalsArray])

	console.log(
		'🚀 ~ file: useGameDaoGovernance.ts ~ line 278 ~ useGameDaoGovernance ~ state',
		state
	)

	return state
}
