const UPDATE_CROWDFUNDING = 'UPDATE_CROWDFUNDING'

const shape = {
	crowdfundingState: {},
}

export function crowdfundingReducer(state = shape, action) {
	switch (action.type) {
		case UPDATE_CROWDFUNDING:
			return {
				...state,
				crowdfundingState: { ...state.crowdfundingState, ...(action.payload || {}) },
			}
		default:
			break
	}

	return state
}

export function updateCrowdfundingAction(payload) {
	return {
		type: UPDATE_CROWDFUNDING,
		payload,
	}
}

export function crowdfundingSelector(state) {
	return state?.crowdfunding
}

export function crowdfundingStateSelector(state) {
	return crowdfundingSelector(state)?.crowdfundingState
}
