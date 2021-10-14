import React, { useEffect, useState } from 'react'
import faker from 'faker'
import { useSubstrate } from '../substrate-lib'
import { TxButton } from '../substrate-lib/components'
import { Form, Grid, Card, Statistic } from 'semantic-ui-react'

function Main(props) {
	const { api } = useSubstrate()
	const { accountPair } = props
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

	const bestBlock = finalized ? api.derive.chain.bestNumberFinalized : api.derive.chain.bestNumber

	useEffect(() => {
		const data = {
			address: accountPair.address,
			title: faker.commerce.productName(),
			cap: Math.round(Math.random() * 100000) + 1000000000000,
			deposit: Math.round(Math.random() * 10),
			duration: 1000000 + Math.round(Math.random() * 10) * 14400,
			protocol: Math.round(Math.random() * 5),
			governance: Math.round(Math.random() * 1),
			cid: 'cid',
		}

		// console.log('data',data)
		setTxData(data)
	}, [nonce, accountPair])

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
		if (!api.query.gameDaoCrowdfunding.nonce) return
		let unsubscribe

		api.query.gameDaoCrowdfunding
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
	}, [api.query.gameDaoCrowdfunding])

	return (
		<Grid.Column width={8}>
			<h1>Generate Campaign</h1>

			<Grid.Column>
				<Card centered>
					<Card.Content textAlign="center">
						<Statistic label="Nonce" value={nonce} />
					</Card.Content>
					<Card.Content textAlign="center">
						<Statistic label="Block" value={block} />
					</Card.Content>
				</Card>
			</Grid.Column>

			<Form>
				<Form.Field style={{ textAlign: 'center' }}>
					<TxButton
						accountPair={accountPair}
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
				</Form.Field>
				<div style={{ overflowWrap: 'break-word' }}>{status}</div>
			</Form>
		</Grid.Column>
	)
}

export default function TemplateModule(props) {
	const { api } = useSubstrate()
	const { accountPair } = props

	return api.query.gameDaoCrowdfunding && accountPair ? <Main {...props} /> : null
}
