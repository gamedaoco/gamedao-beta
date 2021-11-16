import React, { useState } from 'react'
import { Box } from '.'
import { TxButton } from '../substrate-lib/components'

export default function Main(props) {
	const [status, setStatus] = useState('')
	const [proposal, setProposal] = useState({})

	const bufferToHex = (buffer) => {
		return Array.from(new Uint8Array(buffer))
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('')
	}

	const handleFileChosen = (file) => {
		const fileReader = new FileReader()
		fileReader.onloadend = (e) => {
			const content = bufferToHex(fileReader.result)
			setProposal(`0x${content}`)
		}

		fileReader.readAsArrayBuffer(file)
	}

	return (
		<>
			<h1>Upgrade Runtime</h1>
			<form>
				<Box>
					<input
						type="file"
						id="file"
						label="Wasm File"
						accept=".wasm"
						onChange={(e) => handleFileChosen(e.target.files[0])}
					/>
				</Box>
				<Box style={{ textAlign: 'center' }}>
					<TxButton
						label="Upgrade"
						type="UNCHECKED-SUDO-TX"
						setStatus={setStatus}
						attrs={{
							palletRpc: 'system',
							callable: 'setCode',
							inputParams: [proposal],
							paramFields: [true],
						}}
					/>
				</Box>
				<div style={{ overflowWrap: 'break-word' }}>{status}</div>
			</form>
		</>
	)
}
