import { useApiProvider } from '@substra-hooks/core'
import { useEffect, useState } from 'react'
import { useIsMountedRef } from './useIsMountedRef'
import { to } from 'await-to-js'
import { createErrorNotification } from 'src/utils/notification'
import { ApiPromise } from '@polkadot/api'
import { useDispatch, useSelector } from 'react-redux'
import {
	crowdfundingStateSelector,
	updateCrowdfundingAction,
} from 'src/redux/duck/crowdfunding.duck'

// Todo: Logic for subscribing to changes
// Todo: Max initial load. Currently all are loaded

type CrowdfundingState = {
	campaignsCount: number
	campaignsHash: object // Mapping from hash to id
	campaignsIndex: object // Mapping from id to has. Important for the sort (index)
	campaigns: object
	campaignBalance: object
	campaignState: object
	campaignContributorsCount: object
	updateCampaigns: (hashes: Array<string>) => void
}

const INITIAL_STATE: CrowdfundingState = {
	campaignsCount: null,
	campaignsHash: null,
	campaignsIndex: null,
	campaigns: null,
	campaignBalance: null,
	campaignState: null,
	campaignContributorsCount: null,
	updateCampaigns: () => {},
}

async function queryCampaignsCount(apiProvider: ApiPromise): Promise<number> {
	const [error, data] = await to(apiProvider.query.gameDaoCrowdfunding.campaignsCount())
	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoCrowdfunding campaignsCount')
		return null
	}

	return (data as any)?.toNumber() ?? 0
}

async function queryCampaignsHash(
	apiProvider: ApiPromise,
	lastCount: number,
	campaignsCount: number
): Promise<any> {
	const [error, data] = await to(
		apiProvider.query.gameDaoCrowdfunding.campaignsArray.multi(
			[...new Array(campaignsCount - lastCount)].map((_, i) => i + lastCount)
		)
	)

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoCrowdfunding campaignsArray')
		return null
	}

	// Create a mapping from id->hash and hash->id
	const campaignsHash = {}
	const campaignsIndex = {}

	data.map((hash) => hash.toHuman()).forEach((hash: any, i) => {
		campaignsHash[hash] = i
		campaignsIndex[i] = hash
	})

	return {
		campaignsHash,
		campaignsIndex,
	}
}

async function queryCampaigns(apiProvider: ApiPromise, hashes: any): Promise<object> {
	if (!Array.isArray(hashes) || hashes.length === 0) return null

	const [error, data] = await to(apiProvider.query.gameDaoCrowdfunding.campaigns.multi(hashes))

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoCrowdfunding campaigns')
		return null
	}

	const mapping = {}
	data.map((c) => c.toHuman()).forEach((c: any) => {
		mapping[c.id] = c
	})

	return mapping
}

async function queryCampaignBalance(apiProvider: ApiPromise, hashes: any): Promise<object> {
	if (!Array.isArray(hashes) || hashes.length === 0) return null

	const [error, data] = await to(
		apiProvider.query.gameDaoCrowdfunding.campaignBalance.multi(hashes)
	)

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoCrowdfunding campaignBalance')
		return null
	}

	const mapping = {}
	const formatedData = data.map((c) => c.toHuman())
	hashes.forEach((hash: any, i) => {
		mapping[hash] = formatedData?.[i] ?? null
	})

	return mapping
}

async function queryCampaignState(apiProvider: ApiPromise, hashes: any): Promise<object> {
	if (!Array.isArray(hashes) || hashes.length === 0) return null

	const [error, data] = await to(
		apiProvider.query.gameDaoCrowdfunding.campaignState.multi(hashes)
	)

	if (error) {
		console.error(error)
		createErrorNotification('Error while querying the gameDaoCrowdfunding campaignState')
		return null
	}

	const mapping = {}
	const formatedData = data.map((c) => c.toHuman())
	hashes.forEach((hash: any, i) => {
		mapping[hash] = formatedData?.[i] ?? null
	})

	return mapping
}

