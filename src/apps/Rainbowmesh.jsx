import { Stars } from '@react-three/drei'
import { noise } from '../utils/perlin'
import { useFrame, Canvas } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const perlin3 = noise.perlin3

export function ARainbowmesh() {
	return (
		<Canvas camera={{ zoom: 40, position: [0, 0, 500] }}>
			<Suspense fallback={'Loading...'}>
				<Light />
				<Terrain />
				<Stars />
			</Suspense>
		</Canvas>
	)
}

export function Rainbowmesh() {
	return (
		<Canvas camera={{ position: [0, 2, 10], fov: 75 }}>
			<ambientLight />
			<Anim />
			<Stars />
		</Canvas>
	)
}

const Light = () => {
	const FakeSphere = () => (
		<mesh>
			<sphereBufferGeometry attach="geometry" args={[0.7, 50, 50]} />
			<meshBasicMaterial attach="material" color={0xfff1ef} />
		</mesh>
	)

	const [light1, setLight1] = useState()
	const [light2, setLight2] = useSTate()

	return (
		<group>
			<FakeSphere />
			<ambientLight ref={setLight1} position={[0, 4, 0]} intensity={0.3} />

			<directionalLight intensity={0.5} position={[0, 0, 0]} color={0xffffff} />

			<pointLight ref={setLight1} intensity={1} position={[-6, 3, -6]} color={0xffcc77}>
				{light1 && <pointLightHelper args={[light1]} />}
			</pointLight>

			<pointLight ref={setLight2} intensity={1} position={[6, 3, 6]} color={0xffcc77}>
				{light2 && <pointLightHelper args={[light2]} />}
			</pointLight>
		</group>
	)
}

const Terrain = () => {
	const mesh = useRef()

	function didUpdate(mesh) {
		mesh.current = mesh

		const geometry = arg.geometry

		noise.seed(Math.random())
		let pos = geometry.getAttribute('position')
		let pa = pos.array
		const hVerts = geometry.parameters.heightSegments + 1
		const wVerts = geometry.parameters.widthSegments + 1
		for (let j = 0; j < hVerts; j++) {
			for (let i = 0; i < wVerts; i++) {
				const ex = 1.1
				pa[3 * (j * wVerts + i) + 2] =
					(noise.simplex2(i / 100, j / 100) +
						noise.simplex2((i + 200) / 50, j / 50) * Math.pow(ex, 1) +
						noise.simplex2((i + 400) / 25, j / 25) * Math.pow(ex, 2) +
						noise.simplex2((i + 600) / 12.5, j / 12.5) * Math.pow(ex, 3) +
						noise.simplex2((i + 800) / 6.25, j / 6.25) * Math.pow(ex, 4)) /
					2
			}
		}

		pos.needsUpdate = true
	}

	// Raf loop
	useFrame(() => {
		mesh.current.rotation.z += 0.1
	})

	return (
		<mesh ref={mesh} onUpdate={didUpdate} rotation={[-Math.PI / 2, 0, 0]}>
			<planeBufferGeometry attach="geometry" args={[25, 25, 75, 75]} />
			<meshPhongMaterial
				attach="material"
				color={'hotpink'}
				specular={'hotpink'}
				shininess={3}
				smoothShading
			/>
		</mesh>
	)
}

function MeshAnim({
	position,
	rotation,
	grid: { width, height, sep },
	colorOfXYZT,
	zOfXYT,
	anim: { init, update },
}) {
	let t = init // time

	// vertex buffer
	let { positions, colors, normals } = useMemo(() => {
		let positions = [],
			colors = [],
			normals = []

		for (let yi = 0; yi < height; yi++) {
			for (let xi = 0; xi < width; xi++) {
				let x = sep * (xi - (width - 1) / 2)
				let y = sep * (yi - (height - 1) / 2)
				let z = zOfXYT(x, y, t)
				positions.push(x, y, z)

				let color = colorOfXYZT(x, y, z, t)
				colors.push(color.r, color.g, color.b)
				normals.push(0, 0, 1)
			}
		}

		return {
			positions: new Float32Array(positions),
			colors: new Float32Array(colors),
			normals: new Float32Array(normals),
		}
	}, [width, height, sep, zOfXYT, colorOfXYZT, t])

	// index buffer
	let indices = useMemo(() => {
		let indices = []
		let i = 0
		for (let yi = 0; yi < height - 1; yi++) {
			for (let xi = 0; xi < width - 1; xi++) {
				indices.push(i, i + 1, i + width + 1) // bottom right tri
				indices.push(i + width + 1, i + width, i) // top left tri
				i++
			}
			i++
		}

		return new Uint16Array(indices)
	}, [width, height])

	// animation
	let posRef = useRef(),
		colorRef = useRef()
	useFrame(() => {
		t = update(t)

		const positions = posRef.current.array,
			colors = colorRef.current.array

		let i = 0
		for (let yi = 0; yi < height; yi++) {
			for (let xi = 0; xi < width; xi++) {
				positions[i + 2] = zOfXYT(positions[i], positions[i + 1], t)
				let c = colorOfXYZT(positions[i], positions[i + 1], positions[i + 2], t)
				colors[i] = c.r
				colors[i + 1] = c.g
				colors[i + 2] = c.b
				i += 3
			}
		}

		posRef.current.needsUpdate = true
		colorRef.current.needsUpdate = true
	})

	return (
		<mesh position={position} rotation={rotation}>
			<bufferGeometry>
				<bufferAttribute
					ref={posRef}
					attachObject={['attributes', 'position']}
					array={positions}
					count={positions.length / 3}
					itemSize={3}
				/>
				<bufferAttribute
					ref={colorRef}
					attachObject={['attributes', 'color']}
					array={colors}
					count={colors.length / 3}
					itemSize={3}
				/>
				<bufferAttribute
					attachObject={['attributes', 'normal']}
					array={normals}
					count={normals.length / 3}
					itemSize={3}
				/>
				<bufferAttribute attach="index" array={indices} count={indices.length} />
			</bufferGeometry>
			<meshStandardMaterial
				vertexColors
				//side={THREE.DoubleSide}
				wireframe={true}
			/>
		</mesh>
	)
}

export function Anim() {
	const seed = Math.floor(Math.random() * 2 ** 16)
	noise.seed(seed)

	const sampleNoise = (x, y, z) => {
		let scale = 1 / 8
		let octaves = 2
		let persistence = 1.6
		let lacunarity = 2

		let amp = 1
		let freq = 1

		let value = 0
		for (let i = 0; i < octaves; i++) {
			value += amp * perlin3(x * freq * scale, y * freq * scale, z)
			amp *= persistence
			freq *= lacunarity
		}

		return value
	}

	const zOfXYT = (x, y, t) => {
		return sampleNoise(x, y, t)
	}

	const colorOfXYZT = (x, y, z, t) => {
		return {
			r: z,
			g: z / 8,
			b: Math.sqrt(x ** 2 + y ** 2) / 64,
		}
	}

	return (
		<MeshAnim
			position={[0, 0, 0]}
			rotation={[-Math.PI / 2 - 0.05, 0, 0]}
			grid={{
				width: 64,
				height: 128,
				sep: 0.8,
			}}
			zOfXYT={zOfXYT}
			colorOfXYZT={colorOfXYZT}
			anim={{
				init: 0,
				update: (t) => t + 0.003,
			}}
		/>
	)
}
