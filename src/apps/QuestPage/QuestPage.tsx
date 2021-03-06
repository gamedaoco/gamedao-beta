import './textOverride.css'
import { Fragment, useEffect, useState } from 'react'
import { useComponentSize } from 'react-use-size'

import { Box, Stack } from '../../components'
import { useQuestContext } from '../../context/Quest'
import { gateway } from '../lib/ipfs'

import { IPFS_IMAGE_CID } from './modules/IPFS_IMAGE_CID'
import { TypedText } from './modules/typedText'

export function AnimatedHeader() {
	const [animated, setAnimated] = useState(false)
	const questState = useQuestContext()

	useEffect(() => {
		const id = setInterval(() => {
			setAnimated(!animated)
		}, 1500)
		return () => clearInterval(id)
	})

	return (
		<Box
			component={'img'}
			alt="hero"
			src={`${gateway}${
				IPFS_IMAGE_CID[
					`header${Math.trunc(questState.screenIndex / 2)}${animated ? '' : '.1'}`
				]
			}`}
			sx={{
				width: '100%',
			}}
		/>
	)
}

function MonitorStep({ id }) {
	const questState = useQuestContext()
	const hasCompleted = questState[`hasQuest${id}Completed`]
	const isActive = !hasCompleted && questState[`quest${id}Played`]

	return (
		<Box
			className="monitor-button"
			onClick={(e) => {
				if (hasCompleted) {
					questState.updateQuestState({ screenIndex: id * 2 })
				}
			}}
			style={{ position: 'relative' }}
		>
			{hasCompleted && <img width="100%" src={`${gateway}${IPFS_IMAGE_CID['stepDone']}`} />}

			{isActive && <img width="100%" src={`${gateway}${IPFS_IMAGE_CID['stepActive']}`} />}
			{isActive && (
				<span
					style={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-54%, -58%)',
						color: 'black',
						fontSize: '1.5rem',
						fontWeight: 600,
					}}
				>
					{id}
				</span>
			)}

			{!hasCompleted && !isActive && (
				<img width="100%" src={`${gateway}${IPFS_IMAGE_CID['stepDisabled']}`} />
			)}
			{!hasCompleted && !isActive && (
				<span
					style={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-54%, -58%)',
						color: '#54fad0',
						fontSize: '1.5rem',
						fontWeight: 600,
					}}
				>
					{id}
				</span>
			)}
		</Box>
	)
}

export function QuestPage() {
	const { ref: screenRef, width } = useComponentSize()
	const contentScale = width * (width < 850 ? 0.001 : 0.0008)

	return (
		<>
			<Stack spacing={4} id="quest-page">
				<AnimatedHeader />

				<Box
					sx={{
						position: 'relative',
					}}
				>
					{/* Screen */}
					<img
						src={`${gateway}${IPFS_IMAGE_CID['screen']}`}
						ref={screenRef}
						alt="monitor"
						width="100%"
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
						<Stack sx={{ transform: `scale(${contentScale / 0.9})`, margin: 'auto' }}>
							{[1, 2, 3, 4, 5, 6].map((id) => {
								return (
									<Fragment key={id}>
										<MonitorStep id={id} />
									</Fragment>
								)
							})}
						</Stack>

						<Box
							className="questMonitorTextContainer"
							sx={{
								width: '100%',
								overflowX: 'hidden',
								transform: `scale(${contentScale})`,
							}}
						>
							<span
								style={{
									width: '100%',
									fontFamily: 'monospace',
									color: '#54fad0',
									whiteSpace: 'pre-line',
								}}
							>
								<TypedText />
							</span>
						</Box>
					</Box>

					{/* Scanlines */}
					<img
						src={`${gateway}${IPFS_IMAGE_CID['scanlines']}`}
						alt="scanlines"
						width="100%"
						style={{
							pointerEvents: 'none',
							position: 'absolute',
							top: '5',
							left: '0',
							padding: '7% 6%',
						}}
					/>
				</Box>
			</Stack>
		</>
	)
}
