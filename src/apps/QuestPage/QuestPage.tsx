import './textOverride.css'
import { useEffect, useState } from 'react'
import { useComponentSize } from 'react-use-size'

import { Box, Stack } from '../../components'
import { useQuestContext } from '../../context/Quest'
import { gateway } from '../lib/ipfs'

import { ipfsImageCIDs } from './modules/ipfsImageCIDs'
import { TypedText } from './modules/typedText'

export function AnimatedHeader({ questProgress }) {
	const [animated, setAnimated] = useState(false)

	useEffect(() => {
		const id = setInterval(() => {
			setAnimated(!animated)
		}, 1000)

		return () => clearInterval(id)
	})

	return <Box
		sx={{
			height: '60vh',
			backgroundImage: `url(${gateway}${ipfsImageCIDs[`header${questProgress}${animated ? '' : '.1'}`]})`,
			backgroundPosition: 'center',
			backgroundSize: 'contain',
			backgroundRepeat: 'no-repeat',
		}}
	/>
}

function MonitorStep({ id, questState, onClick }) {

	const hasCompleted = questState[`hasQuest${id}Completed`]
	const lastStepCompleted = !hasCompleted && questState[`hasQuest${id - 1}Completed`]
	const isActive = !hasCompleted && lastStepCompleted

	return <Box onClick={(e) => {
		onClick(e)
	}} style={{ position: 'relative' }}>
		{hasCompleted && <img width='100%' src={`${gateway}${ipfsImageCIDs['stepDone']}`} />}

		{isActive && <img width='100%' src={`${gateway}${ipfsImageCIDs['stepActive']}`} />}
		{isActive && <span style={{
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-54%, -58%)',
			color: 'black',
			fontSize: '1.5rem',
			fontWeight: 600,
		}}>{id}</span>}

		{(!hasCompleted && !lastStepCompleted) &&
			<img width='100%' src={`${gateway}${ipfsImageCIDs['stepDisabled']}`} />}
		{(!hasCompleted && !lastStepCompleted) &&
			<span style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-54%, -58%)',
				color: '#54fad0',
				fontSize: '1.5rem',
				fontWeight: 600,
			}}>{id}</span>}
	</Box>
}


export function QuestPage() {
	const questState = useQuestContext()
	const { ref: screenRef, width } = useComponentSize()
	const [progress, setProgress] = useState(0)
	const contentScale = width * (width < 850 ? 0.001 : 0.0008)

	return (
		<>
			<Stack spacing={4}>
				<AnimatedHeader questProgress={progress} />

				<Box
					sx={{
						position: 'relative',
					}}
				>
					{/* Screen */}
					<img
						src={`${gateway}${ipfsImageCIDs['screen']}`}
						ref={screenRef}
						alt='monitor'
						width='100%'
					/>

					<Box
						sx={{
							margin: '0 auto',
							display: 'flex',
							position: 'absolute',
							top: '9%',
							bottom: '9%',
							left: '6%',
							right: '9%',
						}}
					>
						<Stack sx={{ transform: `scale(${contentScale})`, margin: 'auto' }}>
							{[1, 2, 3, 4, 5, 6].map((id) => {
								return <MonitorStep id={id} questState={questState} onClick={() => {
									console.log(id)
									setProgress(id)
								}} />
							})}
						</Stack>

						<Box
							className='questMonitorTextContainer'
							sx={{
								width: '100%',
								overflowX: 'hidden',
								transform: `scale(${contentScale})`,
							}}>
							<span style={{
								width: '100%',
								fontFamily: 'monospace',
								color: '#54fad0',
								whiteSpace: 'pre-line',
							}}><TypedText /></span>
						</Box>
					</Box>


					{/* Scanlines */}
					<img
						src={`${gateway}${ipfsImageCIDs['scanlines']}`}
						alt='scanlines'
						width='100%'
						style={{
							pointerEvents: 'none',
							position: 'absolute',
							top: '5%',
							left: '0%',
						}}
					/>
				</Box>
			</Stack>
		</>
	)
}


// <MonitorButton>OK!</MonitorButton>
// <MonitorButton disabled>OK!</MonitorButton>
// <img width='100%' src={`${gateway}${ipfsImageCIDs['cassette']}`} />