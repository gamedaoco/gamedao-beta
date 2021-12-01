import React from 'react'
import { Box, Stack, Typography } from 'src/components'

export function TextContainer({ title, text, color }) {
	return (
		<Box
			margin={1}
			sx={{
				backgroundImage: 'url(/assets/gamedao_container.svg)',
				backgroundSize: 'contain',
				backgroundRepeat: 'no-repeat',
				width: '20vw',
				height: '15.23vw',
			}}
		>
			<Box
				padding={5}
				height="100%"
				display="flex"
				flexDirection="column"
				justifyContent="space-between"
			>
				<Stack direction="row">
					<Typography variant="h4" marginRight={1}>
						{title}
					</Typography>
					<Typography variant="h4" color={color}>
						_
					</Typography>
				</Stack>
				<Stack>
					<Typography variant="body1">{text}</Typography>
				</Stack>
				<Stack direction="row">
					<Typography variant="h5" color={color} marginRight={1}>
						{'> '}
					</Typography>
					<Typography variant="h5">Learn more</Typography>
				</Stack>
			</Box>
		</Box>
	)
}
