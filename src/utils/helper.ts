import { BigNumber } from 'bignumber.js'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { hexToU8a, isHex } from '@polkadot/util'

export function formatZero(amount): string {
	return (amount = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(18))).toString()
}

export function compareAddress(a, b) {
	const aEnc = encodeAddress(
		isHex(a)
			? hexToU8a(a)
			: decodeAddress(a),
	);
	const bEnc = encodeAddress(
		isHex(b)
			? hexToU8a(b)
			: decodeAddress(b),
	);

	return aEnc === bEnc;
}
