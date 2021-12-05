import { createSlice, PayloadAction } from '@reduxjs/toolkit'


const shape = {
	governanceState: {},
}

export const slice = createSlice({
  name: 'governance',
  initialState: shape,
  reducers: {
    updateGovernance: (state, action) => {
      state.governanceState = action.payload
    },
  },
})

export function updateGovernanceAction(payload) {
	return slice.actions.updateGovernance(payload)
}

export function governanceSelector(state) {
	return state?.governance
}

export function governanceStateSelector(state) {
	return governanceSelector(state)?.governanceState
}


export const { updateGovernance } = slice.actions  
export const reducer = slice.reducer
export default slice