async function queryCampaignContributorsCount(
	apiProvider: ApiPromise,
	hashes: any
): Promise<object> {
	if (!Array.isArray(hashes) || hashes.length === 0) return null

	const [error, data] = await to(
		apiProvider.query.gameDaoCrowdfunding.campaignContributorsCount.multi(hashes)
	)

	if (error) {
		console.error(error)
		createErrorNotification(
			'Error while querying the gameDaoCrowdfunding campaignContributorsCount'
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

export const useCrowdfunding = () => {
	const [lastCampaignsCount, setLastCampaignsCount] = useState<number>(null)
	const [isDataLoading, setIsDataLoading] = useState<boolean>(false)
	const crowdfundingState = useSelector(crowdfundingStateSelector)
	const dispatch = useDispatch()
	const apiProvider = useApiProvider()
	const isMountedRef = useIsMountedRef()

	function setState(data) {
		dispatch(updateCrowdfundingAction(data))
	}

	// Update campaigns by querying the blockchain
	const handleUpdateCampaigns = async (hashes: Array<string>) => {
		const data = await Promise.all([
			queryCampaigns(apiProvider, hashes),
			queryCampaignBalance(apiProvider, hashes),
			queryCampaignState(apiProvider, hashes),
			queryCampaignContributorsCount(apiProvider, hashes),
		])

		if (isMountedRef) {
			setState({
				campaigns: {
					...(crowdfundingState.campaigns ?? {}),
					...(data[0] ?? {}),
				},
				campaignBalance: {
					...(crowdfundingState.campaignBalance ?? {}),
					...(data[1] ?? {}),
				},
				campaignState: {
					...(crowdfundingState.campaignState ?? {}),
					...(data[2] ?? {}),
				},
				campaignContributorsCount: {
					...(crowdfundingState.campaignContributorsCount ?? {}),
					...(data[3] ?? {}),
				},
			})
		}
	}

	// Fetch campaignsCount
	useEffect(() => {
		if (apiProvider) {
			queryCampaignsCount(apiProvider).then((campaignsCount) => {
				if (isMountedRef) {
					setState({ campaignsCount: campaignsCount ?? 0 })
				}
			})
		}
	}, [apiProvider, isMountedRef])

	// Fetch new campaign hashes
	useEffect(() => {
		if (
			crowdfundingState?.campaignsCount >= 0 &&
			(lastCampaignsCount ?? 0 !== crowdfundingState.campaignsCount) &&
			apiProvider
		) {
			queryCampaignsHash(
				apiProvider,
				lastCampaignsCount ?? 0,
				crowdfundingState.campaignsCount
			).then((opt) => {
				if (isMountedRef) {
					setState({
						campaignsHash: {
							...(crowdfundingState.campaignsHash ?? {}),
							...(opt?.campaignsHash ?? {}),
						},
						campaignsIndex: {
							...(crowdfundingState.campaignsIndex ?? {}),
							...(opt?.campaignsIndex ?? {}),
						},
					})
				}
			})
			setLastCampaignsCount(crowdfundingState.campaignsCount)
		}
	}, [crowdfundingState.campaignsCount])

	// Fetch campaigns and details
	useEffect(() => {
		const keys = Object.keys(crowdfundingState?.campaignsHash ?? {})
		if (apiProvider && keys.length > 0 && !isDataLoading) {
			const newHashes = keys.filter((key) => !(crowdfundingState.campaigns ?? {})[key])
			setIsDataLoading(true)
			;(async () => {
				const data = await Promise.all([
					queryCampaigns(apiProvider, newHashes),
					queryCampaignBalance(apiProvider, newHashes),
					queryCampaignState(apiProvider, newHashes),
					queryCampaignContributorsCount(apiProvider, newHashes),
				])

				setIsDataLoading(false)

				if (isMountedRef) {
					setState({
						campaigns: {
							...(crowdfundingState.campaigns ?? {}),
							...(data[0] ?? {}),
						},
						campaignBalance: {
							...(crowdfundingState.campaignBalance ?? {}),
							...(data[1] ?? {}),
						},
						campaignState: {
							...(crowdfundingState.campaignState ?? {}),
							...(data[2] ?? {}),
						},
						campaignContributorsCount: {
							...(crowdfundingState.campaignContributorsCount ?? {}),
							...(data[3] ?? {}),
						},
					})
				}
			})()
		}
	}, [crowdfundingState.campaignsHash])

	return { ...crowdfundingState, updateCampaigns: handleUpdateCampaigns }
}
