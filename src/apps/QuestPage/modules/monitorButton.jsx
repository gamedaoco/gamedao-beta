import { Box } from '../../../components'
import { gateway } from '../../lib/ipfs'
import { IPFS_IMAGE_CID } from './IPFS_IMAGE_CID'

export function MonitorButton({ text, children, disabled, onClick }) {
	return <Box style={{
		position: 'relative', maxWidth: '304px', margin: '0 auto',
	}}>
		<div className='monitor-button'
			 onClick={onClick}
		>
			{!disabled && <img
				width='100%'
				src={`${gateway}${IPFS_IMAGE_CID['defaultButton']}`} />}
			{disabled && <img
				width='100%'
				src={`${gateway}${IPFS_IMAGE_CID['disabledButton']}`} />}
			<span style={{
				width: '100%',
				color: 'black',
				top: '33%',
				left: '0%',
				position: 'absolute',
				textAlign: 'center',
				textTransform: 'uppercase',
			}}>{text}</span>
		</div>
	</Box>
}
