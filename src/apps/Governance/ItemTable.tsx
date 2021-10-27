// control - a dao interface
// invoke and manage organisations on chain

import React, { useEffect, useState, lazy } from 'react'
import { useSubstrate } from '../../substrate-lib'
import { useWallet } from 'src/context/Wallet'

import { data as d } from '../lib/data'
import { gateway } from '../lib/ipfs'
import config from '../../config'
const dev = config.dev

import { Button, Typography, Box, Stack, Grid } from 'src/components'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

import ItemRow from './ItemRow'

export default function ItemTable({ content }) {

	if (!content) return null

	return (
		<TableContainer component={Paper}>
			<Table aria-label="collapsible table">
			<TableHead>
				<TableRow>
					<TableCell />
					<TableCell></TableCell>
					<TableCell align="right"></TableCell>
					<TableCell align="right"></TableCell>
					<TableCell align="right"></TableCell>
					<TableCell align="right"></TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{content.map((item, i) => (
					<ItemRow key={i} content={item} />
				))}
			</TableBody>
			</Table>
		</TableContainer>
	)
}
