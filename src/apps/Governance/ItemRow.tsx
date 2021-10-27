import React, { useEffect, useState, lazy } from 'react'
import { useSubstrate } from '../../substrate-lib'
import { useWallet } from 'src/context/Wallet'

import { data as d } from '../lib/data'
import { gateway } from '../lib/ipfs'
import config from '../../config'
const dev = config.dev

import { Button, Typography, Box, Stack, Grid } from 'src/components'

import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

export default function ItemRow ({ content }) {

	// should be the image of the associated org
	const [imageURL, setImageURL] = useState(null)

	// const [ config, setConfig ] = useState()
	// const [ itemContent, setItemContent ] = useState()

	// useEffect(()=>{
	// 	if ( !content || content.cid==='' ) return
	// 	if (dev) console.log('fetch config', content.cid)
	// 	fetch( gateway + content.cid )
	// 		.then( res => res.text() )
	// 		.then( txt => { setConfig(JSON.parse(txt)) })
	// 		.catch( err => console.log( err ) )
	// },[ content ])

	// useEffect(()=>{
	// 	if ( !config ) return
	// 	setImageURL( ( config.logo ) ? gateway + config.logo : null )
	// },[ config ])

	// useEffect(()=>{
	// 	if ( !content ) return
	// 	if (dev) console.log('load')
	// 	if (dev) console.log(members)
	// 	// merge module content with other metrics
	// 	// should move to storage/graph on refactor
	// 	setItemContent({
	// 		name: content.name,
	// 		body: d.dao_bodies.filter( b => b.value === Number(content.body))[0].text,
	// 		members: members.count,
	// 		balance: 0,
	// 		motions: 0,
	// 		campaigns: 0,
	// 	})
	// },[ content, members ])

	if (!content) return null
	console.log(content)

	const [open, setOpen] = React.useState(false);

	return (

		<React.Fragment>
			<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					<Typography>
						<img src={imageURL} />
						{content.name}<br/>
						{content.body}
					</Typography>
				</TableCell>
				<TableCell align="right">{content.purpose}</TableCell>
				<TableCell align="right">{content.amount}</TableCell>
				<TableCell align="right">{content.expiry}</TableCell>
				<TableCell align="right">{content.status}</TableCell>
				<TableCell align="right">votes</TableCell>
				<TableCell>
					<Button> YES </Button>
					<Button> NO </Button>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Typography variant="h6" gutterBottom component="div">
								Details
							</Typography>
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<TableCell>Date</TableCell>
										<TableCell>Eligible Voters</TableCell>
										<TableCell align="right">Active Votes</TableCell>
										<TableCell align="right">TVL (DAI)</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{
{/*										row.history.map((historyRow) => (
										<TableRow key={historyRow.date}>
											<TableCell component="th" scope="row">
												{historyRow.date}
											</TableCell>
											<TableCell>{historyRow.customerId}</TableCell>
											<TableCell align="right">{historyRow.amount}</TableCell>
											<TableCell align="right">
												{Math.round(historyRow.amount * row.price * 100) / 100}
											</TableCell>
										</TableRow>
									))*/}
									}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	)
}
