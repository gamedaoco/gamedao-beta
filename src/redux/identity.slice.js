import { createSlice, PayloadAction } from '@reduxjs/toolkit'


const shape = {
	identityState: {},
}

export const slice = createSlice({
  name: 'identity',
  initialState: shape,
  reducers: {
    updateIdentity: (state, action) => {
      Object.assign(state.identityState, action.payload)
    },
  },
})

export function updateIdentityAction(payload) {
	return slice.actions.updateIdentity(payload)
}


export function identitySelector(state) {
	return state?.identity
}

export function identityStateSelector(state) {
	return identitySelector(state)?.identityState
}



export const { updateIdentity } = slice.actions  
export const reducer = slice.reducer
export default slice