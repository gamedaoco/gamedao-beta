import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Stack } from '../../components'
import { web3FromSource } from '@polkadot/extension-dapp'

import utils from '../utils'
import { useApiProvider } from '@substra-hooks/core'
import { useWallet } from '../../context/Wallet'

function TxButton({
	label,
	setStatus,
	color = 'blue',
	style = null,
	type = 'QUERY',
	attrs = null,
	disabled = false,
}) {
	// Hooks
	const apiProvider = useApiProvider()
	const [unsub, setUnsub] = useState(null)
	const [sudoKey, setSudoKey] = useState(null)
	const { account } = useWallet()

	const { palletRpc, callable, inputParams, paramFields } = attrs

	const isQuery = () => type === 'QUERY'
	const isSudo = () => type === 'SUDO-TX'
	const isUncheckedSudo = () => type === 'UNCHECKED-SUDO-TX'
	const isUnsigned = () => type === 'UNSIGNED-TX'
	const isSigned = () => type === 'SIGNED-TX'
	const isRpc = () => type === 'RPC'
	const isConstant = () => type === 'CONSTANT'

	const loadSudoKey = () => {
		;(async function () {
			if (!apiProvider || !apiProvider.query.sudo) {
				return
			}
			const sudoKey = await apiProvider.query.sudo.key()
			sudoKey.isEmpty ? setSudoKey(null) : setSudoKey(sudoKey.toString())
		})()
	}

	useEffect(loadSudoKey, [apiProvider])

	const getFromAcct = async () => {
		const {
			address,
			meta: { source, isInjected },
		} = account

		let fromAcct

		// signer is from Polkadot-js browser extension
		if (isInjected) {
			const injected = await web3FromSource(source)
			fromAcct = address
			apiProvider.setSigner(injected.signer)
		} else {
			fromAcct = account
		}

		return fromAcct
	}

	const txResHandler = ({ status }) =>
		status.isFinalized
			? setStatus(`😉 Finalized. Block hash: ${status.asFinalized.toString()}`)
			: setStatus(`Current transaction status: ${status.type}`)

	const txErrHandler = (err) => setStatus(`😞 Transaction Failed: ${err.toString()}`)

	const sudoTx = async () => {
		const fromAcct = await getFromAcct()
		const transformed = transformParams(paramFields, inputParams)
		// transformed can be empty parameters
		const txExecute = transformed
			? apiProvider.tx.sudo.sudo(apiProvider.tx[palletRpc][callable](...transformed))
			: apiProvider.tx.sudo.sudo(apiProvider.tx[palletRpc][callable]())

		const unsub = txExecute.signAndSend(fromAcct, txResHandler).catch(txErrHandler)
		setUnsub(() => unsub)
	}

	const uncheckedSudoTx = async () => {
		const fromAcct = await getFromAcct()
		const txExecute = apiProvider.tx.sudo.sudoUncheckedWeight(
			apiProvider.tx[palletRpc][callable](...inputParams),
			0
		)

		const unsub = txExecute.signAndSend(fromAcct, txResHandler).catch(txErrHandler)
		setUnsub(() => unsub)
	}

	const signedTx = async () => {
		const fromAcct = await getFromAcct()
		const transformed = transformParams(paramFields, inputParams)
		// transformed can be empty parameters

		const txExecute = transformed
			? apiProvider.tx[palletRpc][callable](...transformed)
			: apiProvider.tx[palletRpc][callable]()

		const unsub = await txExecute.signAndSend(fromAcct, txResHandler).catch(txErrHandler)
		setUnsub(() => unsub)
	}

	const unsignedTx = async () => {
		const transformed = transformParams(paramFields, inputParams)
		// transformed can be empty parameters
		const txExecute = transformed
			? apiProvider.tx[palletRpc][callable](...transformed)
			: apiProvider.tx[palletRpc][callable]()

		const unsub = await txExecute.send(txResHandler).catch(txErrHandler)
		setUnsub(() => unsub)
	}

	const queryResHandler = (result) =>
		result.isNone ? setStatus('None') : setStatus(result.toString())

	const query = async () => {
		const transformed = transformParams(paramFields, inputParams)
		const unsub = await apiProvider.query[palletRpc][callable](...transformed, queryResHandler)
		setUnsub(() => unsub)
	}

	const rpc = async () => {
		const transformed = transformParams(paramFields, inputParams, { emptyAsNull: false })
		const unsub = await apiProvider.rpc[palletRpc][callable](...transformed, queryResHandler)
		setUnsub(() => unsub)
	}

	const constant = () => {
		const result = apiProvider.consts[palletRpc][callable]
		result.isNone ? setStatus('None') : setStatus(result.toString())
	}

	const transaction = async () => {
		if (unsub) {
			unsub()
			setUnsub(null)
		}

		setStatus('Sending...')
		;(isSudo() && sudoTx()) ||
			(isUncheckedSudo() && uncheckedSudoTx()) ||
			(isSigned() && signedTx()) ||
			(isUnsigned() && unsignedTx()) ||
			(isQuery() && query()) ||
			(isRpc() && rpc()) ||
			(isConstant() && constant())
	}

	const transformParams = (paramFields, inputParams, opts = { emptyAsNull: true }) => {
		// if `opts.emptyAsNull` is true, empty param value will be added to res as `null`.
		//   Otherwise, it will not be added
		const paramVal = inputParams.map((inputParam) => {
			// To cater the js quirk that `null` is a type of `object`.
			if (
				typeof inputParam === 'object' &&
				inputParam !== null &&
				typeof inputParam.value === 'string'
			) {
				return inputParam.value.trim()
			} else if (typeof inputParam === 'string') {
				return inputParam.trim()
			}
			return inputParam
		})
		const params = paramFields.map((field, ind) => ({ ...field, value: paramVal[ind] || null }))

		return params.reduce((memo, { type = 'string', value }) => {
			if (value == null || value === '') return opts.emptyAsNull ? [...memo, null] : memo

			let converted = value

			// Deal with a vector
			if (type.indexOf('Vec<') >= 0) {
				converted = converted.split(',').map((e) => e.trim())
				converted = converted.map((single) =>
					isNumType(type)
						? single.indexOf('.') >= 0
							? Number.parseFloat(single)
							: Number.parseInt(single)
						: single
				)
				return [...memo, converted]
			}

			// Deal with a single value
			if (isNumType(type)) {
				converted =
					converted.indexOf('.') >= 0
						? Number.parseFloat(converted)
						: Number.parseInt(converted)
			}
			return [...memo, converted]
		}, [])
	}

	const isNumType = (type) => utils.paramConversion.num.some((el) => type.indexOf(el) >= 0)

	const allParamsFilled = () => {
		if (paramFields.length === 0) {
			return true
		}

		return paramFields.every((paramField, ind) => {
			const param = inputParams[ind]
			if (paramField.optional) {
				return true
			}
			if (param == null) {
				return false
			}

			const value = typeof param === 'object' ? param.value : param
			return value !== null && value !== ''
		})
	}

	const isSudoer = (acctPair) => {
		if (!sudoKey || !acctPair) {
			return false
		}
		return acctPair.address === sudoKey
	}

	return (
		<Button
			basic
			color={color}
			style={style}
			type="submit"
			onClick={transaction}
			disabled={
				disabled ||
				!palletRpc ||
				!callable ||
				!allParamsFilled() ||
				((isSudo() || isUncheckedSudo()) && !isSudoer(account))
			}
		>
			{label}
		</Button>
	)
}

// prop type checking
TxButton.propTypes = {
	setStatus: PropTypes.func.isRequired,
	type: PropTypes.oneOf([
		'QUERY',
		'RPC',
		'SIGNED-TX',
		'UNSIGNED-TX',
		'SUDO-TX',
		'UNCHECKED-SUDO-TX',
		'CONSTANT',
	]).isRequired,
	attrs: PropTypes.shape({
		palletRpc: PropTypes.string,
		callable: PropTypes.string,
		inputParams: PropTypes.array,
		paramFields: PropTypes.array,
	}).isRequired,
}

function TxGroupButton(props) {
	return (
		<Stack>
			<TxButton label="Unsigned" type="UNSIGNED-TX" color="grey" {...props} />
			<TxButton label="Signed" type="SIGNED-TX" color="blue" {...props} />
			<TxButton label="SUDO" type="SUDO-TX" color="red" {...props} />
		</Stack>
	)
}

export { TxButton, TxGroupButton }
