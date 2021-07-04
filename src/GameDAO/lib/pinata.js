//
//	pinata
//

import pinataSDK from '@pinata/sdk'

const PINATA_URL = 'https://api.pinata.cloud'
const PINATA_KEY = '081b38620bdf248aae60'
const PINATA_SECRET = 'de5a54067a0840dff9d3528b8bc11d444ad4850229057b7d25c63a586f6df92d'

const pinata = pinataSDK( PINATA_KEY, PINATA_SECRET )

// auth test
pinata.testAuthentication().then((result) => {
	console.log(result);
}).catch((err) => {
	console.log(err);
})

// pinJSONToIPFS(PINATA_URL,PINATA_KEY,PINATA_SECRET,{ id: 0, name: 'joe' })
