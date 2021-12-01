import React from 'react'
import { Box, Typography, Link, Button } from 'src/components'
import { Footer } from 'src/layouts/default/Footer'
import { Background } from './modules/background'
import { TextContainer } from './modules/textContainer'
import { Transactions } from './modules/transactions'

export function Home() {
	return (
		<>
			<Box
				sx={{
					width: '100%',
					height: '100vh',
					position: 'relative',
				}}
			>
				<Background />

				<Box
					zIndex="1"
					position="relative"
					display="flex"
					flexDirection="column"
					justifyContent="space-evenly"
					width="100%"
					height="100%"
				>
					<Box display="flex">
						<Box maxWidth="40%" marginLeft="10%">
							<Typography
								variant="h2"
								fontFamily="Aleno"
								fontWeight="400"
								sx={{
									textShadow: '0px 0px 24px #11F2B6',
								}}
							>
								GameDAO is a community owned cooperative providing fundraising,
								coordination and ownership protocols for the videogames economy.
							</Typography>
						</Box>
						<Link href="/app" variant="body2" marginLeft="auto" marginRight="10%">
							<Button size="large" variant="contained">
								Enter Beta
							</Button>
						</Link>
					</Box>

					<Box display="flex" flexWrap="wrap" justifyContent="center">
						<Box
							display="flex"
							flexWrap="wrap"
							flexBasis="50vw"
							justifyContent="center"
						>
							<TextContainer
								title="Creator"
								text="Super Mario Galaxy Nintendo 3DS closed beta Rush Platform Game Hit Points (HP) Driving Game FPS multiplayer online battle arena."
								color="#04F2C1"
							/>
							<TextContainer
								title="Gamer"
								text="Super Mario Galaxy Nintendo 3DS closed beta Rush Platform Game Hit Points (HP) Driving Game FPS multiplayer online battle arena."
								color="#E6E815"
							/>
							<TextContainer
								title="Investor"
								text="Super Mario Galaxy Nintendo 3DS closed beta Rush Platform Game Hit Points (HP) Driving Game FPS multiplayer online battle arena."
								color="#FFAE1E"
							/>
							<TextContainer
								title="Publisher"
								text="Super Mario Galaxy Nintendo 3DS closed beta Rush Platform Game Hit Points (HP) Driving Game FPS multiplayer online battle arena."
								color="#FF16CF"
							/>
						</Box>
					</Box>
				</Box>
			</Box>
			<Transactions />
			<Footer />
		</>
	)
}
