import { IsObject } from '@react-three/drei'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const shape = {
	gameDaoControlState: {},
	refresh: false,
}

export const slice = createSlice({
	name: 'control',
	initialState: shape,
	reducers: {
		updateDaoControl: (state, action) => {
			state.refresh = false
			Object.assign(state.gameDaoControlState ?? {}, action.payload ?? {})
		},
		addDaoControlMemberState: (state, action) => {
			if(!state.gameDaoControlState.bodyMemberState){
				state.gameDaoControlState.bodyMemberState = {}
			}
			const memberState = state.gameDaoControlState.bodyMemberState
			const target = memberState[action.payload?.hash] ?? {}
			memberState[action.payload?.hash] = Object.assign(target, action.payload.data ?? {})
			Object.assign(state.gameDaoControlState, { bodyMemberState: memberState })
		},
		clearDaoControl: (state, action) => {
			return Object.assign({}, shape, { refresh: true })
		},
	},
})

export function updateGameDaoControlAction(payload) {
	return slice.actions.updateDaoControl(payload)
}

export function addGameDaoControlMemberStateAction(hash, data) {
	return slice.actions.addDaoControlMemberState({ hash, data })
}

export function clearGameDaoControlAction(payload) {
	return slice.actions.clearDaoControl(payload)
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
export const { updateDaoControl, clearDaoControl, addDaoControlMemberState } = slice.actions
export const reducer = slice.reducer
export default slice
