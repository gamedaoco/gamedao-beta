import * as THREE from 'three'
import * as React from 'react'
import { Suspense, useLayoutEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, useFBX, Environment, Stage, OrbitControls } from '@react-three/drei'
import ModelJSX from './Panda'
import Fireflies from './Fireflies'
import { a as three } from '@react-spring/three'

export default function Koijam() {
	return (
		<Canvas dpr={[1, 2]} shadows camera={{ zoom: 0.5, fov: 45, position: [-1, 1, -2.5] }}>
			<Suspense fallback={null}>
				<Environment preset="dawn" />
				<three.pointLight position={[10, 10, 10]} intensity={1.5} color={'#f0f0f0'} />

				{/*<Stage> will center and light the contents, create ground-shadows, and zoom the camera */}
				<ModelJSX scale={0.55} position={[-1, -0.7, 0]} />
				<Fireflies count={50} />
			</Suspense>
		</Canvas>
	)
}
