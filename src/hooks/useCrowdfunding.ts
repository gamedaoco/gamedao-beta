import { useApiProvider } from '@substra-hooks/core'
import { useEffect, useState } from 'react'
import { useIsMountedRef } from './useIsMountedRef'
import { to } from 'await-to-js'
import { createErrorNotification } from 'src/utils/notification'
import { ApiPromise } from '@polkadot/api'

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
	data.map((c) => c.toHuman()).forEach((c: any, i) => {
		mapping[hashes[i]] = c
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
	data.map((c) => c.toHuman()).forEach((c: any, i) => {
		mapping[hashes[i]] = c
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
	data.map((c) => c.toHuman()).forEach((c: any, i) => {
		mapping[hashes[i]] = c
	})

	return mapping
}

export const useCrowdfunding = () => {
	const [state, setState] = useState<CrowdfundingState>(INITIAL_STATE)
	const [lastCampaignsCount, setLastCampaignsCount] = useState<number>(null)
	const apiProvider = useApiProvider()
	const isMountedRef = useIsMountedRef()

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
				...state,
				campaigns: {
					...(state.campaigns ?? {}),
					...(data[0] ?? {}),
				},
				campaignBalance: {
					...(state.campaignBalance ?? {}),
					...(data[1] ?? {}),
				},
				campaignState: {
					...(state.campaignState ?? {}),
					...(data[2] ?? {}),
				},
				campaignContributorsCount: {
					...(state.campaignContributorsCount ?? {}),
					...(data[3] ?? {}),
				},
			})
		}
	}

	// Set updateCampaigns function to be more like our context
	useEffect(() => {
		setState({
			...state,
			updateCampaigns: handleUpdateCampaigns,
		})
	}, [])

	// Fetch campaignsCount
	useEffect(() => {
		if (apiProvider) {
			queryCampaignsCount(apiProvider).then((campaignsCount) => {
				if (isMountedRef) {
					setState({ ...state, campaignsCount: campaignsCount ?? 0 })
				}
			})
		}
	}, [apiProvider, isMountedRef])

	// Fetch new campaign hashes
	useEffect(() => {
		if (
			(state?.campaignsCount >= 0 && lastCampaignsCount) ??
			(0 !== state.campaignsCount && apiProvider)
		) {
			queryCampaignsHash(apiProvider, lastCampaignsCount ?? 0, state.campaignsCount).then(
				(opt) => {
					if (isMountedRef) {
						setState({
							...state,
							campaignsHash: {
								...(state.campaignsHash ?? {}),
								...(opt?.campaignsHash ?? {}),
							},
							campaignsIndex: {
								...(state.campaignsIndex ?? {}),
								...(opt?.campaignsIndex ?? {}),
							},
						})
					}
				}
			)
			setLastCampaignsCount(state.campaignsCount)
		}
	}, [state.campaignsCount])

	// Fetch campaigns and details
	useEffect(() => {
		const keys = Object.keys(state?.campaignsHash ?? {})
		if (apiProvider && keys.length > 0) {
			const newHashes = keys.filter((key) => !(state.campaigns ?? {})[key])

			;(async () => {
				const data = await Promise.all([
					queryCampaigns(apiProvider, newHashes),
					queryCampaignBalance(apiProvider, newHashes),
					queryCampaignState(apiProvider, newHashes),
					queryCampaignContributorsCount(apiProvider, newHashes),
				])

				if (isMountedRef) {
					setState({
						...state,
						campaigns: {
							...(state.campaigns ?? {}),
							...(data[0] ?? {}),
						},
						campaignBalance: {
							...(state.campaignBalance ?? {}),
							...(data[1] ?? {}),
						},
						campaignState: {
							...(state.campaignState ?? {}),
							...(data[2] ?? {}),
						},
						campaignContributorsCount: {
							...(state.campaignContributorsCount ?? {}),
							...(data[3] ?? {}),
						},
					})
				}
			})()
		}
	}, [state.campaignsHash])

	return state
}
