import { BigNumber } from 'bignumber.js'

export function formatZero(amount): string {
	return (amount = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(18))).toString()
}
