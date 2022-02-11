import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { useWallet } from './Wallet'
import { decodeAddressAsString } from '../utils/helper'
import { useApiProvider } from '@substra-hooks/core'
import { createQuestNotification } from '../utils/notification'

interface QuestState {
	hasQuest1Completed: boolean;
	hasQuest2Completed: boolean;
	hasQuest3Completed: boolean;
	hasQuest4Completed: boolean;
	hasQuest5Completed: boolean;
	hasQuest6Completed: boolean;
	hasAllQuestsCompleted: boolean;
}

const INITIAL_VALUE: QuestState = {
	hasQuest1Completed: false,
	hasQuest2Completed: false,
	hasQuest3Completed: false,
	hasQuest4Completed: false,
	hasQuest5Completed: false,
	hasQuest6Completed: false,
	hasAllQuestsCompleted: false,
}
const QuestContext = createContext<QuestState>(INITIAL_VALUE)

// Handle quests
function handleQuests(state: QuestState, apiProvider, address, updateQuestState) {
	if (!state.hasQuest1Completed) {
		checkFirstQuest(apiProvider, address, updateQuestState)
	}

	if (!state.hasQuest2Completed) {
		checkSecondQuest(apiProvider, address, updateQuestState)
	}

	if (!state.hasQuest3Completed) {
		checkThirdQuest(apiProvider, address, updateQuestState)
	}

	if (!state.hasQuest4Completed) {
		checkFourthQuest(apiProvider, address, updateQuestState)
	}

	if (!state.hasQuest5Completed) {
		checkFifthQuest(apiProvider, address, updateQuestState)
	}

	if (!state.hasQuest6Completed) {
		checkSixthQuest(apiProvider, address, updateQuestState)
	}

	if (!state.hasAllQuestsCompleted
		&& state.hasQuest1Completed
		&& state.hasQuest2Completed
		&& state.hasQuest3Completed
		&& state.hasQuest4Completed
		&& state.hasQuest5Completed
		&& state.hasQuest6Completed
	) {
		updateQuestState({ hasAllQuestsCompleted: true })
		createQuestNotification('Congratulations: 🎉🎉🎉 You have mastered all quests 🎉🎉🎉')
	}
}

// Quest 1
// Connected wallet has more than 0 Zero token
async function checkFirstQuest(apiProvider, address, updateQuestState) {
	try {
		const task = await apiProvider.query.system.account(address)
		if (task.toHuman().data.free?.split(' ')[0] > 0) {
			updateQuestState({ hasQuest1Completed: true })
			createQuestNotification('You have successfully completed the first quest more information can be found on the quest site')
		}
	} catch (e) {
		return
	}
}

// Quest 2
// Connected wallet has an dao created
async function checkSecondQuest(apiProvider, address, updateQuestState) {
	try {
		const task = await apiProvider.query.gameDaoControl.controlledBodiesCount(address)
		if (task.toNumber() > 0) {
			updateQuestState({ hasQuest2Completed: true })
			createQuestNotification('You have successfully completed the second quest more information can be found on the quest site')
		}
	} catch (e) {
		return
	}
}

// Quest 3
// An owned dao has more than 2 members
async function checkThirdQuest(apiProvider, address, updateQuestState) {
	try {
		const daoList = await apiProvider.query.gameDaoControl.controlledBodies(address)
		let taskCompleted = false
		for (let dao of daoList.toHuman()) {
			const daoMemberCount = await apiProvider.query.gameDaoControl.bodyMemberCount(dao)
			if (daoMemberCount.toNumber() > 2) {
				taskCompleted = true
				break
			}
		}
		if (taskCompleted) {
			updateQuestState({ hasQuest3Completed: true })
			createQuestNotification('You have successfully completed the third quest more information can be found on the quest site')
		}
	} catch (e) {
		return
	}
}

// Quest 4
// Connected wallet has created a campaign
async function checkFourthQuest(apiProvider, address, updateQuestState) {
	try {
		const task = await apiProvider.query.gameDaoCrowdfunding.campaignsOwnedCount(address)
		if (task.toNumber() > 0) {
			updateQuestState({ hasQuest4Completed: true })
			createQuestNotification('You have successfully completed the fourth quest more information can be found on the quest site')
		}
	} catch (e) {
		return
	}
}

// Quest 5
// TODO: get all owned campaign and solve quest
// An owned campaign ist fully funded
async function checkFifthQuest(apiProvider, address, updateQuestState) {
	return
	try {
		const campaignList = await apiProvider.query.gameDaoCrowdfunding.campaignsOwnedCount(address)
		const task = await apiProvider.query.gameDaoCrowdfunding.campaignsOwnedCount(address)
		if (task.toNumber() > 0) {
			updateQuestState({ hasQuest5Completed: true })
			createQuestNotification('You have successfully completed the fifth quest more information can be found on the quest site')
		}
	} catch (e) {
		return
	}
}

// Quest 6
// Connected wallet has created a proposal
async function checkSixthQuest(apiProvider, address, updateQuestState) {
	try {
		const task = await apiProvider.query.gameDaoGovernance.proposalsByOwnerCount(address)
		if (task.toNumber() > 0) {
			updateQuestState({ hasQuest6Completed: true })
			createQuestNotification('You have successfully completed the sixth quest more information can be found on the quest site')
		}
	} catch (e) {
		return
	}
}

export function QuestProvider({ children }) {
	const [state, setState] = useState<QuestState>(INITIAL_VALUE)
	const [localStoreState, setLocalStoreState] = useState<any>(null)
	const { address } = useWallet()
	const apiProvider = useApiProvider()
	const intervalRef = useRef<any>(0)

	const updateQuestState = useCallback((obj) => {
		const newState = { ...state, ...obj }
		let storeData = {}
		const rawAddress = decodeAddressAsString(address)
		const localStorageState = localStorage.getItem('STORE_QUEST_STATE')
		if (localStorageState) {
			storeData = JSON.parse(localStorageState)
		}
		storeData[rawAddress] = newState
		localStorage.setItem('STORE_QUEST_STATE', JSON.stringify(storeData))
		setState(newState)
	}, [state, setState, address])

	useEffect(() => {
		// Load old questState from store
		try {
			const localStorageState = localStorage.getItem('STORE_QUEST_STATE')
			setLocalStoreState(JSON.parse(localStorageState))
		} catch (e) {
			return
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}

	}, [])

	useEffect(() => {
		if (address && localStoreState) {
			const rawAddress = decodeAddressAsString(address)
			if (localStoreState[rawAddress]) {
				setState(localStoreState[rawAddress])
			} else {
				setState(INITIAL_VALUE)
			}
		}
	}, [address, localStoreState])

	useEffect(() => {
		console.log('QUEST_STATE', 'Update')
		if (apiProvider && address && state) {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}

			intervalRef.current = setInterval(handleQuests, 10000, state, apiProvider, address, updateQuestState)
		}
	}, [apiProvider, address, state, updateQuestState])


	console.log('[QUEST_STATE]', state)
	return <QuestContext.Provider value={state}>{children}</QuestContext.Provider>
}
