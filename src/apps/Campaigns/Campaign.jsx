import * as React from 'react'
import { Suspense, useState, useEffect, lazy } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useApiProvider } from '@substra-hooks/core'



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

import { Renderer } from './three'

import { useCrowdfunding } from 'src/hooks/useCrowdfunding'
import { useWallet } from 'src/context/Wallet'

const Koijam = lazy(() => import('./koijam/Koijam'))

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

export function Campaign() {
	const id = useParams().id
	const t = ['Open World', 'Trending', 'Survivial']

	// MOCKS
	if (id === 'koijam') return <Koijam />


	const [value, setValue] = React.useState(0)

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	// markdown editor
	function handleEditorChange({ html, text }) {
		console.log('handleEditorChange', html, text);
	}

	const [content, setContent] = React.useState()

	const { campaignBalance, campaignState, campaigns } = useCrowdfunding()

	// const wallet = useWallet()

	// const mdParser = new MarkdownIt(/* Markdown-it options */);
	// mdParser.render(text)

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
					backgroundImage:
						'linear-gradient(to left, rgba(255, 255, 255, 0.0), rgba(22, 28, 36, 0.8)), url(/assets/campaign-bg.png)',
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
								<Grid item xs={12}>
									<img src={'/assets/campaign-logo.png'} alt={'Era of Chaos'} />
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
										From the developer of Virgo Versus The Zodiac and
										Osteoblasts comes a Tactical Rhythm JRPG in which you play
										as the Singer who fights the oppressive government to bring
										back Music to a melodyless world.
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
							<img
								src={'/assets/campaign-model.png'}
								style={{ maxWidth: '80%', marginBottom: '-10rem' }}
							/>
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
				<Typography variant="h4">LEVEL UP &</Typography>
				<Typography variant="h2">BE LEGENDARY</Typography>
			</Grid>

			<Grid item xs={12}>
				<Typography>
					From the developer of Virgo Versus The Zodiac and Osteoblasts comes a Tactical
					Rhythm JRPG in which you play as the Singer who fights the oppressive government
					to bring back Music to a melodyless world. Play as Ailuri, a small hero set on
					an adventure to protect the world from environmental destruction. Complete vast
					levels, rescue animals.
				</Typography>
			</Grid>

			<Grid item xs={12}>
				<Typography variant="h4">CHOOSE YOUR</Typography>
				<Typography variant="h2">CHAMPION</Typography>
			</Grid>

			<Grid item xs={12}>
				<Stack direction="row" sx={{ width: '100%' }}>
					{[0, 1, 2, 3, 4].map((x) => (
						<TileReward />
					))}
				</Stack>
			</Grid>

			<Grid item xs={12}>
				<Typography variant="h4">SOME CATCHY</Typography>
				<Typography variant="h2">HEADLINE</Typography>
			</Grid>

			<Grid item xs={12}>
				<Typography>
					From the developer of Virgo Versus The Zodiac and Osteoblasts comes a Tactical
					Rhythm JRPG in which you play as the Singer who fights the oppressive government
					to bring back Music to a melodyless world. Play as Ailuri, a small hero set on
					an adventure to protect the world from environmental destruction. Complete vast
					levels, rescue animals.
				</Typography>
			</Grid>

			<Grid item xs={12}>
				<Typography variant="h4">STUNNING &</Typography>
				<Typography variant="h2">MYSTICAL WORLDS</Typography>
			</Grid>
			<Grid item xs={12}>
				<Image16to9 />
			</Grid>
			<Grid item xs={12}>
				<Stack direction="row" spacing={2}>
					<Image16to9 />
					<Image16to9 />
					<Image16to9 />
					<Image16to9 />
				</Stack>
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
