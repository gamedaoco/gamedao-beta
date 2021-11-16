import HeartIcon from '@mui/icons-material/FavoriteBorder'
import { Box, Button, MenuItem, Select, Stack, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { useApiProvider, usePolkadotExtension } from '@substra-hooks/core'
import React, { useEffect } from 'react'
import { useStore } from 'src/context/Store'
import { useThemeState } from 'src/context/ThemeState'
import { useWallet } from 'src/context/Wallet'
import { useBalance } from 'src/hooks/useBalance'
import { styled } from '../components'
import { Icons, ICON_MAPPING } from './Icons'

function accountString(account) {
	const text = account?.meta?.name || account?.address || ''
	return text.length < 10 ? text : `${text.slice(0, 6)} ... ${text.slice(-6)}`
}

const AccountBox = styled(Box)(({ theme }) => ({
	borderRadius: '50px',
	backgroundColor: theme.palette.background.neutral,
	paddingLeft: theme.spacing(2),
	paddingRight: theme.spacing(2),
	paddingTop: theme.spacing(1),
	paddingBottom: theme.spacing(1),
	color: theme.palette.text.primary,
}))

const ConnectButton = styled(Button)(({ theme }) => ({
	borderRadius: '50px',
	color: theme.palette.text.primary,
	backgroundColor: theme.palette.background.neutral,
	['&:hover']: {
		backgroundColor: theme.palette.background.neutral,
	},
}))

const AccountSelect = styled(Select)(({ theme }) => ({
	margin: 0,
	backgroundColor: theme.palette.background.default,
	padding: theme.spacing(1),
	borderRadius: '50px',
	['& .MuiSelect-select']: {
		padding: 0,
		margin: 0,
		border: 0,
	},
	['& .MuiOutlinedInput-notchedOutline']: {
		border: 0,
	},
}))

const AccountComponent = () => {
	const { darkmodeEnabled } = useThemeState()
	const { updateStore, allowConnection } = useStore()
	const { accounts, w3enable, w3Enabled } = usePolkadotExtension()
	const { allowConnect, updateWalletState, account, address } = useWallet()

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
		updateWalletState({ allowConnect: false })
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
			updateWalletState({ account: accounts[0], address: accounts[0]?.address })
		}
	}, [accounts, allowConnect])

	const handleAccountChange = React.useCallback(
		(address: string) => {
			const account = accounts.find((a) => a.address === address)
			if (!account) return

			updateWalletState({
				account,
				address: account.address,
			})
		},
		[allowConnect, accounts]
	)

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
						<Stack spacing={1} alignItems={'center'} direction={'row'}>
							<HeartIcon />

							<AccountSelect
								renderValue={(value) => {
									const account = accounts.find((a) => a.address === value)
									if (!account) return 'n/a'
									return accountString(account)
								}}
								value={account?.address}
								name={'account'}
								onChange={(e) => handleAccountChange(e.target.value as string)}
							>
								{accounts?.map((a, index) => (
									<MenuItem key={index} value={a?.address}>
										{a?.address}
									</MenuItem>
								))}
							</AccountSelect>

							<BalanceAnnotation />

							<IconButton
								size="small"
								aria-label="disconnect"
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
				{balanceZero || 0} ZERO
			</Typography>
			<Typography sx={{ whiteSpace: 'nowrap' }} variant={'caption'}>
				{balancePlay || 0} PLAY
			</Typography>
			<Typography sx={{ whiteSpace: 'nowrap' }} variant={'caption'}>
				{balanceGame || 0} GAME
			</Typography>
		</Stack>
	)
}

const AccountSelector = (props) => {
	const apiProvider = useApiProvider()
	return apiProvider && apiProvider.query ? <AccountComponent {...props} /> : null
}

export default AccountSelector
