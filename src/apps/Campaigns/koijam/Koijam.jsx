import * as React from 'react'
import { Suspense, useState, useEffect } from 'react'
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

export function Campaign() {
	const id = useParams().id
	const t = ['Sandbox', '0 - 99', 'Adventure', 'Animals']

	const [value, setValue] = React.useState(0)

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const [content, setContent] = React.useState()

	const { campaignBalance, campaignState, campaigns } = useCrowdfunding()

	// const wallet = useWallet()

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
					background: 'url(/assets/campaigns/koijam/steg2.jpg)',
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
								<Grid item xs={12} sx={{ marginTop: '10vh'}}>
									<img width="640px" src={'/assets/campaigns/koijam/koijamlogo.png'} alt={'Koi Jam'} />
								</Grid>
								<Grid item xs={12}>
									<Headline component={'h1'}>{content.name}</Headline>
								</Grid>
								<Grid item xs={12}>
									<Typography variant='h2'>ALL THE KOI</Typography>
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
							<Box sx={{ width: '66vw', height: '66vh', position: 'absolute', right: "0px", overflow: 'hidden' }}><Renderer/></Box>
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
				<Typography variant="h4">MAKE KOI &</Typography>
				<Typography variant="h2">MAKE FRIENDS</Typography>
			</Grid>

			<Grid item xs={12}>
				<Typography>
				You hatch from an egg as a DRAGON, at the bottom of a mountain lake. Here you find your first money. As you explore the Lake and the sourrounding area, you encounter some animals. one gives you a Handheld Computer, which will be your Interface. It has a Translator program, which enables you to understand and interact with the Animals. 
First, you help the CRANE rebuild his shop. 
				</Typography>
			</Grid>

			<Grid item xs={12}>
				<video autoplay="true" controls width="100%" height="100%">
					<source src="https://ipfs.gamedao.co/ipfs/QmceZKtSB4TJdCbcmsG7EARBzQGJhSLyga6WHPWSf4ck4n" type="video/mp4" />
				</video>
			</Grid>

			<Grid item xs={12}>
				<Image16to9 src="https://ipfs.gamedao.co/ipfs/QmV1Tx2Mwfbkk2YrGQKtnoavCjtUzGpn8wBEzsQTBVjnED"/>
			</Grid>
			<Grid item xs={12}>
				<Stack direction="row" spacing={2}>
				<Image16to9 src="https://ipfs.gamedao.co/ipfs/QmUsbJDYF3xQAVH6oYTr6uSQTgzecER8fqHmD9BgCASv61"/>
				<Image16to9 src="https://ipfs.gamedao.co/ipfs/QmccBBLNtHPXz8ciLU87wB6L3PLsWWDJABX9pas3SYNTga"/>
				<Image16to9 src="https://ipfs.gamedao.co/ipfs/QmRfeBhnHWhbhJsKiNmn1ACSWSWStVbCa289rWkEDESNo5"/>
				<Image16to9 src="https://ipfs.gamedao.co/ipfs/QmdCKzxo3evWV2pgucEtqWZWryE3yK5nRcQhu1NTLcRLpt"/>
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
				<Image16to9 src="https://ipfs.gamedao.co/ipfs/QmTSnyrJr9JRj1uZB999ai5fGu9TjoyJskaM2vqK3h4gt1"/>
			</Grid>
			<Grid item xs={12}>
				<Stack direction="row" spacing={2}>
					<Image16to9 src="https://ipfs.gamedao.co/ipfs/QmQXakkDJWic7XNizVrTzMKD7d77RjAyN9xhHyuYjehX9t"/>
					<Image16to9 src="https://ipfs.gamedao.co/ipfs/Qme1ExJMUvkHVxgtvuFJX7ET1owJ3bmydTTtJ6Vd5FFfP7"/>
					<Image16to9 src="https://ipfs.gamedao.co/ipfs/QmT8ey3ZSUHfkR9AfxSZdGTXJH3ALykyawvpPrT59QgjNM"/>
					<Image16to9 src="https://ipfs.gamedao.co/ipfs/QmS6pFs8qh7tYFAnix6jPqj8mwt54YVVVQHRhpfwhGQSve"/>
				</Stack>
			</Grid>

			<Grid item xs={12}>
				<Image16to9 src="https://ipfs.gamedao.co/ipfs/QmdCKzxo3evWV2pgucEtqWZWryE3yK5nRcQhu1NTLcRLpt"/>
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
