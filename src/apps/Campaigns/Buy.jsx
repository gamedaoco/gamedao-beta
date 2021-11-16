import { Box, boxSizing } from '@mui/system'
import React, { useState } from 'react'
import { Modal, Button, Header, Typography, FormGroup } from '.'

const Buy = ({ content }) => {
	const { imageURL, title, description } = content

	const [formData, updateFormData] = useState({})
	const [open, setOpen] = useState(false)

	const handleOnChange = (e, { name, value }) => updateFormData({ ...formData, [name]: value })

	return (
		<Modal
			onClose={() => setOpen(false)}
			onOpen={() => setOpen(true)}
			open={open}
			trigger={<Button>Show Modal</Button>}
		>
			<Box>
				<Typography>Select a Photo</Typography>
				<Card>
					<Image size="medium" src="/images/avatar/large/rachel.png" wrapped />
					<Box>
						<Header>Contribute to Campaign</Header>
						<Typography>Description</Typography>
						<Typography>Disclaimer</Typography>
						<FormGroup>
							<input
								type="file"
								label="Logo Graphic"
								name="logo"
								onChange={onFileChange}
							/>
							<input
								type="file"
								label="Header Graphic"
								name="header"
								onChange={onFileChange}
							/>
						</FormGroup>
					</Box>
				</Card>
				<Box>
					<Button color="black" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button
						content="Confirm"
						labelPosition="right"
						icon="checkmark"
						onClick={() => setOpen(false)}
						positive
					/>
				</Box>
			</Box>
		</Modal>
	)
}

export default Buy
