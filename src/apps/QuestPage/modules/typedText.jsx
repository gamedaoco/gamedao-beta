import Typewriter from 'typewriter-effect'
import { useState } from 'react'
import { MonitorButton } from './monitorButton'
import { gateway } from '../../lib/ipfs'
import { IPFS_IMAGE_CID } from './IPFS_IMAGE_CID'
import { useQuestContext } from '../../../context/Quest'

// Intro
function Intro() {
	const [showButton, setShowButton] = useState(false)
	const { updateQuestState, introTextPlayed } = useQuestContext()
	return (
		<>
			<Typewriter
				onInit={(typewriter) => {
					typewriter
						.changeDelay(introTextPlayed ? 1 : 45)
						.typeString(
							'Shall we play a game?\n' +
							'\n' +
							'No, not chess.\n' +
							'\n' +
							'Something much, much better.\n' +
							'Something only YOU have in mind.\n' +
							'\n' +
							'But for this game, you’ll need a team of allies.\n' +
							'And you’ll need some money. \n' +
							'It’s always about money isn’t it?\n' +
							'\n' +
							'But you just want to have fun.\n' +
							'\n' +
							'Fear not. Follow Hawkins on these six quests, and she’ll help you.\n',
						)
						.callFunction(() => {
							setShowButton(true)
							updateQuestState({
								introTextPlayed: true,
							})
						})
						.start()
				}}
			/>
			{showButton && (
				<MonitorButton
					text={'play now'}
					onClick={() =>
						updateQuestState({
							screenIndex: 1,
						})
					}
				/>
			)}
		</>
	)
}

// Quest one
function QuestOne() {
	const [showButton, setShowButton] = useState(false)
	const { hasQuest1Completed, updateQuestState, quest1Played } = useQuestContext()
	return (
		<>
			<Typewriter
				onInit={(typewriter) => {
					typewriter
						.changeDelay(quest1Played ? 1 : 45)
						.typeString(
							'Cha-ching, baby!\n' +
							'// Connect your wallet and get tokens\n' +
							'\n' +
							'You power up your Commodore 64 and slide on your VR goggles.\n' +
							'\n' +
							'Hawkins waits for you inside 80s world, then takes you to an old-time video arcade, the kind they used to have in crowded places called shopping malls. You follow her through a maze of 8-bit cabinet games like Pac-Man, Galaga, and Joust. All around, machines ding and blip and chime with joy as players rack up high scores. Hawkins leads you past a row of pinball games to the change machine in the back. You step aside as she inserts a bill into the slot. Golden game tokens tumble into a metal cup, adding delightful clangs to the ambient digital noise.\n' +
							'As you fiddle with the red shag carpet on the wall, you notice a CASSETTE tape resting atop the coin machine.\n' +
							'Hawkins grabs her fistful of coins.\n' +
							'But you still have none.\n',
						)
						.typeString(
							'<span class="monitor-text--you">“Hawkins,”</span> you say. <span class="monitor-text--you">“My wallet’s empty.”\n</span>',
						)
						.typeString(
							'<span class="monitor-text--hawkins">“Ah, yes, that’s a common problem,”</span> she says. <span class="monitor-text--hawkins--you">“Let me show you to the faucet.”\n</span>',
						)
						.callFunction(() => {
							setShowButton(true)
							updateQuestState({
								quest1Played: true,
							})
						})
						.start()
				}}
			/>
			{showButton && (
				<div style={{ width: '100%' }}>
					<span>
						Need Help? Check how to get ZERO tokens in our{' '}
						<a style={{ color: '#54fad0' }} href={'https://docs.gamedao.co/'}>
							documentation.
						</a>
					</span>
				</div>
			)}
			{showButton && (
				<MonitorButton
					text={'next'}
					disabled={!hasQuest1Completed}
					onClick={() =>
						updateQuestState({
							screenIndex: 2,
						})
					}
				/>
			)}
		</>
	)
}

