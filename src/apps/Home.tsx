import * as React from 'react'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Avatar, Button, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container } from '../components'
import { Rainbowmesh } from './Rainbowmesh'

export default function SignIn() {
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const data = new FormData(event.currentTarget)
		// eslint-disable-next-line no-console
		console.log({
			email: data.get('email'),
			password: data.get('password'),
		})
	}

	return (
		<>
			<Box sx={{ zIndex: "-1", position: "absolute", width: "100vw", height: "100vh", top: "0px", left: "0px" }}>
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

					<Typography component="h2" variant="h5">
						Sign in
					</Typography>
					<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
						<TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
						/>
						<FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
						<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href="#" variant="body2">
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href="#" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</Box>

					<hr/>

					<Link href="/app" variant="body2"> app </Link>

				</Box>
			</Container>
		</>
	)
}
