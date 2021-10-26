import React from 'react'
import { CircularProgress, Typography, Backdrop } from './index'

export const Loader = ({ text }) => (
	<Backdrop
		sx={{
			backgroundColor: 'rgba(0,0,0,0)',
			flexDirection: 'column',
		}}
		open={true}
	>
		<CircularProgress
			sx={{
				animationDuration: '300ms',
				width: '15px !important',
				height: '15px !important',
				'.MuiCircularProgress-svg': {
					width: '15px',
				},
			}}
			color="primary"
		/>
		<Typography variant="subtitle2">{text}</Typography>
	</Backdrop>
)

export default Loader
