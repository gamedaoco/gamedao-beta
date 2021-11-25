import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import Providers from './Providers'

import 'react-toastify/dist/ReactToastify.css'
import rootReducer from './redux/rootReducer'
import { createStore, compose } from 'redux'
import { Provider } from 'react-redux'

const storeEnhancers =
	(typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
	compose

// Initialize store
const store = createStore(rootReducer, storeEnhancers())

const Root = () => (
	<Provider store={store}>
		<Providers>
			<App />
		</Providers>
	</Provider>
)

ReactDOM.render(<Root />, document.getElementById('root'))
