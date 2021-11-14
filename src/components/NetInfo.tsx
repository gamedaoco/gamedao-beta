import React, { useState, useEffect } from 'react'
import { useSubstrate } from '../substrate-lib'
import Typography from '@mui/material/Typography'

const NetInfo = () => {
	const { api, apiState } = useSubstrate()
	const [version, setVersion] = useState('')
	const [blockNumber, setBlockNumber] = useState(0)
	const [blockNumberTimer, setBlockNumberTimer] = useState(0)
	// const [bestNumber, setBestNumber] = useState()

	useEffect(() => {
		if (apiState !== 'READY' || !api) return
		const versionString = `${api.runtimeVersion.implName.toString()} ${api.runtimeVersion.specVersion.toNumber()}.${api.runtimeVersion.implVersion.toNumber()}`
		setVersion(versionString)
	}, [api, apiState])

	useEffect(() => {
		if (apiState !== 'READY' || !api) return
		let unsubscribeAll

		api.derive.chain
			.bestNumberFinalized((number) => {
				setBlockNumber(number.toNumber())
				setBlockNumberTimer(0)
			})
			.then((unsub) => {
				unsubscribeAll = unsub
			})
			.catch(console.error)

		return () => unsubscribeAll && unsubscribeAll()
	}, [api, apiState])

	const timer = () => {
		setBlockNumberTimer((time) => time + 1)
	}

	useEffect(() => {
		const id = setInterval(timer, 1000)
		return () => clearInterval(id)
	}, [])

	if (!api || blockNumber === 0) return null

	return (
		<Typography variant="caption">
			{version && `Network ${version}`}
			<br />
			{blockNumber && `Blocktime ${blockNumber} / ${blockNumberTimer}s`}
		</Typography>
	)
}

export default NetInfo
