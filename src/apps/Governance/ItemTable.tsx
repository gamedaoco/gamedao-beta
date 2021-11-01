// control - a dao interface
// invoke and manage organisations on chain

import React, { useEffect, useState, lazy } from 'react'
import { useSubstrate } from '../../substrate-lib'
import { useWallet } from 'src/context/Wallet'

import { data as d } from '../lib/data'
import { gateway } from '../lib/ipfs'
import config from '../../config'
const dev = config.dev

import { Typography, Grid } from 'src/components'

import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Paper from '@mui/material/Paper'

import ItemRow from './ItemRow'

export default function ItemTable({ content }) {

	// if (!content) return null

	return (
		<React.Fragment>
			<Grid container spacing={2}>

				<Grid item xs={16}>
					<Typography component="h3" variant="h4">General Information</Typography>
				</Grid>

				<Grid item xs={16}>
					<TableContainer>
						<Table aria-label="collapsible table">
						<TableHead>
							<TableRow>
								<TableCell />
								<TableCell>a</TableCell>
								<TableCell align="right">b</TableCell>
								<TableCell align="right">c</TableCell>
								<TableCell align="right">d</TableCell>
								<TableCell align="right">e</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{ content && content.map((item, i) => (
								<ItemRow key={i} content={item} />
							))}
						</TableBody>
						</Table>
					</TableContainer>
				</Grid>

			</Grid>
		</React.Fragment>
	)
}
