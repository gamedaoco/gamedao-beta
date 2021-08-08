import React, { useState, useEffect } from 'react'
import { Segment, Image, Menu, Message } from 'semantic-ui-react'
import AccountSelector from './AccountSelector'

const imageURL=`${process.env.PUBLIC_URL}/assets/gamedao_tangram.svg`

function Main ({ accountPair, setAccountAddress }) {

	return (
			<Segment inverted vertical color='black'>

				<Menu
					inverted secondary
					color='black'
					style={{
						padding: '1em 3em',
						minWidth:'100%',
					}}
					>

					<Menu.Menu style={{ alignItems: 'center', paddingRight: '1em' }}>
						<a href='/'><Image alt='GameDAO' src={imageURL} height={32} /></a>
					</Menu.Menu>

					<Menu.Menu style={{ alignItems: 'center' }}>
				{/*
						<Menu.Item
							name='home'
							active={activeState === 'home'}
							onClick={handleItemClick}
							/>
						<Menu.Item
							name='messages'
							active={activeState === 'messages'}
							onClick={handleItemClick}
							/>
						<Menu.Item
							name='friends'
							active={activeState === 'friends'}
							onClick={handleItemClick}
							/>
					*/}
					</Menu.Menu>

					<Menu.Menu position='right' style={{ alignItems: 'center' }}>
						<AccountSelector setAccountAddress={setAccountAddress} />
					</Menu.Menu>

				</Menu>

			</Segment>
	)
}

export default Main