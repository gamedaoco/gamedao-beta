import React from 'react'
import { Grid, Message as SUIMessage } from 'semantic-ui-react'

export const Message = err =>
	<React.Fragment>
		<Grid centered columns={2} padded>
			<Grid.Column>
				<SUIMessage negative compact floating
					header='Error Connecting to ZERO.IO'
					content={`${JSON.stringify(err, null, 4)}`}
				/>
			</Grid.Column>
		</Grid>
	</React.Fragment>

export default Message
