import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { slice, blockStateSelector } from 'src/redux/block.slice'
import { useApiProvider } from '@substra-hooks/core'
import Typography from '@mui/material/Typography'

const NetInfo = () => {
	const apiProvider = useApiProvider()
	const [version, setVersion] = useState('')
	const [blockNumber, setBlockNumber] = useState(0)
	const [blockNumberTimer, setBlockNumberTimer] = useState(0)
	const dispatch = useDispatch()

	useEffect(() => {
		if (!apiProvider) return
		const versionString = `${apiProvider.runtimeVersion.implName.toString()} ${apiProvider.runtimeVersion.specVersion.toNumber()}.${apiProvider.runtimeVersion.implVersion.toNumber()}`
		setVersion(versionString)
	}, [apiProvider])

	useEffect(() => {
		if (!apiProvider) return
		let unsubscribeAll

		apiProvider.derive.chain
			.bestNumberFinalized((number) => {
				setBlockNumber(number.toNumber())
				dispatch(slice.actions.updateBlockheight(number.toNumber()))
				setBlockNumberTimer(0)
			})
			.then((unsub) => {
				unsubscribeAll = unsub
			})
			.catch(console.error)

		return () => unsubscribeAll && unsubscribeAll()
	}, [apiProvider])

	const timer = () => {
		setBlockNumberTimer((time) => time + 1)
	}

	useEffect(() => {
		const id = setInterval(timer, 1000)
		return () => clearInterval(id)
	}, [])

	if (!apiProvider || blockNumber === 0) return null

	return (
		<Typography sx={{ fontSize: '10px' }}>
			Network: {version && `ZERO ${version}`}
			<br />
			{blockNumber && `Blocktime ${blockNumber} / ${blockNumberTimer}s`}
		</Typography>
	)
}

export default NetInfo
