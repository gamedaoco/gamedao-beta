import { ApiPromise } from '@polkadot/api'
import { useApiProvider } from '@substra-hooks/core'
import { useState, useEffect } from 'react'
import { to } from 'await-to-js'
import { createErrorNotification } from 'src/utils/notification'
import { useIsMountedRef } from './useIsMountedRef'
import {
	governanceRefreshSelector,
	governanceStateSelector,
	updateGovernanceAction,
} from 'src/redux/duck/gameDaoGovernance.duck'
import { useDispatch, useSelector } from 'react-redux'

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
	proposalVoters: object
	proposalApprovers: object
	proposalDeniers: object
	proposalVotesByVoters: object
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

async function queryProposalVoters(apiProvider: ApiPromise, hashes: any): Promise<any> {
	const [error, data] = await to(apiProvider.query.gameDaoGovernance.proposalVoters.multi(hashes))

	if (error) {
		console.error(error, hashes)
		createErrorNotification('Error while querying the gameDaoGovernance queryProposalVoters')
		return null
	}

	const mapping = {}
	const formatedData = data.map((c) => c.toHuman())
	hashes.forEach((hash: any, i) => {
		mapping[hash] = formatedData?.[i] ?? null
	})

	return mapping
}

async function queryProposalApprovers(apiProvider: ApiPromise, hashes: any): Promise<any> {
	const [error, data] = await to(
		apiProvider.query.gameDaoGovernance.proposalApprovers.multi(hashes)
	)

	if (error) {
		console.error(error, hashes)
		createErrorNotification('Error while querying the gameDaoGovernance queryProposalApprovers')
		return null
	}

	const mapping = {}
	const formatedData = data.map((c) => c.toHuman())
	hashes.forEach((hash: any, i) => {
		mapping[hash] = formatedData?.[i] ?? null
	})

	return mapping
}

async function queryProposalDeniers(apiProvider: ApiPromise, hashes: any): Promise<any> {
	const [error, data] = await to(
		apiProvider.query.gameDaoGovernance.proposalDeniers.multi(hashes)
	)

	if (error) {
		console.error(error, hashes)
		createErrorNotification('Error while querying the gameDaoGovernance queryProposalDeniers')
		return null
	}

	const mapping = {}
	const formatedData = data.map((c) => c.toHuman())
	hashes.forEach((hash: any, i) => {
		mapping[hash] = formatedData?.[i] ?? null
	})

	return mapping
}

