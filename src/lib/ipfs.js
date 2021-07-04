import axios from 'axios'
import fs from 'fs'
import FormData from 'form-data'
import config from '../config'


export const testAuthentication = () => {

	return axios
		.get(url, {
			headers: {
				pinata_api_key: config.PINATA_KEY,
				pinata_secret_api_key: config.PINATA_SECRET
			}
		})
		.then(function (response) {
			//handle your response here
		})
		.catch(function (error) {
			//handle error here
		})

}

export const pinFileToIPFS = ( file, name ) => {

	// we gather a local file for this example, but any valid readStream source will work here.
	// let data = new FormData()
	// data.append('file', fs.createReadStream('./yourfile.png'))

	// You'll need to make sure that the metadata is in the form
	// of a JSON object that's been convered to a string
	// metadata is optional
	// const metadata = JSON.stringify({
	// 	name,
		// keyvalues: {
		// 	exampleKey: 'exampleValue'
		// }
	// })
	// data.append('pinataMetadata', metadata)

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

export const pinJSONToIPFS = ( JSONBody ) => {

	const url = `${config.PINATA_URL}/data/testAuthentication`
	const key = config.PINATA_KEY
	const secret = config.PINATA_SECRET

	return axios
		.post(
			url,
			JSONBody, {
				headers: {
					pinata_api_key: key,
					pinata_secret_api_key: secret
				}
			}
		).then(function (response) {
			//handle response here
		}).catch(function (error) {
			//handle error here
		})
}

