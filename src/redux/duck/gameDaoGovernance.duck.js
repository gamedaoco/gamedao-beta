const UPDATE_GOVERNANCE = 'UPDATE_GOVERNANCE'
const CLEAR_GOVERNANCE_CONTROL = 'CLEAR_GOVERNANCE_CONTROL'

const shape = {
	governanceState: {},
	refresh: false,
}

export function governanceReducer(state = shape, action) {
	switch (action.type) {
		case UPDATE_GOVERNANCE:
			return {
				...state,
				refresh: false,
				governanceState: { ...state.governanceState, ...(action.payload || {}) },
			}
		case CLEAR_GOVERNANCE_CONTROL: {
			return { ...shape, refresh: true }
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

export function clearGovernanceAction() {
	return {
		type: CLEAR_GOVERNANCE_CONTROL,
	}
}

export function governanceSelector(state) {
	return state?.governance
}

export function governanceStateSelector(state) {
	return governanceSelector(state)?.governanceState
}

export function governanceRefreshSelector(state) {
	return governanceSelector(state)?.refresh
}
