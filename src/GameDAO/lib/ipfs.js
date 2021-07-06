//
//	ipfs abstraction
//

import config from '../../config'

import pinataSDK from '@pinata/sdk'

const PINATA_KEY = config.PINATA_KEY
const PINATA_SECRET = config.PINATA_SECRET

const API_URL = config.API_URL
const API_PROTOCOL = config.API_PROTOCOL
const API_PORT = config.API_PORT

const GATEWAY_URL = config.GATEWAY_URL
const GATEWAY_PROTOCOL = config.GATEWAY_PROTOCOL
const GATEWAY_PORT = config.GATEWAY_PORT

import { create } from 'ipfs-http-client'

const dev = ( process.env.NODE_ENV==='production' ) ? false : true

export const pinataGateway = `https://gateway.pinata.cloud/ipfs/`
export const infuraGateway = `https://ipfs.infura.io/ipfs/`
export const localGateway = `http://localhost:8080/ipfs/`

export const gateway = GATEWAY_PROTOCOL+"://"+GATEWAY_URL+(GATEWAY_PORT?':'+GATEWAY_PORT:'')+"/ipfs/" // localGateway

//
//	init ipfs client
//

const headers = (dev)
	? {}
	: {
		pinata_api_key: PINATA_KEY,
		pinata_secret_api_key: PINATA_SECRET
	}

export const ipfs = create({
	host: API_URL,
	port: API_PORT,
	protocol: API_PROTOCOL,
	headers,
	timeout: '2m'
})

//
//	pin json to ipfs and return cid
//

export const pinJSONToIPFS = async payload => {

	try {
		const cid = await ipfs.add( Buffer.from( JSON.stringify( payload ) ) )
		return cid.path
	} catch (error) {
		console.log(error)
	}

}

//
//	pin file to ipfs and return cid
//

export const pinFileToIPFS = async payload => {

	try {
		const cid = await ipfs.add( payload )
		return cid.path
	} catch (error) {
		console.log(error)
	}

}

//
//	get json from ipfs by cid
//

export const getJSON = async cid => {

	try {
		const payload = await ipfs.cat( cid )
		console.log(payload)
		return payload
	} catch (error) {
		console.log(error)
	}

}