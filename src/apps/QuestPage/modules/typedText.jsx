import Typewriter from 'typewriter-effect'
import { useState } from 'react'
import { MonitorButton } from './monitorButton'
import { gateway } from '../../lib/ipfs'
import { ipfsImageCIDs } from './ipfsImageCIDs'

function Intro() {
	const [showButton, setShowButton] = useState(false)
	return (
		<>
			<Typewriter
				onInit={(typewriter) => {
					typewriter
						.changeDelay(25)
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
							'Fear not. Follow Hawkins on these six quests, and she’ll help you get there.\n',
						)
						.callFunction(() => setShowButton(true))
						.start()
				}}
			/>
			{showButton && <MonitorButton text={'play now'} />}
		</>
	)
}

function QuestOne() {
	const [showButton, setShowButton] = useState(false)
	return (
		<>
			<Typewriter
				onInit={(typewriter) => {
					typewriter
						.changeDelay(25)
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
							'<span class="monitor-text--hawkins">“Ah, yes, that’s a common problem,”</span> she says. <span class="monitor-text--hawkins--you">“Let me show you to the faucet”\n</span>',
						)
						.callFunction(() => setShowButton(true))
						.start()
				}}
			/>
			{showButton && (
				<div style={{ width: '100%' }}>
					<span>
						Need Help? Check how to get ZERO tokens in our{' '}
						<a style={{ color: '#54fad0' }} href={'#'}>
							documentation.
						</a>
					</span>
				</div>
			)}
			{showButton && <MonitorButton text={'next'} />}
		</>
	)
}

function QuestOneComplete() {
	return (
		<>
			<img width='65%' src={`${gateway}${ipfsImageCIDs['cassette']}`} />
			<div style={{ width: '100%', margin: '1rem 0', fontSize: '1.5rem', fontWeight: 600 }}>
				YEAH! Well done, your wallet contains tokens now!
			</div>
			<MonitorButton text={'next quest'} />
		</>)
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
			<QuestOne />
		</div>
	)
}
