const UPDATE_IDENTITY = 'UPDATE_IDENTITY'

const shape = {
	identityState: {},
}

export function identityReducer(state = shape, action) {
	switch (action.type) {
		case UPDATE_IDENTITY:
			return {
				...state,
				identityState: { ...state.identityState, ...(action.payload || {}) },
			}
		default:
			break
	}

	return state
}

export function updateIdentityAction(payload) {
	return {
		type: UPDATE_IDENTITY,
		payload,
	}
}

export function identitySelector(state) {
	return state?.identity
}

export function identityStateSelector(state) {
	return identitySelector(state)?.identityState
}
