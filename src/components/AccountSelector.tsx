import React, { useEffect, useState } from 'react'
import HeartIcon from '@mui/icons-material/FavoriteBorder'
import { Box, Button, MenuItem, Select, Stack, Typography } from '@mui/material'
import { useWallet } from 'src/context/Wallet'
import IconButton from '@mui/material/IconButton'
import { useApiProvider, usePolkadotExtension } from '@substra-hooks/core'
import { useStore } from 'src/context/Store'
import { useThemeState } from 'src/context/ThemeState'
import { useBalance } from 'src/hooks/useBalance'
import { styled } from '../components'
import { ICON_MAPPING, Icons } from './Icons'
import { createErrorNotification, createInfoNotification } from 'src/utils/notification'
import { compareAddress, toKusamaAddress, toZeroAddress } from '../utils/helper'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router'

const COLLECTIONS = 'a0afbe96d2541b6446-1337'

function accountString(account) {
	const text = account?.meta?.name || toZeroAddress(account?.address ?? '') || ''
	return text.length < 10 ? text : `${text.slice(0, 6)} ... ${text.slice(-6)}`
}

const AccountBox = styled(Box)(({ theme }) => ({
	borderRadius: '50px',
	backgroundColor: theme.palette.background.neutral,
	paddingRight: theme.spacing(2),
	paddingLeft: '2px',
	paddingTop: '2px',
	paddingBottom: '2px',
	color: theme.palette.text.primary,
}))

const ConnectButton = styled(Button)(({ theme }) => ({
	borderRadius: '50px',
	padding: '1em 2em',
	color: theme.palette.text.primary,
	backgroundColor: theme.palette.background.neutral,
	['&:hover']: {
		backgroundColor: theme.palette.background.neutral,
	},
}))

const AccountSelect = styled(Select)(({ theme }) => ({
	margin: 0,
	backgroundColor: theme.palette.background.default,
	display: 'block',
	borderRadius: '50px',
	height: '100%',
	['& .MuiSelect-select']: {
		height: '100%',
		padding: 0,
		margin: 0,
		border: 0,
	},
	['& .MuiOutlinedInput-notchedOutline']: {
		border: 0,
	},
}))

async function checkForAccessNFT(accounts: string[]) {
	const headers = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	}

	const query = {
		query: `query($id:String, $owner: [String!] ) {
			collections(
				where: {
					id: { _eq: $id }
					nfts: { owner: { _in: $owner } }
				}
			) {
				id
			}
		}`,
		variables: {
			id: COLLECTIONS,
			owner: accounts,
		},
	}

	try {
		const req = await fetch('https://gql-rmrk-prod.graphcdn.app', {
			method: 'POST',
			headers,
			body: JSON.stringify(query),
		})
		const parsed = await req.json()
		if (parsed.data.collections.length > 0) {
			// NFT is contained in collection
			return true
		}
	} catch (e) {
		console.error(e)
		return false
	}

}

