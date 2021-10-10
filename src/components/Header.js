import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { Segment, Image, Menu } from 'semantic-ui-react'
import AccountSelector from './AccountSelector'

// import { BiJoystick, BiHomeCircle, BiListCheck, BiListPlus, BiCoinStack, BiCoin, BiPyramid, BiGame, BiPlus, BiDiamond } from "react-icons/bi";

const imageURL=`${process.env.PUBLIC_URL}/assets/gamedao_tangram.svg`

function Main ({ accountPair, setAccountAddress }) {

	const [ activeState, setActiveState ] = useState('/')
	const handleItemClick = e => { setActiveState(e.value)}

	return (
			<Segment inverted vertical color='black'>

				<Menu
					inverted
					secondary
					color='black'
					style={{
						padding: '1em 3em',
						minWidth:'100%',
					}}
					>

					<Menu.Menu style={{ alignItems: 'center', paddingRight: '1em' }}>
						<Link to="/">
							<Image alt='GameDAO' src={imageURL} height={32} />
						</Link>
					</Menu.Menu>

					<Menu.Menu style={{ alignItems: 'left' }}>

						<Menu.Item name='dashboard' active={activeState === 'dashboard'} >
							<Link to="/app"> Dashboard </Link>
						</Menu.Item>
						<Menu.Item name='organisations' active={activeState === 'organisations'} >
							<Link to="/app/organisations"> Organisations </Link>
						</Menu.Item>
						<Menu.Item name='governance' active={activeState === 'governance'} >
							<Link to="/app/governance"> Governance </Link>
						</Menu.Item>
						<Menu.Item name='campaigns' active={activeState === 'campaigns'} >
							<Link to="/app/campaigns"> Campaigns </Link>
						</Menu.Item>
						<Menu.Item name='tangram' active={activeState === 'tangram'} >
							<Link to="/app/tangram"> Tangram </Link>
						</Menu.Item>
						<Menu.Item name='wallet' active={activeState === 'wallet'} >
							<Link to="/app/wallet"> Wallet </Link>
						</Menu.Item>

					</Menu.Menu>

					<Menu.Menu position='right' style={{ alignItems: 'center' }}>
						<AccountSelector setAccountAddress={setAccountAddress} />
					</Menu.Menu>

				</Menu>

			</Segment>
	)
}

export default Main