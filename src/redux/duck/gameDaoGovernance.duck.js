const UPDATE_GOVERNANCE = 'UPDATE_GOVERNANCE'

const shape = {
	governanceState: {},
}

export function governanceReducer(state = shape, action) {
	switch (action.type) {
		case UPDATE_GOVERNANCE:
			return {
				...state,
				governanceState: { ...state.governanceState, ...(action.payload || {}) },
			}
		default:
			break
	}

	return state
}

export function updateGovernanceAction(payload) {
	return {
		type: UPDATE_GOVERNANCE,
		payload,
	}
}

export function governanceSelector(state) {
	return state?.governance
}

export function governanceStateSelector(state) {
	return governanceSelector(state)?.governanceState
}