async function queryProposalVotesByVoters(apiProvider: ApiPromise, hashes: any): Promise<any> {
	const [error, data] = await to(
		apiProvider.query.gameDaoGovernance.proposalVotesByVoters.multi(hashes)
	)

	if (error) {
		console.error(error, hashes)
		createErrorNotification(
			'Error while querying the gameDaoGovernance queryProposalVotesByVoters'
		)
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
	const [lastProposalsCount, setLastProposalsCount] = useState<number>(null)
	const [isDataLoading, setIsDataLoading] = useState<boolean>(false)
	const apiProvider = useApiProvider()
	const isMountedRef = useIsMountedRef()
	const governanceState = useSelector(governanceStateSelector)
	const refresh = useSelector(governanceRefreshSelector)

	const dispatch = useDispatch()

	function setState(data) {
		dispatch(updateGovernanceAction(data))
	}

	useEffect(() => {
		if (refresh === true && apiProvider) {
			setState({ proposalsCount: 0 })
			setLastProposalsCount(null)
			queryProposalsCount(apiProvider).then((proposalsCount) => {
				setState({ proposalsCount: proposalsCount ?? 0 })
			})
		}
	}, [refresh])

	// Fetch proposalsCount
	useEffect(() => {
		if (apiProvider) {
			queryProposalsCount(apiProvider).then((proposalsCount) => {
				setState({ proposalsCount: proposalsCount ?? 0 })
			})
		}
	}, [apiProvider, isMountedRef])

	// Fetch new proposalsArray
	useEffect(() => {
		if (
			governanceState?.proposalsCount >= 0 &&
			(lastProposalsCount ?? 0 !== governanceState.proposalsCount) &&
			apiProvider
		) {
			queryProposalsArray(
				apiProvider,
				lastProposalsCount ?? 0,
				governanceState.proposalsCount
			).then((opt) => {
				if (isMountedRef) {
					setState({
						proposalsArray: {
							...(governanceState.proposalsArray ?? {}),
							...(opt?.proposalsArray ?? {}),
						},
						proposalsIndex: {
							...(governanceState.proposalsIndex ?? {}),
							...(opt?.proposalsIndex ?? {}),
						},
					})
				}
			})
			setLastProposalsCount(governanceState.proposalsCount)
		}
	}, [governanceState.proposalsCount])

	// Fetch data with hash
	useEffect(() => {
		const keys = Object.keys(governanceState.proposalsArray ?? {})
		if (keys.length > 0 && apiProvider && !isDataLoading) {
			setIsDataLoading(true)
			;(async () => {
				const data = await Promise.all([
					queryCampaignBalanceUsed(
						apiProvider,
						keys.filter((hash) => !(governanceState.campaignBalanceUsed ?? {})[hash])
					),
					queryMetadata(
						apiProvider,
						keys.filter((hash) => !(governanceState.metadata ?? {})[hash])
					),
					queryOwners(
						apiProvider,
						keys.filter((hash) => !(governanceState.owners ?? {})[hash])
					),
					queryProposalSimpleVotes(
						apiProvider,
						keys.filter((hash) => !(governanceState.proposalSimpleVotes ?? {})[hash])
					),
					queryProposalStates(
						apiProvider,
						keys.filter((hash) => !(governanceState.proposalStates ?? {})[hash])
					),
					queryProposals(
						apiProvider,
						keys.filter((hash) => !(governanceState.proposals ?? {})[hash])
					),
					queryProposalVoters(
						apiProvider,
						keys.filter((hash) => !(governanceState.proposalVoters ?? {})[hash])
					),
					queryProposalApprovers(
						apiProvider,
						keys.filter((hash) => !(governanceState.proposalApprovers ?? {})[hash])
					),
					queryProposalDeniers(
						apiProvider,
						keys.filter((hash) => !(governanceState.proposalDeniers ?? {})[hash])
					),
					queryProposalVotesByVoters(
						apiProvider,
						keys.filter((hash) => !(governanceState.proposalVotesByVoters ?? {})[hash])
					),
				])

				setIsDataLoading(false)
				if (isMountedRef) {
					setState({
						campaignBalanceUsed: {
							...(governanceState.campaignBalanceUsed ?? {}),
							...(data[0] ?? {}),
						},
						metadata: {
							...(governanceState.metadata ?? {}),
							...(data[1] ?? {}),
						},
						owners: {
							...(governanceState.owners ?? {}),
							...(data[2] ?? {}),
						},
						proposalSimpleVotes: {
							...(governanceState.proposalSimpleVotes ?? {}),
							...(data[3] ?? {}),
						},
						proposalStates: {
							...(governanceState.proposalStates ?? {}),
							...(data[4] ?? {}),
						},
						proposals: {
							...(governanceState.proposals ?? {}),
							...(data[5] ?? {}),
						},
						proposalVoters: {
							...(governanceState.proposalVoters ?? {}),
							...(data[6] ?? {}),
						},
						proposalApprovers: {
							...(governanceState.proposalApprovers ?? {}),
							...(data[7] ?? {}),
						},
						proposalDeniers: {
							...(governanceState.proposalDeniers ?? {}),
							...(data[8] ?? {}),
						},
						proposalVotesByVoters: {
							...(governanceState.proposalVotesByVoters ?? {}),
							...(data[9] ?? {}),
						},
					})
				}
			})()
		}
	}, [governanceState.proposalsArray])

	return governanceState
}
