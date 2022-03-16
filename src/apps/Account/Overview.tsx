import React, { useEffect, useState } from 'react'

import { useWallet } from 'src/context/Wallet'
import { useIdentity } from 'src/hooks/useIdentity'
import { useEncodedAddress } from '@substra-hooks/core'

import hash from 'blueimp-md5'

import { createInfoNotification } from 'src/utils/notification'

import { useTheme } from '@mui/material/styles'
import { Table, TableBody, TableCell, TableRow } from 'src/components'
import { Grid, Stack, Typography, Box, Paper } from 'src/components'

import HeartIcon from '@mui/icons-material/FavoriteBorder'
import VerifiedIcon from '@mui/icons-material/Verified'

import Collectables from './Collectables'

const TopBar = ({ id, xp, rep, trust }) => {

	const { account, address } = useWallet()
	const theme = useTheme()
	const bgPlain = {
		backgroundColor: theme.palette.grey[500_16],
	}
	const convertedAddress = useEncodedAddress(address, 25) || ''

	const copyAddress = (e) => {
		e.preventDefault()
		navigator.clipboard.writeText(address)
		createInfoNotification('Address Copied to Clipboard!')
	}

	return (
		<Grid container spacing={4}>
			<Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'start' }}>

				<Stack direction="row" spacing={2} m={2}>
					<Box
						sx={{
							...bgPlain,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							// backgroundColor: '#111111',
							borderRadius: '1rem',
							marginRight: 2,
							height: '3.5rem',
							width: '3.5rem',
						}}
					>
						{ id.email
							? <img alt={id.email} src={`https://www.gravatar.com/avatar/${hash(id.email)}`} onClick={copyAddress} />
							: <HeartIcon onClick={copyAddress} />
						}

					</Box>
					<Stack>
						<Typography variant="h5">
							{ id.display && <>{id.display}{' '}<VerifiedIcon fontSize="small" sx={{ color: '#f0f' }} /></> }
							{ !id?.display && <>{account?.meta?.name} <small>(Wallet)</small> </>}
						</Typography>

						<Typography
							sx={{ fontSize: '0.8rem', fontWeight: '100' }}
							variant="body2"
						>
							{account && convertedAddress}
						</Typography>
					</Stack>
				</Stack>

			</Grid>

{/*			<Grid item xs={12} sm={6} sx={{ display: 'flex', verticalAlign: 'middle', justifyContent: 'end' }}>
				<Stack direction="row" spacing={2} m={2}>
					<Stack>
						<Typography sx={{ fontWeight: '100' }} variant="body2">
							{' '}
							XP{' '}
						</Typography>
						<Typography variant="overline">{xp}</Typography>
					</Stack>
					<Stack>
						<Typography sx={{ fontWeight: '100' }} variant="body2">
							{' '}
							Rep{' '}
						</Typography>
						<Typography variant="overline">{rep}</Typography>
					</Stack>
					<Stack>
						<Typography sx={{ fontWeight: '100' }} variant="body2">
							{' '}
							Trust{' '}
						</Typography>
						<Typography variant="overline">Level {trust}</Typography>
					</Stack>
				</Stack>
			</Grid>*/}
		</Grid>
	)
}

