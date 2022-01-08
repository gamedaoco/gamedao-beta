// material
import { alpha, styled } from '@mui/material/styles'
import { Card, Typography } from '@mui/material'
// utils

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
	boxShadow: 'none',
	textAlign: 'center',
	padding: theme.spacing(5, 0),
	color: theme.palette.primary.darker,
}))

const IconWrapperStyle = styled('div')(({ theme }) => ({
	margin: 'auto',
	display: 'flex',
	borderRadius: '50%',
	alignItems: 'center',
	width: theme.spacing(8),
	height: theme.spacing(8),
	justifyContent: 'center',
	marginBottom: theme.spacing(3),
	color: theme.palette.primary.dark,
}))

// ----------------------------------------------------------------------

export default function MiniStats({ children }) {
	return <RootStyle>{children}</RootStyle>
}
