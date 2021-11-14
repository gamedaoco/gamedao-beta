import React, { useState } from 'react'
import { useWallet } from 'src/context/Wallet'
import { web3FromSource } from '@polkadot/extension-dapp'
import { encodeAddress } from '@polkadot/util-crypto'
import { Button, Header, Text, Image, Modal, Form } from 'semantic-ui-react'

const Buy = ({ accountPair, content }) => {
	const { imageURL, title, description } = content

	const [formData, updateFormData] = useState({})
	const [open, setOpen] = useState(false)

	const handleOnChange = (e, { name, value }) => updateFormData({ ...formData, [name]: value })

	return (
		<Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} trigger={<Button>Show Modal</Button>}>
			<Modal.Header>Select a Photo</Modal.Header>
			<Modal.Content image>
				<Image size="medium" src="/images/avatar/large/rachel.png" wrapped />
				<Modal.Description>
					<Header>Contribute to Campaign</Header>
					<Text>Description</Text>
					<Text>Disclaimer</Text>
					<Form.Group widths="equal">
						<Form.Input type="file" label="Logo Graphic" name="logo" onChange={onFileChange} />
						<Form.Input type="file" label="Header Graphic" name="header" onChange={onFileChange} />
					</Form.Group>
				</Modal.Description>
			</Modal.Content>
			<Modal.Actions>
				<Button color="black" onClick={() => setOpen(false)}>
					Cancel
				</Button>
				<Button content="Confirm" labelPosition="right" icon="checkmark" onClick={() => setOpen(false)} positive />
			</Modal.Actions>
		</Modal>
	)
}

export default Buy
