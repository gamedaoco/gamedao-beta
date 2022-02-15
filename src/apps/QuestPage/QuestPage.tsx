import { QuestItem } from './modules/questItem'
import { Box, Paper, Stack } from '@mui/material'
import './textOverride.css'
import { Typography } from '../../components'
import { useQuestContext } from '../../context/Quest'

export function QuestPage() {
	const questState = useQuestContext()

	return (
		<Stack spacing={4}>
			<Box
				component={'img'}
				src={'https://picsum.photos/200/300'}
				sx={{ height: '30vh' }}
				alt={'hero'}
			></Box>
			<Paper>
				<Stack padding={6} spacing={4}>
					<Typography className="quest-page__title-color">Headline</Typography>
					<Typography>
						We need your help! During our last update we lost our tangram key. Help us
						find the missing pieces to unlock the next chapter of GameDAO. By finding
						all pieces of the key and providing your valuable feedback GameDAO will be
						able to level up to the next version!
					</Typography>
				</Stack>
			</Paper>

			<Stack spacing={4} className="quest-page__container ">
				<QuestItem
					active={questState.hasQuest1Completed}
					first={true}
					activeImage={'https://picsum.photos/200'}
					title={'Quest #1'}
					description={'Connect your wallet and get your personal access key'}
					rtl={false}
				/>
				<div className="quest-page__divider--1" />
				<QuestItem
					active={questState.hasQuest2Completed}
					activeImage={'https://picsum.photos/200'}
					title={'Quest #2'}
					description={'Connect your wallet and get your personal access key'}
					rtl={true}
				/>
				<div className="quest-page__divider--2" />
				<QuestItem
					active={questState.hasQuest3Completed}
					activeImage={'https://picsum.photos/200'}
					title={'Quest #3'}
					description={'Connect your wallet and get your personal access key'}
					rtl={false}
				/>
				<div className="quest-page__divider--3" />
				<QuestItem
					active={questState.hasQuest4Completed}
					activeImage={'https://picsum.photos/200'}
					title={'Quest #4'}
					description={'Connect your wallet and get your personal access key'}
					rtl={true}
				/>
				<div className="quest-page__divider--4" />
				<QuestItem
					active={questState.hasQuest5Completed}
					activeImage={'https://picsum.photos/200'}
					title={'Quest #5'}
					description={'Connect your wallet and get your personal access key'}
					rtl={false}
				/>
				<div className="quest-page__divider--6" />
				<QuestItem
					active={questState.hasQuest6Completed}
					last={true}
					activeImage={'https://picsum.photos/200'}
					title={'Quest #6'}
					description={'Connect your wallet and get your personal access key'}
					rtl={true}
				/>
			</Stack>
		</Stack>
	)
}
