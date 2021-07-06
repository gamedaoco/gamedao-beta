import configCommon from './common.json'

const configEnv = require(`./${process.env.NODE_ENV}.json`)
// const configEnv = require('./production.json')

const types = require('./types.json')

const envVarNames = [
	'REACT_APP_PROVIDER_SOCKET',
	'REACT_APP_DEVELOPMENT_KEYRING',
	'REACT_APP_PINATA_URL',
	'REACT_APP_PINATA_KEY',
	'REACT_APP_PINATA_SECRET',
]

const envVars = envVarNames.reduce((mem, n) => {
	if (process.env[n] !== undefined) mem[n.slice(10)] = process.env[n]
	return mem
}, {})


const config = {
	...configCommon,
	...configEnv,
	...envVars,
	types
}

export default config
