import * as React from 'react'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Avatar, Button, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container } from '../components'
import { Rainbowmesh } from './Rainbowmesh'
import { Icons, ICON_MAPPING } from 'src/components/Icons'

export default function SignIn() {
	return (
		<>
			<Box sx={{ zIndex: "-1", position: "absolute", width: "100%", height: "100vh", top: "0px", left: "0px" }}>
				<Rainbowmesh/>
			</Box>
			<Container component="main" maxWidth="xs">
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>

					<Icons
						src={ICON_MAPPING.logoWhite}
						alt={'GameDAO'}
						sx={{ height: '256px' }}
					/>

					<hr/>

					<Box style={{ position: "absolute", bottom: '16vh' }}><Link href="/app" variant="body2"><Button size="large" variant="contained">Enter App</Button></Link></Box>

				</Box>
			</Container>
		</>
	)
}
