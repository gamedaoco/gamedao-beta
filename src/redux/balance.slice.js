import { createSlice, PayloadAction } from '@reduxjs/toolkit'


const shape = {
	balanceState: {},
}

export const slice = createSlice({
  name: 'balance',
  initialState: shape,
  reducers: {
    updateBalance: (state, action) => {
      return action.payload
    },
  },
})

export function updateBalanceAction(payload) {
	return slice.actions.updateBalance(payload)
}


export function balanceSelector(state) {
	return state?.balance
}

export function balanceStateSelector(state) {
	return balanceSelector(state)?.balanceState
}


export const { updateBalance } = slice.actions  
export const reducer = slice.reducer
export default slice