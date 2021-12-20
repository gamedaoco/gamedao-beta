import React from 'react'
import { Button, Typography, Box, Paper } from 'src/components'

export const Component = () =>
	<Box>
		<Paper elevation={10} sx={{ my: 2, p: 4 }}>
			<Typography variant="h3" sx={{
				mb: 2,
				background: "-webkit-linear-gradient(45deg, #ff00cc 30%, #ff9900 90%)",
				WebkitBackgroundClip: "text",
				WebkitTextFillColor: "transparent",
				fontWeight:800
			}}>
				To use GameDAO DApp, the Polkadot Extension is required.
				Please connect your wallet or install the Extension.
			</Typography>
			<Box sx={{display: 'flex', justifyContent: 'end' }}>
				<a href="https://docs.gamedao.co/" target="_blank">
					<Button size="small" sx={{mr:2}}>
						Learn More
					</Button>
				</a>
				<a href="https://polkadot.js.org/extension/" target="_blank">
					<Button size="small" sx={{borderRadius: '100px'}} variant="outlined">
						Download
					</Button>
				</a>
			</Box>
		</Paper>
	</Box>

export default Component
