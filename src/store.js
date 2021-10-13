import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query'

// import { api } from './features/api/apiSlice'


// logger middleware
const logger = store => next => action => {

  if(typeof action === "function"){
    console.group("dispatch", action.name)
    const start = performance.now()
    let result = next(action)
    const end = performance.now()
    console.log(parseFloat((end-start).toFixed(4)), "ms")
    console.groupEnd()
    return result
  }

  if(action.constructor === Promise){
    console.group("dispatch", action.constructor.name)
    const start = performance.now()
    let result = next(action)
    const end = performance.now()
    console.log(parseFloat((end-start).toFixed(4)), "ms")
    console.groupEnd()
    return result
  }

  // object are the default action
  console.group('dispatch '+action.type)
  console.info(action)
  const start = performance.now()
  let result = next(action)
  const end = performance.now()
  console.log('next state', store.getState())
  console.log(parseFloat((end-start).toFixed(4)), "ms")
  console.groupEnd()
  return result
}


export const store = configureStore({
  reducer: {
    // [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    const defaultMiddleware = getDefaultMiddleware({
      serializableCheck: false,
    })
    return defaultMiddleware.concat([api.middleware, logger])
  }
});
