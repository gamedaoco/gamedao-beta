//imports needed for this function
const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data')

export const testAuthentication = () => {
	const url = `https://api.pinata.cloud/data/testAuthentication`
	return axios
		.get(url, {
			headers: {
				pinata_api_key: 'your pinata api key',
				pinata_secret_api_key: 'your pinata secret api key'
			}
		})
		.then(function (response) {
			//handle your response here
		})
		.catch(function (error) {
			//handle error here
		})
}

export const pinFileToIPFS = (pinataApiKey, pinataSecretApiKey) => {
	const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`

	//we gather a local file for this example, but any valid readStream source will work here.
	let data = new FormData()
	data.append('file', fs.createReadStream('./yourfile.png'))

	//You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
	//metadata is optional
	const metadata = JSON.stringify({
		name: 'testname',
		keyvalues: {
			exampleKey: 'exampleValue'
		}
	})
	data.append('pinataMetadata', metadata)

	//pinataOptions are optional
	const pinataOptions = JSON.stringify({
		cidVersion: 0,
		customPinPolicy: {
			regions: [
				{
					id: 'FRA1',
					desiredReplicationCount: 1
				},
				{
					id: 'NYC1',
					desiredReplicationCount: 2
				}
			]
		}
	})
	data.append('pinataOptions', pinataOptions)

	return axios
		.post(url, data, {
			maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
			headers: {
				'Content-Type': `multipart/form-data boundary=${data._boundary}`,
				pinata_api_key: pinataApiKey,
				pinata_secret_api_key: pinataSecretApiKey
			}
		})
		.then(function (response) {
			//handle response here
		})
		.catch(function (error) {
			//handle error here
		})
}

export const pinJSONToIPFS = (pinataApiKey, pinataSecretApiKey, JSONBody) => {
	const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`
	return axios
		.post(url, JSONBody, {
			headers: {
				pinata_api_key: pinataApiKey,
				pinata_secret_api_key: pinataSecretApiKey
			}
		})
		.then(function (response) {
			//handle response here
		})
		.catch(function (error) {
			//handle error here
		})
}

