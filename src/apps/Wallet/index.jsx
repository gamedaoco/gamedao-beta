import React, { useEffect, useState, lazy, Suspense } from 'react'
import { useSubstrate } from '../../substrate-lib'
import { useWallet } from 'src/context/Wallet'

import { Grid, Button, Modal } from 'semantic-ui-react'

const Component = (props) => {
	const { address, accountPair } = useWallet()
	const { api } = useSubstrate()

	const [bodies, setBodies] = useState(0)
	const [campaigns, setCampaigns] = useState(0)
	const [proposals, setProposals] = useState(0)
	const [tangram, setTangram] = useState(0)

	useEffect(() => {
		let unsubscribe = null

		api.queryMulti(
			[
				api.query.gameDaoControl.nonce,
				api.query.gameDaoCrowdfunding.nonce,
				api.query.gameDaoGovernance.nonce,
				// api.query.gameDaoTangram.nextTangramId
			],
			([bodies, campaigns, proposals, creatures]) => {
				setBodies(bodies.toNumber())
				setCampaigns(campaigns.toNumber())
				setProposals(proposals.toNumber())
				// setTangram(tangram.toNumber())
			}
		)
			.then((unsub) => {
				unsubscribe = unsub
			})
			.catch(console.error)

		return () => unsubscribe && unsubscribe()
	}, [api])

	return (
		<Grid.Column width={16}>
			<h1>Wallet</h1>
		</Grid.Column>
	)
}

const Disclaimer = ({ open, setOpen }) => (
	<Modal basic onClose={() => setOpen(false)} open={open} size="small" closeOnEscape={true} closeOnDimmerClick={false}>
		<Modal.Header>How it works</Modal.Header>
		<Modal.Content>
			GameDAO is built on zero network powered by{' '}
			<a href="substrate.dev" target="_blank">
				substrate
			</a>
			. To use it, you will need a running PolkadotJS Extension in your browser:{' '}
			<a href="https://polkadot.js.org/extension/" target="_blank">
				https://polkadot.js.org/extension/
			</a>{' '}
			as well as an address created inside of it. Furthermore you will need test token to do any transactions. We are running a faucet on our{' '}
			<a href="https://discord.gg/UJS4N85ukS" target="_blank">
				Discord Server
			</a>
			. Please join and say hello!
		</Modal.Content>
		<Modal.Actions>
			<Button color="green" inverted onClick={() => setOpen(false)}>
				I understand
			</Button>
		</Modal.Actions>
	</Modal>
)

const Intro = (props) => {
	const [open, setOpen] = useState(true)
	return <Disclaimer open={open} setOpen={setOpen} />
}

export default function Dapp(props) {
	const { accountPair } = useWallet()
	const { api } = useSubstrate()

	return api && accountPair ? <Component /> : <Intro />
}

//
//
//
