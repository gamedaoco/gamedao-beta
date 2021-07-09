import configCommon from './common.json'

// const configEnv = require(`./${process.env.NODE_ENV}.json`)
const configEnv = require('./production.json')

const types = require('./types.json')

const envVarNames = [
	'REACT_APP_PROVIDER_SOCKET',
	'REACT_APP_DEVELOPMENT_KEYRING',
]

const envVars = envVarNames.reduce((mem, n) => {
	if (process.env[n] !== undefined) mem[n.slice(10)] = process.env[n]
	return mem
}, {})


const config = {
	...configCommon,
	...configEnv,
	...envVars,
	types,
	dev: ( process.env.NODE_ENV==='production' ) ? false : true
}

export default config
