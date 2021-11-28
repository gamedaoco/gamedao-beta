import React from 'react'
import { CircularProgress, Typography, Backdrop } from './index'

export const Loader = ({ text }) => (
	<Backdrop
		sx={{
			backgroundColor: 'transparent',
			flexDirection: 'column',
		}}
		open={true}
	>
		<CircularProgress
			sx={{
				marginLeft: '275px',
				animationDuration: '300ms',
				width: '15px !important',
				height: '15px !important',
				'.MuiCircularProgress-svg': {
					width: '15px',
				},
			}}
			color="primary"
		/>
		<Typography variant="subtitle2">{text || ''}</Typography>
	</Backdrop>
)

export default Loader
