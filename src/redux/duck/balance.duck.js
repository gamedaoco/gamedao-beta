const UPDATE_BALANCE = 'UPDATE_BALANCE'

const shape = {
	balanceState: {},
}

export function balanceReducer(state = shape, action) {
	switch (action.type) {
		case UPDATE_BALANCE:
			return {
				...state,
				balanceState: { ...state.balanceState, ...(action.payload || {}) },
			}
		default:
			break
	}

	return state
}

export function updateBalanceAction(payload) {
	return {
		type: UPDATE_BALANCE,
		payload,
	}
}

export function balanceSelector(state) {
	return state?.balance
}

export function balanceStateSelector(state) {
	return balanceSelector(state)?.balanceState
}