function QuestOneComplete() {
	const { updateQuestState } = useQuestContext()
	return (
		<>
			<img width='65%' src={`${gateway}${IPFS_IMAGE_CID['cassette']}`} />
			<div style={{ width: '100%', margin: '1rem 0', fontSize: '1.5rem', fontWeight: 600 }}>
				YEAH! Well done, your wallet contains tokens now!
			</div>
			<MonitorButton
				text={'next quest'}
				onClick={() =>
					updateQuestState({
						screenIndex: 3,
					})
				}
			/>
		</>
	)
}

// Quest two
function QuestTwo() {
	const [showButton, setShowButton] = useState(false)
	const { updateQuestState, hasQuest2Completed, quest2Played } = useQuestContext()

	return (
		<>
			<Typewriter
				onInit={(typewriter) => {
					typewriter
						.changeDelay(quest2Played ? 1 : 45)
						.typeString('I’ve not seen such bravery!\n' + '// Create a DAO\n\n')
						.typeString(
							'<span class="monitor-text--hawkins">“Great, you have tokens,”</span> Hawkins says. <span class="monitor-text--hawkins">“Grab that cassette tape, cos next you’ll need a DAO.”\n</span>',
						)
						.typeString(
							'<span class="monitor-text--you">“What’s a DAO?”</span> you ask.\n',
						)
						.typeString(
							'<span class="monitor-text--hawkins">“Technically, it means ‘decentralised autonomous organisation’.”</span>\n',
						)
						.typeString(
							'<span class="monitor-text--you">“You lost me, Hawkins.”</span>\n',
						)
						.typeString(
							'<span class="monitor-text--hawkins">“You know how arcades are. Everyone wants to play and nobody’s in charge, but we have to maintain order. What happens when you’re playing a game and someone wants to be next?”</span>\n',
						)
						.typeString(
							'<span class="monitor-text--you">“They put a token on the corner of the cabinet to let you know.”</span>\n',
						)
						.typeString(
							'<span class="monitor-text--hawkins">“Right. You don’t even have to talk about it, cos you know they’re next. If you wanted to play three more times, you woulda put three tokens up in the corner before you started to let everyone know. The rules are unspoken. That’s kinda how DAOs work. Except they use things like code written on blockchain to establish and enforce the rules.”</span>\n',
						)
						.typeString(
							'<span class="monitor-text--you">“But why do I need a DAO if I just want to play?”</span>\n',
						)
						.typeString(
							'<span class="monitor-text--hawkins">“You don’t, but you’ll thank me later if you form one now.”\n' +
							'“Alrighty, I trust you.” You pop your tape into the DATASETTE PLAYER on your desktop and press play. “Let’s do this.”\n</span>\n',
						)
						.callFunction(() => {
							setShowButton(true)
							updateQuestState({
								quest2Played: true,
							})
						})
						.start()
				}}
			/>
			{showButton && (
				<div style={{ width: '100%' }}>
					<span>
						Need Help? Check how to create a DAO in the{' '}
						<a style={{ color: '#54fad0' }} href={'https://docs.gamedao.co/'}>
							documentation.
						</a>
					</span>
				</div>
			)}
			{showButton && (
				<MonitorButton
					text={'next'}
					disabled={!hasQuest2Completed}
					onClick={() =>
						updateQuestState({
							screenIndex: 4,
						})
					}
				/>
			)}
		</>
	)
}

function QuestTwoComplete() {
	const { updateQuestState } = useQuestContext()
	return (
		<>
			<img width='65%' src={`${gateway}${IPFS_IMAGE_CID['datasette']}`} />
			<div style={{ width: '100%', margin: '1rem 0', fontSize: '1.5rem', fontWeight: 600 }}>
				You’ve successfully created a DAO! Nice job.
			</div>
			<MonitorButton
				text={'next quest'}
				onClick={() =>
					updateQuestState({
						screenIndex: 5,
					})
				}
			/>
		</>
	)
}

