import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import Providers from './Providers'

import 'react-toastify/dist/ReactToastify.css'
import { createStore } from './redux/store'
import { Provider } from 'react-redux'

const Root = () => (
	<Provider store={createStore()}>
		<Providers>
			<App />
		</Providers>
	</Provider>
)

ReactDOM.render(<Root />, document.getElementById('root'))
