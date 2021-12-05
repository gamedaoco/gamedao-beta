import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// uhttps://redux-toolkit.js.org/usage/immer-reducers

const shape = {
	crowdfundingState: {},
}

export const slice = createSlice({
  name: 'crowdfunding',
  initialState: shape,
  reducers: {
    updateCrowdfunding: (state, action) => {
      return { crowdfundingState: action.payload }
    },
  },
})

export function updateCrowdfundingAction(payload) {
	return slice.actions.updateCrowdfunding(payload)
}


export function crowdfundingSelector(state) {
	return state?.crowdfunding
}

export function crowdfundingStateSelector(state) {
	return crowdfundingSelector(state)?.crowdfundingState
}


export const { updateCrowdfunding } = slice.actions  
export const reducer = slice.reducer
export default slice