// Quest three
function QuestThree() {
	const [showButton, setShowButton] = useState(false)
	const { updateQuestState, hasQuest3Completed, quest3Played } = useQuestContext()
	return (
		<>
			<Typewriter
				onInit={(typewriter) => {
					typewriter
						.changeDelay(quest3Played ? 1 : 45)
						.typeString(
							'Rally thine allies!\n' + '// Invite two friends into your DAO\n\n',
						)
						.typeString(
							'Hawkins says, <span class="monitor-text--hawkins">“Now, choose a game to play.”</span>\n',
						)
						.typeString(
							'<span class="monitor-text--you">“I saw one I’d like to try.”</span>\n',
						)
						.typeString(
							'<span class="monitor-text--hawkins">“Oh, really, where?”</span>\nYou point at Gauntlet.\n',
						)
						.typeString(
							'<span class="monitor-text--hawkins">“That’s a fun game for sure!”</span> A big smile spreads across her face. <span class="monitor-text--hawkins">“You could play alone, but you’d be going up against all the enemies by yourself. Or you and I could play together… I call dibs on green wizard. We might do alright as partners, but that’s a four-player game. It’s more fun with friends, cos everyone works together to defeat the ghosts, demons, and thieves. Believe me, they can be tricky.”</span>\n',
						)
						.typeString(
							'<span class="monitor-text--you">“Hey, I have friends,”</span> you say. <span class="monitor-text--you">“I saw two of them around here somewhere.”</span>\n',
						)
						.typeString(
							'<span class="monitor-text--hawkins">“Great, call them over.”</span>\n',
						)
						.typeString('You tap away at your KEYBOARD and send the invites.\n')
						.callFunction(() => {
							setShowButton(true)
							updateQuestState({
								quest3Played: true,
							})
						})
						.start()
				}}
			/>
			{showButton && (
				<div style={{ width: '100%' }}>
					<span>
						Ask the community in{' '}
						<a style={{ color: '#54fad0' }} href={'#'}>
							discord
						</a>{' '}
						to join.
					</span>
				</div>
			)}
			{showButton && (
				<MonitorButton
					text={'next'}
					disabled={!hasQuest3Completed}
					onClick={() =>
						updateQuestState({
							screenIndex: 6,
						})
					}
				/>
			)}
		</>
	)
}

function QuestThreeComplete() {
	const { updateQuestState } = useQuestContext()
	return (
		<>
			<img width='65%' src={`${gateway}${IPFS_IMAGE_CID['keyboard']}`} />
			<div style={{ width: '100%', margin: '1rem 0', fontSize: '1.5rem', fontWeight: 600 }}>
				Great! You are not alone anymore.
			</div>
			<MonitorButton
				text={'next quest'}
				onClick={() =>
					updateQuestState({
						screenIndex: 7,
					})
				}
			/>
		</>
	)
}

// Quest four
function QuestFour() {
	const [showButton, setShowButton] = useState(false)
	const { updateQuestState, hasQuest4Completed, quest4Played } = useQuestContext()
	return (
		<>
			<Typewriter
				onInit={(typewriter) => {
					typewriter
						.changeDelay(quest4Played ? 1 : 45)
						.typeString(
							'Level up, warrior!\n' + '// Create a fundraising campaign\n',
						)
						.typeString(
							'After making the Gauntlet leaderboard, you all high-five and slap each other on the back.\n',
							'Without even thinking, you blurt,<span class="monitor-text--you">“I wish we could play as the bad guys.”</span>\n',
							'<span class="monitor-text--you">“That’s brilliant, dude!”</span> your friends say. And soon ideas start whizzing around faster than elf arrows. What if we could upgrade our weapons? What if we took the game online? What if we made an MMORPG where people could play as either good or bad guys?\n' +
							'It’s so very exciting.\n',
						)
						.typeString(
							'<span class="monitor-text--hawkins">“Green wizard needs food badly,” </span>Hawkins jokes.\n' +
							'So you all go to the food court to grab a slice of pizza and a Coke.\n' +
							'Your friends flood your MONITOR as they text you even more ideas. Others witness the online chatter, and come join your DAO. Everyone agrees your game should have gorgeous art, an intriguing story, and solid script…\n' +
							'You ask, <span class="monitor-text--you">“Can anyone draw, write, or code?”</span>\n',
						)
						.typeString('Nope. Crickets.\n')
						.typeString(
							'You sigh. <span class="monitor-text--you">“If only we had the money to hire people.”</span>\n',
						)
						.typeString(
							'<span class="monitor-text--hawkins">“This is a fabulous game idea,”</span> Hawkins says. <span class="monitor-text--hawkins">“You should totally create a fundraising campaign.”</span>\n',
						)
						.callFunction(() => {
							setShowButton(true)
							updateQuestState({
								quest4Played: true,
							})
						})
						.start()
				}}
			/>
			{showButton && (
				<div style={{ width: '100%' }}>
					<span>
						Check how to create a campaign in our{' '}
						<a style={{ color: '#54fad0' }} href={'https://docs.gamedao.co/'}>
							documentation.
						</a>
					</span>
				</div>
			)}
			{showButton && (
				<MonitorButton
					text={'next'}
					disabled={!hasQuest4Completed}
					onClick={() =>
						updateQuestState({
							screenIndex: 8,
						})
					}
				/>
			)}
		</>
	)
}

