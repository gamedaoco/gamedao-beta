import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import Providers from './Providers'

import 'react-toastify/dist/ReactToastify.css'

const Root = () => (
	<Providers>
		<App />
	</Providers>
)

ReactDOM.render(<Root />, document.getElementById('root'))
