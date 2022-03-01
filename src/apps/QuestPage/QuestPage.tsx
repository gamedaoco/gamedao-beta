// import { QuestItem } from './modules/questItem'
import './textOverride.css'
// import { Canvas, useFrame, useThree } from '@react-three/fiber'
// import useScrollPosition from '@react-hook/window-scroll'
import { useRef, useMemo, useEffect, createRef, useState } from 'react'
import { useComponentSize } from "react-use-size";
// import { Parallax, ParallaxLayer, IParallax } from '@react-spring/parallax'

import { Typography,  Box, Paper, Stack, useMediaQuery } from '../../components'
import { useQuestContext } from '../../context/Quest'
import { gateway } from '../lib/ipfs'

import { ipfsImageCIDs } from "./modules/ipfsImageCIDs"
import { questStory } from "./modules/questStory"



export function AnimatedHeader(props){
	const imageNum = props.questProgress
	const [animated, setAnimated] = useState(false)

	let frame = ""

	if(animated){
		frame = ".1"
	}

	const path = "header"+imageNum+frame

	useEffect( () => {
		if(imageNum === "1" || imageNum === "2" || imageNum === "3"){
			return
		}
		const id = setInterval( () => {
			setAnimated(!animated)
		}, 1000)
		return () => clearInterval(id)
	})

	return <Box
		sx={{ 
			height: '60vh',
			backgroundImage: `url(${gateway}${ipfsImageCIDs[path]})`,
			backgroundPosition: "center",
			backgroundSize: "contain",
			backgroundRepeat: "no-repeat"
		}}
	/>
}

function MonitorStep(props){
	const { children, id, questState, onClick } = props

	const hasCompleted = questState[`hasQuest${id}Completed`]
	const lastStepCompleted = !hasCompleted && questState[`hasQuest${id-1}Completed`]
	const isActive = !hasCompleted && lastStepCompleted

	console.log(hasCompleted, isActive)
	
	return <Box onClick={ (e) => { onClick(e) } } style={{ position: "relative" }}>
		{ hasCompleted && <img width="100%" src={`${gateway}${ipfsImageCIDs["stepDone"]}`} /> }

		{ isActive && <img width="100%" src={`${gateway}${ipfsImageCIDs["stepActive"]}`} /> }
		{ isActive && <span style={{ position: "absolute" }}>{children}</span> }

		{ (!hasCompleted && !lastStepCompleted) && <img width="100%" src={`${gateway}${ipfsImageCIDs["stepDisabled"]}`} /> }
		{ (!hasCompleted && !lastStepCompleted) && <span style={{ position: "absolute" }}>{children}</span> }
	</Box>
}


function MonitorButton(props){
	const { children, disabled } = props
	
	return <Box style={{ position: "relative", maxWidth: "304px", margin: "0 auto" }}>
		{ !disabled && <img width="100%" src={`${gateway}${ipfsImageCIDs["defaultButton"]}`} /> }
		{ disabled  && <img width="100%" src={`${gateway}${ipfsImageCIDs["disabledButton"]}`} /> }
		<span style={{ width: "100%", color: "black", top: "33%", left: "0%", position: "absolute", textAlign: "center" }}>{children}</span>
	</Box>
}
  
export function QuestPage() {
	const questState = useQuestContext()
	const { ref: screenRef, height, width } = useComponentSize();
	const isLarge = useMediaQuery('(min-width:1300px)');
	const [progress, setProgress] = useState('1')
	const headerQuestProgress = progress
	const currentStory = questStory[progress]
	const contentScale = (!isLarge && width < 400) ? 0.8 : 1.0

	console.log(questState)
	console.log(width, height)
	
	return (
	<>
		<Stack spacing={4}>
			<AnimatedHeader questProgress={headerQuestProgress} />

			<Box
				sx={{
					position: "relative",
				}}
			>
				{/* Screen */}
				<img
					src={`${gateway}${ipfsImageCIDs["screen"]}`}
					ref={screenRef}
					alt="monitor"
					width="100%"
				/>

				<Box
					sx={{
						margin: "0 auto",
						display: "flex",
						position: "absolute",
						top: "9%",
						bottom: "9%",
						left: "6%",
						right: "9%",
					}}
				>
					<Stack sx={{ transform: `scale(${contentScale})`, margin: "auto" }}>
						{[0,1,2,3,4,5].map( (id) => {
							return <MonitorStep id={id} questState={questState} onClick={ () => { console.log(id); setProgress(id.toString()) }} /> 
						})}
					</Stack>

					<Box 
					className="questMonitorTextContainer"
					sx={{ 
						width: "100%",
						overflowX: "hidden",
						transform: `scale(${contentScale})`,
					}}>
						<span style={{ fontFamily: "monospace", color: "#54fad0" }}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</span>
						<MonitorButton>OK!</MonitorButton>
						<MonitorButton disabled >OK!</MonitorButton>
						<img width="100%" src={`${gateway}${ipfsImageCIDs["cassette"]}`} />
					</Box>
				</Box>
				

				{/* Scanlines */}
				<img
					src={`${gateway}${ipfsImageCIDs["scanlines"]}`}
					alt="scanlines"
					width="100%"
					style={{
						pointerEvents: "none",
						position: "absolute",
						top: "5%",
						left: "0%"
					}}
				/>
				

			</Box>
		</Stack>
		</>
	)
}



/*

				<QuestItem
					active={questState.hasQuest1Completed}
					questImage={`${gateway}${ipfsImageCIDs["joystick"]}`}
					title={'Quest #1'}
					story={'Connect your wallet and get your personal access key'}
					
				/>

				<QuestItem
					active={questState.hasQuest2Completed}
					questImage={`${gateway}${ipfsImageCIDs["datasette"]}`}
					title={'Quest #2'}
					story={'Connect your wallet and get your personal access key'}
					
				/>

				<QuestItem
					active={questState.hasQuest3Completed}
					questImage={`${gateway}${ipfsImageCIDs["monitor"]}`}
					title={'Quest #3'}
					story={'Connect your wallet and get your personal access key'}
					
				/>

				<QuestItem
					active={questState.hasQuest4Completed}
					questImage={`${gateway}${ipfsImageCIDs["cassette"]}`}
					title={'Quest #4'}
					story={'Connect your wallet and get your personal access key'}
					
				/>

				<QuestItem
					active={questState.hasQuest5Completed}
					questImage={`${gateway}${ipfsImageCIDs["keyboard"]}`}
					title={'Quest #5'}
					story={'Connect your wallet and get your personal access key'}
					
				/>

				<QuestItem
					active={questState.hasQuest6Completed}
					questImage={`${gateway}${ipfsImageCIDs["delorean"]}`}
					title={'Quest #6'}
					story={'Connect your wallet and get your personal access key'}
				/>

				*/