function QuestFourComplete() {
	const { updateQuestState } = useQuestContext()
	return (
		<>
			<img width='65%' src={`${gateway}${IPFS_IMAGE_CID['monitor']}`} />
			<div style={{ width: '100%', margin: '1rem 0', fontSize: '1.5rem', fontWeight: 600 }}>
				Well done, warrior! Your campaign is ready to be funded!
			</div>
			<MonitorButton
				text={'next quest'}
				onClick={() =>
					updateQuestState({
						screenIndex: 9,
					})
				}
			/>
		</>
	)
}

// Quest five
function QuestFive() {
	const [showButton, setShowButton] = useState(false)
	const { updateQuestState, hasQuest5Completed, quest5Played } = useQuestContext()
	return (
		<>
			<Typewriter
				onInit={(typewriter) => {
					typewriter
						.changeDelay(quest5Played ? 1 : 45)
						.typeString('Get cash in your stash!\n' + '// Collect campaign funds\n\n')
						.typeString(
							'<span class="monitor-text--you">“But I don’t know anything about fundraising,”</span> you groan. <span class="monitor-text--you">“It sounds awful.”</span>\n',
						)
						.typeString(
							'Your friends are already in love with the concept and pledge a quarter of what they have in their wallets to get started. Of course, you pitch in your share too. \n' +
							'And just like that, your DAO is already off to a healthy start.\n',
						)
						.typeString(
							'<span class="monitor-text--hawkins">“I think your game idea rocks!” </span>Hawkins offers you ten tokens to start developing it. <span class="monitor-text--hawkins">“We should tell all our friends about this game and see if they want to contribute.”</span>\n',
						)
						.typeString(
							'<span class="monitor-text--you">“People do that?”</span> you ask.\n',
						)
						.typeString(
							'<span class="monitor-text--hawkins">“They sure do, and it’s called crowd-funding.”</span> She laughs. <span class="monitor-text--hawkins">“I invest in all kinds of game projects. That’s why I like hanging out in the arcade. I’m gonna head back there now. But grab your JOYSTICK to navigate through the money maze without me. You got this.”</span>\n',
						)
						.callFunction(() => {
							setShowButton(true)
							updateQuestState({
								quest5Played: true,
							})
						})
						.start()
				}}
			/>
			{showButton && (
				<div style={{ width: '100%' }}>
					<span>
						Ask the community in{' '}
						<a style={{ color: '#54fad0' }} href={'#'}>
							discord
						</a>{' '}
						to fund your campaign
					</span>
				</div>
			)}
			{showButton && (
				<MonitorButton
					text={'next'}
					disabled={!hasQuest5Completed}
					onClick={() =>
						updateQuestState({
							screenIndex: 10,
						})
					}
				/>
			)}
		</>
	)
}

