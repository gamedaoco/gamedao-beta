import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import Providers from './Providers'

// TODO: remove when all semantic deps are gone
import 'semantic-ui-css/semantic.min.css'
import 'react-toastify/dist/ReactToastify.css'

const Root = () => (
	<Providers>
		<App />
	</Providers>
)

ReactDOM.render(<Root />, document.getElementById('root'))
