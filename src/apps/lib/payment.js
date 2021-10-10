// payment sdk
//
// as we currently do not have a direct pool for FIAT to PLAY,
// we will use ramp network to accept DOT and DAI
// the actual balance will be credited through our payment ocw

import RampInstantSDK from '@ramp-network/ramp-instant-sdk'

const paymentAPI = new RampInstantSDK({
	hostAppName: 'gamedao',
	hostLogoUrl: 'https://demo.gamedao.co/assets/favicon.png',
	hostApiKey: process.env.STAGING,
	variant: 'auto',
})

// payment currently is a manual process:
// user charges their DOT/DAI wallet and initiates a
// payment to the ZERO account.
// ZERO will credit the user inside the network.

const requestPayment = null

// on('*', event => console.log(event)).show();

// swapAmount: '150000000000000000000', // 150 ETH in wei
// swapAsset: 'DOT',
// userAddress: '3RKAStmAMJ3kg2m62eKPV425eQ3j1PiV47c2qAiFuErSeyy1',

function payNow() {
	paymentAPI().show()
}