function QuestFiveComplete() {
	const { updateQuestState } = useQuestContext()
	return (
		<>
			<img width='65%' src={`${gateway}${IPFS_IMAGE_CID['joystick']}`} />
			<div style={{ width: '100%', margin: '1rem 0', fontSize: '1.5rem', fontWeight: 600 }}>
				Cha-ching! Your campaign has been funded.
			</div>
			<MonitorButton
				text={'next quest'}
				onClick={() =>
					updateQuestState({
						screenIndex: 11,
					})
				}
			/>
		</>
	)
}

// Quest six
function QuestSix() {
	const [showButton, setShowButton] = useState(false)
	const { updateQuestState, hasQuest6Completed, quest6Played } = useQuestContext()
	return (
		<>
			<Typewriter
				onInit={(typewriter) => {
					typewriter
						.changeDelay(quest6Played ? 1 : 45)
						.typeString(
							'Name your game!\n' +
							'Proof of existence\n' +
							'// Write proposal to withdraw funds\n\n',
						)
						.typeString(
							'A few weeks later you meet up with Hawkins in 80s world to thank her.\n' +
							'You gasp, <span class="monitor-text--you">“I can’t believe we raised all that money.”</span>\n',
						)
						.typeString(
							'<span class="monitor-text--hawkins">“I believe it! I knew you had a great idea,”</span> Hawkins says.<span class="monitor-text--hawkins">“And now that you’ve reached your campaign goals, you’ve proven that you not only can play games, but that you and your team are true visionaries.”\n' +
							'“And our DAO membership has grown beyond our wildest dreams!”\n' +
							'“All that’s left is to write a summary that introduces your game to even more people.”</span>\n',
						)
						.typeString(
							'<span class="monitor-text--you">“Oh, I don’t know how,”</span> you say.\n',
						)
						.typeString(
							'<span class="monitor-text--hawkins">“GameDAO will guide you through writing your proposal.”</span>\n<span class="monitor-text--you">“Really?”</span>\n<span class="monitor-text--hawkins">“Yup, really.”</span>\n<span class="monitor-text--you">“Then what?”</span>\n<span class="monitor-text--hawkins">“One step at a time, my friend.”</span> She hands you a model DELOREAN to remember her by. <span class="monitor-text--hawkins">“And there’s only one more to go.”</span>\n',
						)
						.callFunction(() => {
							setShowButton(true)
							updateQuestState({
								quest6Played: true,
							})
						})
						.start()
				}}
			/>
			{showButton && (
				<div style={{ width: '100%' }}>
					<span>
						Check how to create a withdrawal proposal in our{' '}
						<a style={{ color: '#54fad0' }} href={'https://docs.gamedao.co/'}>
							documentation.
						</a>
					</span>
				</div>
			)}
			{showButton && (
				<MonitorButton
					text={'next'}
					disabled={!hasQuest6Completed}
					onClick={() =>
						updateQuestState({
							screenIndex: 12,
						})
					}
				/>
			)}
		</>
	)
}

function QuestSixComplete() {
	const { updateQuestState } = useQuestContext()
	return (
		<>
			<img width='65%' src={`${gateway}${IPFS_IMAGE_CID['delorean']}`} />
			<div style={{ width: '100%', margin: '1rem 0', fontSize: '1.5rem', fontWeight: 600 }}>
				You're ready for the future. Your proposal is waiting for votes.
			</div>
			<MonitorButton
				text={'endgame'}
				onClick={() =>
					updateQuestState({
						screenIndex: 13,
					})
				}
			/>
		</>
	)
}

