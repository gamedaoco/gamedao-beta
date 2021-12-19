import React from 'react'
import { Typography, Backdrop } from './index'

export const Message = ({ err }) => (
	<Backdrop
		sx={{
			backgroundColor: 'rgba(0,0,0,0)',
			flexDirection: 'column',
		}}
		open={true}
	>
		<Typography variant="subtitle2">Error Connecting to Network</Typography>

		<Typography variant="subtitle2">{`${JSON.stringify(err, null, 4)}`}</Typography>
	</Backdrop>
)

export default Message