import { useDispatch, useSelector } from 'react-redux'
import { slice, blockStateSelector } from 'src/redux/block.slice'

export function useBlock() {
	const blockheight = useSelector(blockStateSelector)
	return blockheight
}

