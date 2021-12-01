export const BACKGROUND_ANIM = {
	// backgroundMode: {
	// 	enable: true,
	// },
	background: {
		image: `url(/assets/gamedao_backgound.svg)`,
		position: `center`,
		repeat: 'no-repeat',
		size: 'contain',
	},
	fpsLimit: 60,
	particles: {
		number: {
			value: 150,
		},
		collisions: {
			enable: false,
		},
		color: {
			value: '#ffffff',
		},
		shape: {
			type: 'circle',
		},
		opacity: {
			value: { min: 0.3, max: 0.8 },
		},
		size: {
			value: { min: 1, max: 8 },
		},
		move: {
			enable: true,
			size: true,
			speed: 5,
			direction: 'none',
			outModes: {
				default: 'destroy',
			},
		},
	},
	detectRetina: true,
	emitters: {
		direction: 'none',
		rate: {
			delay: 0.4,
			quantity: 10,
		},
		size: {
			width: 0,
			height: 0,
		},

		life: {
			wait: false,
			duration: 5,
		},
	},
}
