import * as React from 'react'
import { Suspense, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useApiProvider } from '@substra-hooks/core'
import { useSpring, animated, config } from 'react-spring'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import {
	Box,
	Typography,
	Grid,
	Divider,
	Chip,
	styled,
	Box16to9,
	Container,
	Button,
	Stack,
	Slider,
	Image16to9,
} from '../../components'

import { TileReward } from './TileReward'

import Renderer from './koijam/Render'


import { useCrowdfunding } from 'src/hooks/useCrowdfunding'
import { useWallet } from 'src/context/Wallet'

const Headline = styled(Typography)(({ theme }) => {
	return {
		fontSize: '1.3rem',
		fontWeight: 'bold',
	}
})

const CampaignChip = styled(Chip)(({ theme }) => ({
	color: theme.palette.common.white,
	borderColor: theme.palette.common.white,
	padding: 0,
	height: '22px',
}))

const CountdownStack = styled(Stack)(({ theme }) => ({
	width: '80px',
}))

const ParticipateButton = styled(Button)(({ theme }) => ({
	borderRadius: '50px',
	backgroundColor: '#475B99',
	backdropFilter: 'blur(10px)',
	boxShadow: 'none',
	paddingLeft: theme.spacing(6),
	paddingRight: theme.spacing(6),
}))

const CampaignSlider = styled(Slider)(({ theme }) => ({
	['&.MuiSlider-track']: {
		color: 'red',
	},
}))

function TabPanel(props) {
	const { children, value, index, ...other } = props

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	)
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
}

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	}
}


function AnimatedRender() {
	const props = useSpring({ loop: true, marginTop: "100px", from: { marginTop: "0px" } });
	return (
	  <animated.div style={{ ...props }}>
		<h1 style={{ color: "white" }}>C1</h1>
	  </animated.div>
	);
  }
  
  const c1Style = {
	marginTop: "0px",
	background: "steelblue",
	color: "white",
	padding: "1.5rem"
  };


export function Campaign() {
	const id = useParams().id
	const t = ['Open World', 'Trending', 'Survivial']

	const [value, setValue] = React.useState(0)

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const [content, setContent] = React.useState()

	const { campaignBalance, campaignState, campaigns } = useCrowdfunding()

	// const wallet = useWallet()h

	useEffect(() => {
		if (!campaignBalance || !campaignState || !campaigns) return

		const content = {
			...(campaigns[id] ?? {}),
			state: campaignState[id],
			balance: campaignBalance[id],
		}

		setContent(content)
	}, [campaignBalance, campaignState, campaigns])

	if (!content) return '...'

	return (
		<Box>
			<Box
				sx={{
					background: 'url(/assets/campaigns/feanor/Feanor.png)',
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					minHeight: '450px',
					padding: 8,
					color: 'common.white',
					alignItems: 'center',
					display: 'flex',
				}}
			>
				<Container maxWidth={'lg'}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={5}>
							<Grid container spacing={2}>
								<Grid item xs={12} sx={{ marginTop: '22vh'}}>
									<img width="640px" src={'/assets/campaigns/pixzoo/pixzoologo.png'} alt={'Koi Jam'} />
								</Grid>
								<Grid item xs={12}>
									<Headline component={'h1'}>{content.name}</Headline>
								</Grid>
								<Grid item xs={12}>
									<Stack direction="row" spacing={2}>
										{t.map((tag) => {
											return <CampaignChip label={tag} variant="outlined" />
										})}
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Typography>
										Manage a Pond Ecosystem Breed colorful koi and Bring Life back to the valley in
										this 0-99 all ages adventure.
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Stack
										direction={'row'}
										sx={{ alignItems: 'center' }}
										divider={
											<Divider
												sx={{
													height: '30px',
													backgroundColor: 'common.white',
												}}
												orientation={'vertical'}
											/>
										}
										spacing={1}
									>
										<CountdownStack direction={'column'}>
											<Typography
												align={'center'}
												variant={'h3'}
												component={'span'}
											>
												24
											</Typography>
											<Typography
												align={'center'}
												variant={'body2'}
												component={'span'}
											>
												days
											</Typography>
										</CountdownStack>
										<CountdownStack direction={'column'}>
											<Typography
												align={'center'}
												variant={'h3'}
												component={'span'}
											>
												23
											</Typography>
											<Typography
												align={'center'}
												variant={'body2'}
												component={'span'}
											>
												hours
											</Typography>
										</CountdownStack>
										<CountdownStack direction={'column'}>
											<Typography
												align={'center'}
												variant={'h3'}
												component={'span'}
											>
												59
											</Typography>
											<Typography
												align={'center'}
												variant={'body2'}
												component={'span'}
											>
												minutes
											</Typography>
										</CountdownStack>
										<CountdownStack direction={'column'}>
											<Typography
												align={'center'}
												variant={'h3'}
												component={'span'}
											>
												59
											</Typography>
											<Typography
												align={'center'}
												variant={'body2'}
												component={'span'}
											>
												seconds
											</Typography>
										</CountdownStack>
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack direction={'row'} alignItems={'center'} spacing={1}>
										<img height={17} width={17} src={'/assets/play.png'} />
										<Typography>
											<strong>385’721.59 PLAY</strong> funded of 500k goal
										</Typography>
									</Stack>
								</Grid>
							</Grid>
						</Grid>
						<Grid item sx={{ textAlign: 'right' }} xs={12} md={7}>
							<Box sx={{ position: 'absolute', marginTop: 12, right: 12 }}>
							  <img width="640px" src={'/assets/campaigns/feanor/.png'} alt={'Feanor'} />
							</Box>
						</Grid>
					</Grid>
				</Container>
			</Box>
			<Box sx={{ marginTop: '-2.6rem' }}>
				<Container maxWidth={'lg'}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={7}>
							<Stack direction={'row'} alignItems={'center'}>
								<Box
									sx={{
										width: '100%',
										py: 0.5,
										px: 2,
										borderRadius: '10px',
										backgroundColor: 'rgba(19,30,67,0.6)',
										display: 'flex',
										alignItems: 'center',
										mr: -5,
									}}
								>
									<CampaignSlider
										components={{
											Thumb: (props) => {
												const { style, children, ...otherProps } = props
												return (
													<img
														style={{
															position: 'relative',
															top: '-8px',
															...props.style,
														}}
														src={'/assets/play.png'}
														width={17}
														height={17}
														{...otherProps}
													/>
												)
											},
										}}
										value={30}
										sx={{ mr: 5 }}
									/>
								</Box>
								<ParticipateButton variant={'contained'}>
									Participate
								</ParticipateButton>
							</Stack>
						</Grid>
					</Grid>
				</Container>
			</Box>
			<Container maxWidth="lg" sx={{ marginBottom: 4 }}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
							<Tab label="Description" {...a11yProps(0)} />
							<Tab label="Rewards" {...a11yProps(1)} />
							<Tab label="Milestones" {...a11yProps(2)} />
							<Tab label="Funding" {...a11yProps(2)} />
						</Tabs>
					</Grid>
					<Grid item xs={12}>
						<TabPanel value={value} index={0}>
							<Description />
						</TabPanel>
						<TabPanel value={value} index={1}>
							<Rewards />
						</TabPanel>
						<TabPanel value={value} index={2}>
							<Milestones />
						</TabPanel>
						<TabPanel value={value} index={3}>
							<Funding />
						</TabPanel>
					</Grid>
				</Grid>
			</Container>
		</Box>
	)
}

