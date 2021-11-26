const UPDATE_DAO_CONTROL = 'UPDATE_DAO_CONTROL'
const ADD_DAO_CONTROL_MEMBER_STATE = 'ADD_DAO_CONTROL_MEMBER_STATE'
const CLEAR_DAO_CONTROL = 'CLEAR_DAO_CONTROL'

const shape = {
	gameDaoControlState: {},
	refresh: false,
}

export function gameDaoControlReducer(state = shape, action) {
	switch (action.type) {
		case UPDATE_DAO_CONTROL:
			return {
				...state,
				refresh: false,
				gameDaoControlState: {
					...state.gameDaoControlState,
					...(action.payload || {}),
				},
			}
		case ADD_DAO_CONTROL_MEMBER_STATE:
			return {
				...state,
				gameDaoControlState: {
					...state.gameDaoControlState,
					bodyMemberState: {
						...(state.gameDaoControlState?.bodyMemberState || {}),
						[action.payload?.hash]: {
							...((state.gameDaoControlState?.bodyMemberState ?? {})[
								action.payload?.hash
							] || {}),
							...(action.payload?.data || {}),
						},
					},
				},
			}
		case CLEAR_DAO_CONTROL: {
			return { ...shape, refresh: true }
		}
		default:
			break
	}

	return state
}

export function updateGameDaoControlAction(payload) {
	return {
		type: UPDATE_DAO_CONTROL,
		payload,
	}
}

export function addGameDaoControlMemberStateAction(hash, data) {
	return {
		type: ADD_DAO_CONTROL_MEMBER_STATE,
		payload: { hash, data },
	}
}

export function clearGameDaoControlAction() {
	return {
		type: CLEAR_DAO_CONTROL,
	}
}
export function gameDaoControlSelector(state) {
	return state?.gameDaoControl
}

export function gameDaoControlStateSelector(state) {
	return gameDaoControlSelector(state)?.gameDaoControlState
}

export function gameDaoControlRefreshSelector(state) {
	return gameDaoControlSelector(state)?.refresh
}
