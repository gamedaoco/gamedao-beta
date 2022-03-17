import * as React from 'react'
import { useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useApiProvider } from '@substra-hooks/core'
import { useBlock } from 'src/hooks/useBlock'
import { gateway } from '../lib/ipfs'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import {
	Box,
	Button,
	// Chip,
	Container,
	Countdown,
	Grid,
	Image16to9,
	Link,
	MarkdownViewer,
	Slider,
	Stack,
	styled,
	Typography,
} from '../../components'

import { TileReward } from './TileReward'

import { useCrowdfunding } from 'src/hooks/useCrowdfunding'
import { useGameDaoControl } from 'src/hooks/useGameDaoControl'
import { foregroundContentMap } from './campaignForegrounds/foregroundContentMap'

const Headline = styled(Typography)(({ theme }) => {
	return {
		fontSize: '1.3rem',
		fontWeight: 'bold',
	}
})

// const CampaignChip = styled(Chip)(({ theme }) => ({
// 	color: theme.palette.common.white,
// 	borderColor: theme.palette.common.white,
// 	padding: 0,
// 	height: '22px',
// }))

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
	// TODO: implement tags
	// const t = ['Indie', 'Solo Dev', 'Pondbox']

	const id = useParams().id

	// campaign specific foreground object code
	let Foreground = null

	if (id === '0x609be75c9a89951c734db8f69302c4ff08c2b800b88237ef0ae6ee328faa5cb9') {
		Foreground = foregroundContentMap.koijam
	}
	if (id === '0x79ad5ba2dbbf1fcb8f21bc8ef12945b8247a8baa00f85116f83927c573feb61b') {
		Foreground = foregroundContentMap.pixzoo
	}

	const blockheight = useBlock()

	const [value, setValue] = React.useState(0)
	const [IPFSData, setIPFSData] = React.useState()
	const [content, setContent] = React.useState()
	const { campaignBalance, campaignState, campaigns } = useCrowdfunding()
	const { bodies } = useGameDaoControl()

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	// markdown editor
	// function handleEditorChange({ html, text }) {
	// 	console.log('handleEditorChange', html, text)
	// }

	// fetch chain data
	useEffect(() => {
		if (!campaignBalance || !campaignState || !campaigns) return

		const content = {
			...(campaigns[id] ?? {}),
			state: campaignState[id],
			balance: campaignBalance[id],
		}

		setContent(content)
	}, [id, campaignBalance, campaignState, campaigns])

	useEffect(() => {
		// ToDo: When cid not valid output an error on the page?
		if (!content || (content.cid?.length ?? 0) < 4) return

		// fetch json from ipfs
		fetch(gateway + content.cid)
			.then((res) => res.json())
			.then((data) => setIPFSData(data))
			.catch((e) => console.error(`Couldn't load content of campaign ${content}`, e))
	}, [content])

	if (!content || !IPFSData || !bodies) return null

	//console.log(content, IPFSData)
	//console.log(bodies)

	// const createdTimestamp = parseInt(content.created.replaceAll(',', ''))
	const campaignEndBlockHeight = parseInt(content.expiry.replaceAll(',', ''))
	const blocksUntilExpiry = campaignEndBlockHeight - blockheight
	const expiryTimestamp = Date.now() + blocksUntilExpiry * 3 * 1000
	const campaignProgress =
		(parseFloat(content.balance.split(' ')[0]) / parseFloat(content.cap.split(' ')[0])) * 100
	const funded = campaignProgress >= 100

	const org = bodies[content.org]?.name
	const mdown = IPFSData.markdown

	// MOCKS
	// if (id === 'koijam') return <Koijam />

	return (
		<Box>
			<Box
				sx={{
					backgroundImage: `linear-gradient(to left, rgba(255, 255, 255, 0.0), rgba(22, 28, 36, 0.9)), url(${gateway}${IPFSData.header})`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					minHeight: '60vh',
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
									<img
										style={{ maxHeight: '40vh' }}
										src={`${gateway}${IPFSData.logo}`}
										alt={IPFSData.title + ' logo'}
									/>
								</Grid>
								<Grid item xs={12}>
									<Headline component={'h1'}>{IPFSData.title}</Headline>
									<Link
										component={NavLink}
										to={'/app/organisations/' + content.org}
									>
										<Typography variant="caption">{org}</Typography>
									</Link>
								</Grid>
								{/*<Grid item xs={12}>
									<Stack direction="row" spacing={2}>
										{t.map((tag) => {
											return <CampaignChip label={tag} variant="outlined" />
										})}
									</Stack>
								</Grid>*/}
								<Grid item xs={12}>
									<Typography>{IPFSData && IPFSData.description}</Typography>
								</Grid>
								<Grid item xs={12}>
									<Countdown date={expiryTimestamp} />
								</Grid>
								<Grid item xs={12}>
									<Stack direction={'row'} alignItems={'center'} spacing={1}>
										<Typography>
											<strong>{content.balance} </strong> of {content.cap}{' '}
											contributed.
										</Typography>
									</Stack>
								</Grid>
							</Grid>
						</Grid>
						<Grid item sx={{ textAlign: 'right' }} xs={12} md={7}>
							{Foreground}
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
										value={campaignProgress}
										/*sx={{ mr: 5 }}*/
									/>
								</Box>
								{funded && (
									<ParticipateButton
										/*onClick={() => createInfoNotification('Not Implemented Yet!')}*/
										variant={'contained'}
									>
										{/*!funded && 'Participate'*/}
										{funded && 'Funded!'}
									</ParticipateButton>
								)}
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
							{/*<Tab label="Rewards" {...a11yProps(1)} />
							<Tab label="Milestones" {...a11yProps(2)} />
							<Tab label="Funding" {...a11yProps(2)} />*/}
						</Tabs>
					</Grid>
					<Grid item xs={12}>
						<TabPanel value={value} index={0}>
							<MarkdownViewer markdown={mdown} />
						</TabPanel>
						{/*<TabPanel value={value} index={1}>
							<Rewards />
						</TabPanel>
						<TabPanel value={value} index={2}>
							<Milestones />
						</TabPanel>
						<TabPanel value={value} index={3}>
							<Funding />
						</TabPanel>*/}
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

// function Rewards() {
// 	return (
// 		<Grid container spacing={4}>
// 			<Grid item xs={12}>
// 				<Typography variant='h4'>PRE HEADLINE</Typography>
// 				<Typography variant='h2'>REWARDS</Typography>
// 			</Grid>
// 			<Grid item xs={12}>
// 				<Typography>
// 					Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
// 					tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At
// 					vero eos et accusam et justo.
// 				</Typography>
// 			</Grid>
// 			<Grid item xs={12}>
// 				<Grid container spacing={2}>
// 					{[0, 1, 2, 3, 4].map((x) => (
// 						<TileReward />
// 					))}
// 				</Grid>
// 			</Grid>
// 		</Grid>
// 	)
// }

// function Milestones() {
// 	return (
// 		<Grid container spacing={4}>
// 			<Grid item xs={12}>
// 				<Typography variant='h4'>PRE HEADLINE</Typography>
// 				<Typography variant='h2'>MILESTONES</Typography>
// 			</Grid>
// 			<Grid item xs={12}>
// 				<Typography>
// 					Lorem ipsum dur sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
// 					tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At
// 					vero eos et accusam et justo.
// 				</Typography>
// 			</Grid>
// 		</Grid>
// 	)
// }

// function Funding() {
// 	return (
// 		<Grid container spacing={4}>
// 			<Grid item xs={12}>
// 				<Typography variant='h4'>PRE HEADLINE</Typography>
// 				<Typography variant='h2'>FUNDING</Typography>
// 			</Grid>
// 			<Grid item xs={12}>
// 				<Typography>
// 					Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
// 					tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At
// 					vero eos et accusam et justo.
// 				</Typography>
// 			</Grid>
// 		</Grid>
// 	)
// }

export default function Component(props) {
	const apiProvider = useApiProvider()
	return apiProvider ? <Campaign /> : null
}
