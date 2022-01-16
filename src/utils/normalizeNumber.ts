export function normalizeNumber(number: any) {
	return +`${number}`.replace(/,|\./g, '')
}
