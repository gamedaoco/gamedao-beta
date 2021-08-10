import React, { useState, createRef } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { SubstrateContextProvider, useSubstrate } from './substrate-lib'
import { Container, Grid, Segment } from 'semantic-ui-react'
import styled from 'styled-components'
import { IconContext } from "react-icons"
import Footer from './components/Footer'
import Header from './components/Header'
import Transfer from './components/Transfer'
import Template from './components/TemplateModule'
import Loader from './components/Loader'
import ErrorMessage from './components/Message'
import GameDAO from './GameDAO'

const DEV = (process.env.NODE_ENV!=='production')

const Wrapper = styled.div`
	.react-icon {
		margin-right: 1em;
		margin-top:2px;
	}
`

function Main () {

	const { apiState, keyring, keyringState, apiError } = useSubstrate()
	const [ accountAddress, setAccountAddress ] = useState(null)
	const accountPair =
		accountAddress &&
		keyringState === 'READY' &&
		keyring.getPair(accountAddress)

	if (apiState === 'ERROR') return (<ErrorMessage err={apiError} />)
	else if (apiState !== 'READY') return (<Loader text='Connecting Network' />)
	if (keyringState !== 'READY') return (<Loader text='Loading accounts' />)

	const contextRef = createRef()

	return (
		<Wrapper context={contextRef}>
			<IconContext.Provider value={{
				color: "black",
				className: "react-icon"
			}}>
			<Header
				setAccountAddress={setAccountAddress}
				accountPair={accountPair}
				/>


			<Segment vertical style={{ minHeight: '95vh', padding: '5em 0em', backgroundColor:'#f0f0f0' }}>
				<Container>
					<Grid>
						<Grid.Row stretched>
							<GameDAO
								accountPair={accountPair}
								accountAddress={accountAddress}
								setAccountAddress={setAccountAddress}
								/>
						</Grid.Row>
					</Grid>
				</Container>
			</Segment>
			{ DEV &&
				<Segment vertical style={{ padding: '5em 1em', backgroundColor:'#999' }}>
					<Container>
							<Grid>
								<Grid.Row stretched>
									<Transfer
										accountPair={accountPair}
										accountAddress={accountAddress}
										setAccountAddress={setAccountAddress}
										/>
									<Template
										accountPair={accountPair}
										accountAddress={accountAddress}
										setAccountAddress={setAccountAddress}
										/>
								</Grid.Row>
							</Grid>
					</Container>
				</Segment>
			}

{/*
			<Segment inverted vertical style={{ minHeight: '10vh', padding: '3em', backgroundColor:'#2b2c2d' }}>

			</Segment>
*/}
			<Footer/>

		</IconContext.Provider>
		</Wrapper>
	)
}

export default function App () {
	return (
		<SubstrateContextProvider>
			<Main />
		</SubstrateContextProvider>
	)
}
