const UPDATE_XP = 'UPDATE_XP'
const UPDATE_REP = 'UPDATE_REP'
const UPDATE_TRUST = 'UPDATE_TRUST'

type ActionTypes = typeof UPDATE_XP | UPDATE_REP | UPDATE_TRUST

type SenseState {
	XP: number
	REP: number
	TRUST: number
}

const intitialState: SenseState = {
	XP: 0,
	REP: 0,
	TRUST: 0,
}

export function senseReducer( state = intitialState, action ) {

	switch (action.type) {
		case UPDATE_XP:
			return { ...state, XP: action.payload }
			break;
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

export function senseSelector(state) {
	return state?.balance
}

export function senseStateSelector(state) {
	return senseSelector(state)?.balanceState
}
