import React, { useEffect, useState } from 'react'
import { TxButton } from '../substrate-lib/components'
import { Box, Card  } from '.'
import { useApiProvider } from '@substra-hooks/core'
import { useWallet } from '../context/Wallet'

function Main(props) {
	const apiProvider = useApiProvider()
	const { account } = useWallet()

	const { finalized } = props

	// The transaction submission status
	const [status, setStatus] = useState('')

	const [nonce, updateNonce] = useState()
	const [block, setBlock] = useState()

	const [txData, setTxData] = useState({
		address: null,
		title: '',
		cap: 0,
		deposit: 0,
		duration: 0,
		protocol: 0,
		governance: 0,
		cid: '',
	})

	const bestBlock = finalized
		? apiProvider.derive.chain.bestNumberFinalized
		: apiProvider.derive.chain.bestNumber

	useEffect(() => {
		const data = {
			address: account.address,
			title: 'cool productname',
			cap: Math.round(Math.random() * 100000) + 1000000000000,
			deposit: Math.round(Math.random() * 10),
			duration: 1000000 + Math.round(Math.random() * 10) * 14400,
			protocol: Math.round(Math.random() * 5),
			governance: Math.round(Math.random() * 1),
			cid: 'cid',
		}

		// console.log('data',data)
		setTxData(data)
	}, [nonce, account])

	useEffect(() => {
		let unsubscribeAll = null

		bestBlock((number) => {
			setBlock(number.toNumber())
		})
			.then((unsub) => {
				unsubscribeAll = unsub
			})
			.catch(console.error)

		return () => unsubscribeAll && unsubscribeAll()
	}, [bestBlock])

	useEffect(() => {
		if (!apiProvider.query.gameDaoCrowdfunding.nonce) return
		let unsubscribe

		apiProvider.query.gameDaoCrowdfunding
			.nonce((n) => {
				if (n.isNone) {
					updateNonce('<None>')
				} else {
					updateNonce(n.toNumber())
				}
			})
			.then((unsub) => {
				unsubscribe = unsub
			})
			.catch(console.error)

		return () => unsubscribe && unsubscribe()
	}, [apiProvider.query.gameDaoCrowdfunding])

	return (
		<>
			<h1>Generate Campaign</h1>

			<Box>
				<Card centered>
					<Box textAlign="center">
						{nonce}
					</Box>
					<Box textAlign="center">
						{block}
					</Box>
				</Card>
			</Box>

			<form>
				<Box style={{ textAlign: 'center' }}>
					<TxButton
						label="Create Generic Campaign"
						type="SIGNED-TX"
						setStatus={setStatus}
						attrs={{
							palletRpc: 'gameDaoCrowdfunding',
							callable: 'create',
							inputParams: [
								txData.address,
								txData.title,
								txData.cap,
								txData.deposit,
								txData.duration,
								txData.protocol,
								txData.governance,
								txData.cid,
							],
							paramFields: [true, true, true, true, true, true, true, true],
						}}
					/>
				</Box>
				<div style={{ overflowWrap: 'break-word' }}>{status}</div>
			</form>
		</>
	)
}

export default function TemplateModule(props) {
	const apiProvider = useApiProvider()
	const { account } = useWallet()

	return apiProvider.query.gameDaoCrowdfunding && account ? <Main {...props} /> : null
}
