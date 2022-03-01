import { Box } from '../../../components'
import { gateway } from '../../lib/ipfs'
import { ipfsImageCIDs } from './ipfsImageCIDs'

export function MonitorButton({ text, children, disabled, onClick }) {
	return <Box style={{
		position: 'relative', maxWidth: '304px', margin: '0 auto',
	}}>
		<div className='monitor-button'
			 onClick={onClick}
		>
			{!disabled && <img
				width='100%'
				src={`${gateway}${ipfsImageCIDs['defaultButton']}`} />}
			{disabled && <img
				width='100%'
				src={`${gateway}${ipfsImageCIDs['disabledButton']}`} />}
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