function Description() {
	return (
		<Grid container spacing={4}>
			<Grid item xs={12}>
				<Typography variant="h4">RPG &</Typography>
				<Typography variant="h2">TOWER DEFENSE</Typography>
			</Grid>

			<Grid item xs={12}>
				<Typography>
				You can attract over 100 Animals by building your Island with lava, saltwater, ice and others.
				Collect their droppings to make your Island Bigger.
				But be careful they might starve if the environment is not in balance.
				</Typography>
			</Grid>

			<Grid item xs={12}>
				<img height='100%' width="100%" src="/assets/campaigns/feanor/Feanor2.png"/>
			</Grid>

		</Grid>
	)
}

function Rewards() {
	return (
		<Grid container spacing={4}>
			<Grid item xs={12}>
				<Typography variant="h4">PRE HEADLINE</Typography>
				<Typography variant="h2">REWARDS</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography>
					Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
					tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At
					vero eos et accusam et justo.
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Grid container spacing={2}>
					{[0, 1, 2, 3, 4].map((x) => (
						<TileReward />
					))}
				</Grid>
			</Grid>
		</Grid>
	)
}

function Milestones() {
	return (
		<Grid container spacing={4}>
			<Grid item xs={12}>
				<Typography variant="h4">PRE HEADLINE</Typography>
				<Typography variant="h2">MILESTONES</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography>
					Lorem ipsum dur sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
					tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At
					vero eos et accusam et justo.
				</Typography>
			</Grid>
		</Grid>
	)
}

function Funding() {
	return (
		<Grid container spacing={4}>
			<Grid item xs={12}>
				<Typography variant="h4">PRE HEADLINE</Typography>
				<Typography variant="h2">FUNDING</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography>
					Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
					tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At
					vero eos et accusam et justo.
				</Typography>
			</Grid>
		</Grid>
	)
}

export default function Component(props) {
	const apiProvider = useApiProvider()
	return apiProvider ? <Campaign /> : null
}
