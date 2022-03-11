import { BigNumber } from 'bignumber.js'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { hexToU8a, isHex } from '@polkadot/util'

export function formatZero(amount): string {
	return (amount = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(18))).toString()
}

const ZERO_SS58_PREFIX = 25

export function toZeroAddress(addr) {
	try {
		return encodeAddress(isHex(addr) ? hexToU8a(addr) : decodeAddress(addr), ZERO_SS58_PREFIX)
	} catch (e) {
		return null
	}
}

export function toKusamaAddress(addr) {
	try {
		return encodeAddress(isHex(addr) ? hexToU8a(addr) : decodeAddress(addr), 2)
	} catch (e) {
		return null
	}
}

export function compareAddress(a, b) {
	try {
		const aEnc = encodeAddress(isHex(a) ? hexToU8a(a) : decodeAddress(a))
		const bEnc = encodeAddress(isHex(b) ? hexToU8a(b) : decodeAddress(b))
		return aEnc === bEnc
	} catch (e) {
		return null
	}
}

export function decodeAddressAsString(address) {
	return decodeAddress(address).toString()
}
