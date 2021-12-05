import { createSlice, PayloadAction } from '@reduxjs/toolkit'


const initialState = {
  height: 0,
}

export const slice = createSlice({
  name: 'block',
  initialState,
  reducers: {
    setBlockheight: (state, action) => {
      state.height = action.payload
    },
  },
})

export function blockSelector(state) {
	return state?.block
}

export function blockStateSelector(state) {
	return blockSelector(state)?.height
}


export const { blockheight } = slice.actions  
export const reducer = slice.reducer
export default slice