const AccountComponent = () => {
	const { darkmodeEnabled } = useThemeState()
	const { updateStore, allowConnection, lastAccountIndex } = useStore()
	const { accounts, w3enable, w3Enabled } = usePolkadotExtension()
	const { allowConnect, updateWalletState, account, address } = useWallet()
	const [questState, setQuestState] = useState(false)
	const navigate = useNavigate()
	const { pathname } = useLocation()

	const handleConnect = (e) => {
		e.stopPropagation()
		if (allowConnection) {
			updateWalletState({ allowConnect: true })
		} else {
			updateStore({ allowConnection: true })
		}
	}
	const handleDisconnect = (e) => {
		e.stopPropagation()
		setQuestState(false)
		updateStore({ allowConnection: false, connected: false })
		updateWalletState({ allowConnect: false, connected: false })
	}

	useEffect(() => {
		// Open web3 connection and load accounts
		if (allowConnect && !w3Enabled) {
			w3enable()
		} else if (w3Enabled && !allowConnect) {
			updateWalletState({
				address: null,
				account: null,
				allowConnect: false,
				connected: false,
			})
		}
	}, [allowConnect])

	useEffect(() => {
		// Set initial account => default account 0
		if (accounts && allowConnect) {
			;(async () => {
				// Return true to override Access key check
				return true

				return await checkForAccessNFT(accounts.map((acc) => toKusamaAddress(acc.address)))
			})().then((result: boolean) => {
				if (result) {
					// Finely connect wallet
					updateWalletState({
						account: accounts[lastAccountIndex || 0],
						address: toZeroAddress(accounts[lastAccountIndex || 0]?.address ?? ''),
						connected: true,
					})
					if (!questState) {
						setQuestState(true)
						navigate('/app/quest')
					}
				} else {
					// Reset wallet state
					updateStore({ allowConnection: false, connected: false })
					updateWalletState({ allowConnect: false, connected: false })
					createErrorNotification(
						'Connection failed, seems like you dont own an access key.',
					)
					if (pathname !== '/app') {
						navigate('/app')
					}
				}
			})
		}
	}, [accounts, allowConnect])

	const handleAccountChange = React.useCallback(
		(address: string) => {
			const account = accounts.find((a) => compareAddress(a.address, address))
			if (!account) return
			updateStore({ lastAccountIndex: accounts.indexOf(account) || 0 })
			updateWalletState({
				account,
				address: toZeroAddress(account.address),
			})
		},
		[allowConnect, accounts],
	)

	function copyAddress(e) {
		e.preventDefault()
		navigator.clipboard.writeText(address)
		createInfoNotification('Address Copied to Clipboard!')
	}

	return (
		<>
			{!allowConnect || !accounts ? (
				<ConnectButton variant={'text'} onClick={handleConnect} startIcon={<HeartIcon />}>
					Connect
				</ConnectButton>
			) : (
				account &&
				address && (
					<AccountBox>
						<Stack spacing={1} alignItems={'center'} direction={'row'} height='100%'>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									backgroundColor: '#292B2D',
									borderRadius: '50%',
									marginLeft: '4px',
									marginTop: '4px',
									marginBottom: '4px',
									height: '2.5rem',
									width: '2.5rem',
									cursor: 'pointer',
								}}
							>
								<HeartIcon onClick={copyAddress} />
							</Box>
							<AccountSelect
								renderValue={(value) => {
									const account = accounts.find((a) =>
										compareAddress(a.address, value),
									)
									if (!account) return 'n/a'
									return (
										<Box
											sx={{
												display: 'flex',
												height: '100%',
												alignItems: 'center',
											}}
										>
											<Box
												sx={{
													marginLeft: '1rem',
												}}
											>
												{accountString(account)}
											</Box>
										</Box>
									)
								}}
								value={account?.address}
								name={'account'}
								onChange={(e) => handleAccountChange(e.target.value as string)}
							>
								{accounts?.map((a, index) => (
									<MenuItem key={index} value={a?.address} title={a?.address}>
										{accountString(a)}
									</MenuItem>
								))}
							</AccountSelect>

							<BalanceAnnotation />

							<IconButton
								size='small'
								aria-label='disconnect'
								onClick={handleDisconnect}
							>
								<Icons
									src={ICON_MAPPING.logout}
									alt={'logout'}
									sx={{ filter: darkmodeEnabled ? 'invert(0)' : 'invert(1)' }}
								/>
							</IconButton>
						</Stack>
					</AccountBox>
				)
			)}
		</>
	)
}

const BalanceAnnotation = () => {
	const { balanceZero, balancePlay, balanceGame } = useBalance()

	return (
		<Stack direction={'column'}>
			<Typography sx={{ whiteSpace: 'nowrap' }} variant={'caption'}>
				{balanceZero || '0 ZERO'}
			</Typography>
			<Typography sx={{ whiteSpace: 'nowrap' }} variant={'caption'}>
				{balanceGame || 0} GAME
			</Typography>
			<Typography sx={{ whiteSpace: 'nowrap' }} variant={'caption'}>
				{balancePlay || 0} PLAY
			</Typography>
		</Stack>
	)
}

const AccountSelector = (props) => {
	const apiProvider = useApiProvider()
	return apiProvider && apiProvider.query ? <AccountComponent {...props} /> : null
}

export default AccountSelector
