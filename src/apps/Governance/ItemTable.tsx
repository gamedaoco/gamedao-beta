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
			<Grid container>
				<Grid item xs={12}>
					<TableContainer>
						<Table aria-label="collapsible table">
							<TableHead>
								<TableRow>
									<TableCell />
									<TableCell align="center">Project</TableCell>
									<TableCell align="right">Purpose</TableCell>
									<TableCell align="right">Amount</TableCell>
									<TableCell align="right">Expiry</TableCell>
									<TableCell align="center">Status</TableCell>
									<TableCell align="right">Action</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{content && content.map((item, i) => <ItemRow key={i} content={item} />)}
								<ItemRow
									key={0}
									content={{
										name: 'Test',
										body: 'Hybrid DAO',
										purpose: '',
										amount: 123,
										expiry: 1230,
										status: 'open',
									}}
								/>
								<ItemRow
									key={1}
									content={{
										name: 'Bongo Klan',
										body: 'DAO',
										purpose: '',
										amount: 123,
										expiry: 1230,
										status: 'open',
									}}
								/>
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
			</Grid>
		</React.Fragment>
	)
}
