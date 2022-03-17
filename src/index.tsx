import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from './redux/store'
import { Provider } from 'react-redux'
import App from './App'
import Providers from './Providers'

import '@google/model-viewer/dist/model-viewer.js'

import 'react-toastify/dist/ReactToastify.css'
import './themes/model-viewer.css'
import './themes/animation.css'

const Root = () => (
	<Provider store={createStore()}>
		<Providers>
			<App />
		</Providers>
	</Provider>
)

ReactDOM.render(<Root />, document.getElementById('root'))
