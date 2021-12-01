import React from 'react'
import Particles from 'react-tsparticles'
import { BACKGROUND_ANIM } from './anim'
import { Box } from 'src/components'

export function Background() {
	return (
		<Box
			sx={{
				'& canvas': {
					position: 'absolute !important',
					backdropFilter: 'blur(10px)',
					zIndex: -1,
				},
			}}
		>
			<Particles id="tsparticles" options={BACKGROUND_ANIM} />
		</Box>
	)
}
