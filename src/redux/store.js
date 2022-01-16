import { configureStore } from '@reduxjs/toolkit'
// import { reduxBatch } from '@manaflair/redux-batch'

import { balanceReducer } from './duck/balance.duck'
import { governanceReducer } from './duck/gameDaoGovernance.duck'
import { identityReducer } from './duck/identity.duck'
import { crowdfundingReducer } from './duck/crowdfunding.duck'
import { gameDaoControlReducer } from './duck/gameDaoControl.duck'
import { reducer as blockReducer } from './block.slice'

const rootReducer = {
	balance: balanceReducer,
	governance: governanceReducer,
	identity: identityReducer,
	crowdfunding: crowdfundingReducer,
	gameDaoControl: gameDaoControlReducer,
	block: blockReducer,
}

export const createStore = () =>
	configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }), //.concat(logger),
		devTools: process.env.NODE_ENV !== 'production',
		//preloadedState,
		//enhancers: [reduxBatch],
	})

// The store has been created with these options:
// - The slice reducers were automatically passed to combineReducers()
// - redux-thunk and redux-logger were added as middleware
// - The Redux DevTools Extension is disabled for production
// - The middleware, batch, and devtools enhancers were composed together

// logger middleware
const logger = (store) => (next) => (action) => {
	//console.log('dispatch '+action.type)
	console.info('dispatch', action)
	const start = performance.now()
	let result = next(action)
	const end = performance.now()
	//console.log('next state', store.getState())
	console.log(parseFloat((end - start).toFixed(4)), 'ms')
	//console.groupEnd()
	return result
}
