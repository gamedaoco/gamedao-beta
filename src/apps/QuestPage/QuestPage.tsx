import { QuestItem } from './modules/questItem'
import './textOverride.css'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import useScrollPosition from '@react-hook/window-scroll'
import { Parallax, ParallaxLayer, IParallax } from '@react-spring/parallax'
import { useRef, useMemo, useEffect, createRef, useState } from 'react'

import { Typography,  Box, Paper, Stack } from '../../components'
import { useQuestContext } from '../../context/Quest'

import Headerscene from "./modules/Headerscene"
import { Hover3D } from './modules/Hover3D'

import joystick from './modules/resources/joystick_s.png'
import datasette from './modules/resources/datasette_s.png'
// import monitor from './modules/resources/monitor_s.png'
// import cassette from './modules/resources/delorean_s.png'
// import keyboard from './modules/resources/keyboard_s.png'
import delorean from './modules/resources/delorean_s.png'

  
export function QuestPage() {
	const questState = useQuestContext()

	useEffect( () => {
		let myHover3D = new Hover3D(".questicon");
	}, [])

	const pos = useScrollPosition(24)
	const parallax = useRef<IParallax>(null!)

	useEffect( () => {
		if(!parallax.current) return
		document.getElementById('parallax').onwheel = function(){ return false; }
		document.getElementById("parallax").scrollTo(0, pos)
	}, [pos])

	/*
	useEffect( () => {
		if(!parallax.current) return
		// scroll to page 2 at 500px
		if(pos > 500) parallax.current.scrollTo(2)
	}, [pos])
	*/
	

	return (
	<>
		<Parallax id={"parallax"} ref={parallax} style={{ width: "66vw", height: '200%', overflow: "hidden" }} pages={3}>
			<ParallaxLayer offset={1} style={{ pointerEvents: 'none' }}>
			</ParallaxLayer>

			<ParallaxLayer offset={1} speed={1.5} style={{ pointerEvents: 'none' }}>
				<img className="float" src={delorean} style={{ rotate: "26deg" ,width: '40%', marginTop: "-100px" }} />
			</ParallaxLayer>
			
			<ParallaxLayer offset={3} speed={-0.5} style={{ pointerEvents: 'none' }}>
				
			</ParallaxLayer>

		</Parallax>
		<Stack spacing={4}>
			<Box
				sx={{ height: '60vh' }}
			>
				<Headerscene/>
			</Box>

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
					activeImage={joystick}
					title={'Quest #1'}
					description={'Connect your wallet and get your personal access key'}
					rtl={false}
				/>
				<div className="quest-page__divider--1" />
				<QuestItem
					active={questState.hasQuest2Completed}
					activeImage={datasette}
					title={'Quest #2'}
					description={'Connect your wallet and get your personal access key'}
					rtl={true}
				/>
				<div className="quest-page__divider--2" />
				<QuestItem
					active={questState.hasQuest3Completed}
					activeImage={datasette}
					title={'Quest #3'}
					description={'Connect your wallet and get your personal access key'}
					rtl={false}
				/>
				<div className="quest-page__divider--3" />
				<QuestItem
					active={questState.hasQuest4Completed}
					activeImage={datasette}
					title={'Quest #4'}
					description={'Connect your wallet and get your personal access key'}
					rtl={true}
				/>
				<div className="quest-page__divider--4" />
				<QuestItem
					active={questState.hasQuest5Completed}
					activeImage={datasette}
					title={'Quest #5'}
					description={'Connect your wallet and get your personal access key'}
					rtl={false}
				/>
				<div className="quest-page__divider--6" />
				<QuestItem
					active={questState.hasQuest6Completed}
					last={true}
					activeImage={delorean}
					title={'Quest #6'}
					description={'Connect your wallet and get your personal access key'}
					rtl={true}
				/>
			</Stack>
		</Stack>
		</>
	)
}