// Endgame
function Endgame() {
	const [showButton, setShowButton] = useState(false)
	const { updateQuestState, hasAllQuestsCompleted, endgamePlayed } = useQuestContext()
	return (
		<>
			<Typewriter
				onInit={(typewriter) => {
					typewriter
						.changeDelay(endgamePlayed ? 1 : 45)
						.typeString(
							'~ Endgame ~\n' +
							'Victory is yours!\n' +
							'Proposal passes and funds are transferred\n\n',
						)
						.typeString(
							'Hawkins says, <span class="monitor-text--hawkins">“You have proven to be a skillful player.”</span> You smile. <span class="monitor-text--you">“Why thank you, ma’am.”</span>\n',
						)

						.typeString(
							'<span class="monitor-text--hawkins">“Are you ready for the last step?”</span>\n',
						)
						.typeString(
							'<span class="monitor-text--you">“Absolutely, let’s go!”</span>\n',
						)
						.typeString(
							'<span class="monitor-text--hawkins">“Now you’ll pitch your proposal to your DAO so everyone can vote. If a majority approves, your funds get released so you can hire the talent you need to start building your game.”</span>\n',
						)
						.typeString(
							'<span class="monitor-text--you">“And that’s how we create the game of our dreams?”</span>\n',
						)
						.typeString(
							'<span class="monitor-text--hawkins">“That’s how.”</span> She winks. <span class="monitor-text--hawkins">“You use your DAO.”</span>\n',
						)
						.callFunction(() => {
							setShowButton(true)
							updateQuestState({
								endgamePlayed: true,
							})
						})
						.start()
				}}
			/>
			{showButton && (
				<div style={{ width: '100%' }}>
					<span>
						Ask the community in{' '}
						<a style={{ color: '#54fad0' }} href={'#'}>
							discord
						</a>{' '}
						to vote on your proposal.
					</span>
				</div>
			)}
			{showButton && (
				<MonitorButton
					text={'next'}
					disabled={!hasAllQuestsCompleted}
					onClick={() =>
						updateQuestState({
							screenIndex: 14,
						})
					}
				/>
			)}
		</>
	)
}

function EndgameComplete() {
	const [showButton, setShowButton] = useState(false)
	const { updateQuestState, endgameFormPlayed } = useQuestContext()
	return (
		<>
			<Typewriter
				onInit={(typewriter) => {
					typewriter
						.changeDelay(endgameFormPlayed ? 1 : 45)
						.typeString(
							'Now you’re really a player.\n' +
							'\n' +
							'You created a team of allies.\n' +
							'You raised all the monies.\n' +
							'You wrote a solid proposal.\n' +
							'You got your project approved.\n' +
							'Now you’ve got the cash to get to work.\n' +
							'\n' +
							'Hawkins is proud.\n' +
							'Your DAO is excited.\n' +
							'You should be too.\n' +
							'\n' +
							'Congratulations on your successful campaign.\n' +
							'\n' +
							'But wait, there’s more!\n' +
							'\n' +
							'Hawkin’s has a special gift for you.\n' +
							'She’s still working on encrypting it though.\n' +
							'Once she’s done, she’ll send a message to let you know.\n' +
							'\n' +
							'Fill out this form so she can keep in touch:\n',
						)
						.callFunction(() => {
							setShowButton(true)
							updateQuestState({
								endgameFormPlayed: true,
							})
						})
						.start()
				}}
			/>
			{showButton && (
				<MonitorButton
					text={'SIGN UP FOR REWARD'}
					onClick={() =>
						window
							.open('https://dsgl4ddr6q4.typeform.com/to/NRkTEtFl', '_blank')
							.focus()
					}
				/>
			)}
		</>
	)
}

const screenSelect = [
	<Intro />,
	<QuestOne />,
	<QuestOneComplete />,
	<QuestTwo />,
	<QuestTwoComplete />,
	<QuestThree />,
	<QuestThreeComplete />,
	<QuestFour />,
	<QuestFourComplete />,
	<QuestFive />,
	<QuestFiveComplete />,
	<QuestSix />,
	<QuestSixComplete />,
	<Endgame />,
	<EndgameComplete />,
]

function QuestScreenSelect() {
	const { screenIndex } = useQuestContext()
	return screenSelect[screenIndex] ?? null
}

export function TypedText() {
	return (
		<div
			style={{
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				minHeight: '100%',
				overflowY: 'auto',
			}}
		>
			<QuestScreenSelect />
		</div>
	)
}
