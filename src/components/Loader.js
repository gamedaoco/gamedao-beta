import React from 'react'
import { Dimmer, Loader as SUILoader } from 'semantic-ui-react'

export const Loader = ({text}) =>
	<React.Fragment>
		<Dimmer active page>
			<SUILoader size='mini'>
				{text}
			</SUILoader>
		</Dimmer>
	</React.Fragment>

export default Loader
