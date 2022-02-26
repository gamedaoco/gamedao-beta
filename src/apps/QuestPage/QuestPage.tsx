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

function MonitorButton(props){
	const { children, disabled } = props
	
	return <Box style={{ position: "relative" }}>
		<img src={`${gateway}${ipfsImageCIDs["defaultButton"]}`} />
		{ disabled && <img src={`${gateway}${ipfsImageCIDs["disabledButton"]}`} /> }
		<span style={{ position: "absolute" }}>{children}</span>
	</Box>
}
  
export function QuestPage() {
	const questState = useQuestContext()
	const isLarge = useMediaQuery('(min-width:1300px)');
	const headerQuestProgress = "5" // 2,3,4,5
	const { ref: screenRef, height, width } = useComponentSize();

	console.log(questState)
	console.log(width, height)


	/*
	useEffect( () => {
		let myHover3D = new Hover3D(".questicon");
	}, [])
	*/

	/* sync parallax layer with scrollbars
	const pos = useScrollPosition(24)
	const parallax = useRef<IParallax>(null!)

	useEffect( () => {
		if(!parallax.current) return
		document.getElementById('parallax').onwheel = function(){ return false; }
		document.getElementById("parallax").scrollTo(0, pos)
	}, [pos])
	*/
	
	return (
	<>
		{/*<Parallax id={"parallax"} ref={parallax} style={{ width: "66vw", height: '300%', overflow: "hidden" }} pages={3}>
			<ParallaxLayer offset={1} style={{ pointerEvents: 'none' }}>
			</ParallaxLayer>

			<ParallaxLayer offset={1} speed={1.5} style={{ pointerEvents: 'none' }}>
				<img className="float" src={delorean} style={{ rotate: "26deg" , width: '33%', marginLeft: "50px" }} />
			</ParallaxLayer>
			
			<ParallaxLayer offset={3} speed={-0.5} style={{ pointerEvents: 'none' }}>
				
			</ParallaxLayer>

		</Parallax>*/}

		<Stack spacing={4}>
			<AnimatedHeader questProgress={headerQuestProgress} />

			<Box
				sx={{
					position: "relative",
					width: '100%',
					height: '90vh',
				}}
			>
				{/* Screen */}
				<Box
					ref={screenRef}
					sx={{ 
						position: "relative",
						height: '100%',
						width: "100%",
						backgroundImage: `url(${gateway}${ipfsImageCIDs["screen"]})`,
						backgroundPosition: "center",
						backgroundSize: "contain",
						backgroundRepeat: "no-repeat",
						overflow: "hidden"
					}}
				>
					<Box
						sx={{
							margin: "0 auto",
							width: isLarge ? "calc( 70% )" : "calc( 90% )",
							height: "80%",
							marginTop: "10%",
							display: "flex",
						}}
					>
						<Stack sx={{ margin: "auto" }}>
							<img src={`${gateway}${ipfsImageCIDs["step0"]}`} />
						</Stack>

						<Box sx={{ 
							width: "100%",
							overflowY: "scroll",
							overflowX: "hidden"
						}}>
							<span style={{ fontFamily: "monospace", color: "#54fad0" }}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</span>
							<MonitorButton>OK!</MonitorButton>
							<MonitorButton disabled >OK!</MonitorButton>
							<img src={`${gateway}${ipfsImageCIDs["cassette"]}`} />
						</Box>
					</Box>
				</Box>

				{/* Scanlines */}
				<Box
					sx={{
						top: "0px",
						right: "0px",
						position: "absolute",
						pointerEvents: "none",
						height: '100%',
						width: '100%',
						backgroundImage: `url(${gateway}${ipfsImageCIDs["scanlines"]})`,
						backgroundPosition: "center",
						backgroundSize: "contain",
						backgroundRepeat: "no-repeat"
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