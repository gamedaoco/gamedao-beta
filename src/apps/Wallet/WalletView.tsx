import React, { useEffect, useState } from 'react'
import { useApiProvider } from '@substra-hooks/core'
import { useWallet } from 'src/context/Wallet'
import { useIdentity } from 'src/hooks/useIdentity'

import { alpha, useTheme } from '@mui/material/styles'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, Typography, Box, Paper } from 'src/components'


const SmallTable = ({ data }) => {
	if (!data) return
	return (
		<Table sx={{ minWidth: 400 }} size="small" aria-label="table">
			<TableBody>
				{ data.map( d => (
					<TableRow
						key={d[0]}
						sx={{
							'td, th': { borderBottom:'1px dotted #999' },
							'&:last-child td, &:last-child th': { border: 0 },
							'a,a:hover,a:visited': { color: 'white', textDecoration: 'none'},
							'a:hover': { borderBottom: '1px dotted' }
						}}
						>
						<TableCell component="th" scope="row">{d[0]}</TableCell>
						<TableCell align="right">
							{ d[2]
								? <a href={d[2]} target="_blank">{d[1]}</a>
								: <>{d[1]}</>
							}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

export const Component = () => {

	const theme = useTheme()
	const bgPlain = { backgroundColor: theme.palette.grey[500_16] }

	const { address } = useWallet()
	const { identities } = useIdentity(address)

	// ZERO identity
	const [identity, setIdentity] = useState({
		identity: {},
		legal: 'anonymouse',
		email: 'me@anonymou.se',
		web: 'https://anonymou.se',
		twitter: '@anonymouse',
		discord: '1234123412341234',
		cid: null,
		verified: true,
		kilt: null,
		fractal: null,
	})

	// ZERO sense
	const [sense,setSense] = useState({
		xp: 0,
		rep: 0,
		trust: 0,
	})

	// balances
	const [balances, setBalances] = useState({
		ZERO: { total: 0, reserved: 0, available: 0 },
		GAME: { total: 0, reserved: 0, available: 0 },
		PLAY: { total: 0, reserved: 0, available: 0 },
		AUSD: { total: 0, reserved: 0, available: 0 },
	})

	// collectables
	const [collectables, setCollectables] = useState({
		claimed: { count: 0, items: [] },
		unclaimed: { count: 0, items: [] },
	})

	useEffect(() => {
		setIdentity({
			...identity,
			identity: identities?.[address]?.toHuman()?.info?.display?.Raw || null,
		})
	}, [identities, address])

	return (
		<Box>
			<Paper elevation={10} sx={{ my: 2, p: 4, ...bgPlain }}>

				<Box sx={{
					display: 'flex',
					verticalAlign: 'middle',
					justifyContent: 'space-between'
				}}>
					<Typography variant="h3" sx={{ height: 'auto', m: 0 }}> Account </Typography>
					<Button size="small" sx={{borderRadius: '100vw'}} variant="outlined" color="secondary">
						Refresh
					</Button>
				</Box>

				<Typography variant="h4" sx={{ mt: 2, mb: 2 }}> Identity </Typography>
				<SmallTable data={[
					['identity','gamedao',''],
					['email','hey@gamedao.co','mailto:hey@gamedao.co'],
					['website','gamedao.co','https://gamedao.co'],
					['twitter','@gamedaoco','https://twitter.com/gamedaoco'],
					['discord','gamedao#1337','']
				]}/>
				<Typography variant="h4" sx={{ mt: 4, mb: 2 }}> Sense </Typography>
				<SmallTable data={[
					['xp',9000],
					['rep',1337],
					['trust',42]
				]}/>

			</Paper>

			<Paper elevation={10} sx={{ my: 2, p: 4, ...bgPlain }}>

				<Box sx={{
					display: 'flex',
					verticalAlign: 'middle',
					justifyContent: 'space-between'
				}}>
					<Typography variant="h3" sx={{ height: 'auto', m: 0 }}> Portfolio </Typography>
{/*
					<Button size="small" sx={{borderRadius: '100vw'}} variant="outlined" color="secondary">
						Refresh
					</Button>
*/}
				</Box>

				<Typography variant="h4" sx={{ my: 2 }}> Balances </Typography>
				<hr/>
				<Typography variant="h4" sx={{ my: 2 }}> Collectables </Typography>
				<hr/>
{/*
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
*/}
			</Paper>
		</Box>
	)
}
export default Component