const SmallTable = ({ data }) => {
	if (!data) return
	return (
		<Table sx={{ minWidth: '200px' }} size="small" aria-label="table">
			<TableBody>
				{data.map((d) => (
					<TableRow
						key={d[0]}
						sx={{
							'td, th': { borderBottom: '1px dotted #999' },
							'&:last-child td, &:last-child th': { border: 0 },
							'a,a:hover,a:visited': { color: 'white', textDecoration: 'none' },
							'a:hover': { borderBottom: '1px dotted' },
						}}
					>
						<TableCell component="th" scope="row">
							{d[0]}
						</TableCell>
						<TableCell align="right">
							{d[2] ? (
								<a href={d[2]} target="_blank" rel="noreferrer">
									{d[1]}
								</a>
							) : (
								<>{d[1]}</>
							)}
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

	const [identity, setIdentity] = useState({
		identity: {},
		display: null, //'anonymouse',
		email: null, //'me@anonymou.se',
		web: null, //'https://anonymou.se',
		twitter: null, //'@anonymouse',
		discord: null, //'1234123412341234',
		cid: null,
		verified: true,
		kilt: null,
		fractal: null,
	})

	// ZERO sense
	const [sense, setSense] = useState({
		xp: 9000,
		rep: 1337,
		trust: 42,
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

	useEffect(()=>{

		if ( !identities || !identities[address] ) return
		const id = identities[address]?.toHuman()
		if(!id) return

		setIdentity({
			...identity,
			display: id.info.display.Raw,
			email: id.info.email.Raw,
			twitter: id.info.twitter.Raw,
			web: id.info.web.Raw,
			discord: id.info.discord?.Raw || '',
		})

	},[address, identities])

	return (
		<Box>
			{ identity && <TopBar id={identity} xp={sense.xp} rep={sense.rep} trust={sense.trust} /> }
			<Grid container spacing={2} mt={2}>
				<Grid item xs={12} md={6}>
					{ identity &&
						<Paper elevation={10} sx={{ p: 4, ...bgPlain, height: '100%' }}>
						{/*
							<Box
								sx={{
									display: 'flex',
									verticalAlign: 'middle',
									justifyContent: 'space-between',
								}}
							>
								<Typography variant="h3" sx={{ height: 'auto', m: 0 }}>
									{' '}
									Account{' '}
								</Typography>
								<Button
									size="small"
									sx={{ borderRadius: '100vw' }}
									variant="outlined"
									color="secondary"
								>
									Refresh
								</Button>
							</Box>*/}

							<Typography variant="h4" sx={{ mb: 2 }}>
								{' '}
								Identity{' '}
							</Typography>
							<Typography variant="body2" sx={{ mb: 2 }}>
								Identity data is aggregated from various sources, like the ZERO Identity, Kilt SocialKYC and more.
								Improving the quality of this data helps in building up a reputation!
							</Typography>
							<SmallTable
								data={[
									['identity', identity.display, ''],
									['email', identity.email, 'mailto:' + identity.email],
									['website', identity.web, 'https://' + identity.web],
									['twitter', identity.twitter, 'https://twitter.com/' + identity.twitter],
									['discord id', identity.discord, ''],
								]}
							/>
						</Paper>
					}
				</Grid>

				<Grid item xs={12} md={6}>
					<Paper elevation={10} sx={{ p: 4, ...bgPlain, height: '100%' }}>
						<Typography variant="h4" sx={{ mb: 2 }}>
							{' '}
							Achievements{' '}
						</Typography>
						<Typography variant="body2" sx={{ mb: 2 }}>
							Level up your score by using GameDAO protocols and collaborating with the community.
							Trust is based on identity, SocialKYC and doing the liveness check.
						</Typography>
						<SmallTable
							data={[
								['xp', sense.xp],
								['rep', sense.rep],
								['trust', sense.trust],
							]}
						/>
					</Paper>
				</Grid>

				<Grid item xs={12}>
					<Paper elevation={10} sx={{ p: 4, ...bgPlain, height: '100%' }}>
						<Typography variant="h4" sx={{ mb: 2 }}> Collectables </Typography>
{/*
						<Typography variant="body2" sx={{ mb: 2 }}>
							Collectables are non fungible items coming from various chains and are aggregated here.
						</Typography>
*/}

						<Collectables/>

{/*				<Box sx={{display: 'flex', justifyContent: 'end' }}>
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
				</Grid>

{/*
			<Paper elevation={10} sx={{ my: 2, p: 4, ...bgPlain }}>
				<Box
					sx={{
						display: 'flex',
						verticalAlign: 'middle',
						justifyContent: 'space-between',
					}}
				>
					<Typography variant="h3" sx={{ height: 'auto', m: 0 }}>
						{' '}
						Portfolio{' '}
					</Typography>

					<Button size="small" sx={{borderRadius: '100vw'}} variant="outlined" color="secondary">
						Refresh
					</Button>

				</Box>

				<Typography variant="h4" sx={{ my: 2 }}>
					{' '}
					Balances{' '}
				</Typography>
				<hr />
				<Typography variant="h4" sx={{ my: 2 }}>
					{' '}
					Collectables{' '}
				</Typography>
				<hr />

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
*/}
			</Grid>
		</Box>
	)
}
export default Component
