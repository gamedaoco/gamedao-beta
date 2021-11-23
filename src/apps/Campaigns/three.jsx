import * as React from 'react'
import { Suspense, useState, useEffect } from 'react'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib/controls/OrbitControls'
import { Canvas } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'

import { Box } from '../../components'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EventManager, ReactThreeFiber, useFrame, useThree } from '@react-three/fiber'

const Model = () => {
	const gltf = useLoader(GLTFLoader, '/assets/models/tangram/Tangram.gltf')
	return (
		<>
			<primitive object={gltf.scene} scale={0.7} />
		</>
	)
}

const Model2 = () => {
	const gltf = useLoader(GLTFLoader, '/assets/models/binas_house/scene.gltf')
	return (
		<>
			<primitive object={gltf.scene} scale={0.4} />
		</>
	)
}

export function Renderer() {
	return (
		<Box sx={{ zIndex: '100000 !important', height: '320px' }}>
			<Canvas invalidateFrameloop={true}>
				<Suspense fallback={null}>
					<Model />
					<OrbitControls
						zoom={1}
						position={[0, 0, 0]}
						rotateSpeed={1}
						autoRotate={true}
					/>
				</Suspense>
			</Canvas>
		</Box>
	)
}

export const OrbitControls = React.forwardRef(
	(
		{
			makeDefault,
			camera,
			regress,
			domElement,
			enableDamping = true,
			onChange,
			onStart,
			onEnd,
			...restProps
		},
		ref
	) => {
		const invalidate = useThree(({ invalidate }) => invalidate)
		const defaultCamera = useThree(({ camera }) => camera)
		const gl = useThree(({ gl }) => gl)
		const events = useThree(({ events }) => events)
		const set = useThree(({ set }) => set)
		const get = useThree(({ get }) => get)
		const performance = useThree(({ performance }) => performance)
		const explCamera = camera || defaultCamera
		const explDomElement =
			domElement || (typeof events.connected !== 'boolean' ? events.connected : gl.domElement)
		const controls = React.useMemo(() => new OrbitControlsImpl(explCamera), [explCamera])

		useFrame(() => {
			if (controls.enabled) controls.update()
		})

		React.useEffect(() => {
			const callback = (e) => {
				invalidate()
				if (regress) performance.regress()
				if (onChange) onChange(e)
			}

			controls.connect(explDomElement)
			controls.addEventListener('change', callback)

			if (onStart) controls.addEventListener('start', onStart)
			if (onEnd) controls.addEventListener('end', onEnd)

			return () => {
				controls.removeEventListener('change', callback)
				if (onStart) controls.removeEventListener('start', onStart)
				if (onEnd) controls.removeEventListener('end', onEnd)
				controls.dispose()
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [explDomElement, onChange, onStart, onEnd, regress, controls, invalidate])

		React.useEffect(() => {
			if (makeDefault) {
				// @ts-expect-error new in @react-three/fiber@7.0.5
				const old = get().controls
				// @ts-expect-error new in @react-three/fiber@7.0.5
				set({ controls })
				// @ts-expect-error new in @react-three/fiber@7.0.5
				return () => set({ controls: old })
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [makeDefault, controls])

		return (
			<primitive ref={ref} object={controls} enableDamping={enableDamping} {...restProps} />
		)
	}
)
