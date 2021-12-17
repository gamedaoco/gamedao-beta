import React from 'react'
import { CircularProgress, Typography, Backdrop } from './index'

export const Loader = ({ text }) => (
	<Backdrop
		sx={{
			background: "transparent !important",
			flexDirection: 'column',
		}}
		open={true}
	>
		<CircularProgress
			sx={{
				marginLeft: '267px',
				animationDuration: '300ms',
				width: '15px !important',
				height: '15px !important',
				'.MuiCircularProgress-svg': {
					width: '15px',
				},
			}}
			color="primary"
		/>
		<Typography sx={{ marginLeft: '267px' }} variant="subtitle2">{text || ''}</Typography>
	</Backdrop>
)

export default Loader
