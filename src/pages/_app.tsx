import React, { useEffect, useContext, useState } from 'react'
import App from 'next/app'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
// import * as Fathom from 'fathom-client'

const Application = ({ Component, pageProps }) => {

	const router = useRouter()

	// useEffect(() => {
	// 	Fathom.load('XLUUAYWU', {
	// 		url: '//scorpion.gamedao.co/script.js',
	// 	})
	// 	function onRouteChangeComplete() {
	// 		Fathom.trackPageview()
	// 	}
	// 	router.events.on('routeChangeComplete', onRouteChangeComplete)
	// 	return () => {
	// 		router.events.off('routeChangeComplete', onRouteChangeComplete)
	// 	}
	// }, [])

	return (
		<Component {...pageProps} />
	)
}

export default Application
