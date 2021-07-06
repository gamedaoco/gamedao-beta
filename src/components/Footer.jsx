import React from 'react'
import { Segment, Container, Grid, Header, List, Image } from 'semantic-ui-react'

// import Stats from './Stats'

export const Footer = props =>
	<React.Fragment>

{/*		<Segment vertical style={{ padding: '2em 2em' }}>
			<Container textAlign='center'>
				<Stats/>
			</Container>
		</Segment>*/}

		<Segment id='footer' inverted vertical style={{ padding: '5em 0em' }}>
			<Container>

				<Grid divided inverted stackable>

					<Grid.Row>
						<Grid.Column width={16}>
				          	<a href='#top'><Image alt='GameDAO' src={`${process.env.PUBLIC_URL}/assets/gamedao_tangram.svg`} size='mini' /></a>
						</Grid.Column>
					</Grid.Row>

					<Grid.Row>
						<Grid.Column width={3}>
							<Header inverted as='h4' content='About' />
							<List link inverted>
								<List.Item as='a' href='https://blog.gamedao.co/the-gamedao-pinky-paper-8dcda7f2e1ca' target='_blank'>short paper</List.Item>
								<List.Item as='a' href='https://blog.gamedao.co' target='_blank'>blog</List.Item>
								<List.Item as='a' href='https://discord.gg/rhwtr7p' target='_blank'>discord</List.Item>
								<List.Item as='a' href='https://twitter.com/gamedaoco' target='_blank'>twitter</List.Item>
								<br/>
								<List.Item as='a' href='https://gamedao.co' target='_blank'>gamedao.co</List.Item>

							</List>
						</Grid.Column>
						<Grid.Column width={3}>
							<Header inverted as='h4' content='How we build' />
							<List link inverted>
								<List.Item as='a' href='https://zero.io' target='_blank'>zero.io</List.Item>
								<List.Item as='a' href='https://substrate.dev' target='_blank'>substrate.dev</List.Item>
								<List.Item as='a' href='https://kilt.io' target='_blank'>kilt protocol</List.Item>
								<br/>
								<List.Item as='a' href='https://github.com/gamedaoco' target='_blank'>github</List.Item>
							</List>
						</Grid.Column>
						<Grid.Column width={7}>
							<Header as='h4' inverted>
								GameDAO. For the Creator and Player Economy.
							</Header>
							<p>
								Community driven ownership and creation will be a vital part
								of how we see video games in the near future. The transition to
								token driven economies is already in progress but is still in its
								early stages, only treating the symptoms of a broken, financial
								incentive driven sales machine.
							</p>
							<p>
								Tokenisation and community ownership need fair and transparent
								protocols to create safe environments for all participants
								working and creating together. Proper game theory needs to
								disincentivize bad actors and reward the good vibes of the community.
							</p>
							<p>
								From forging the initial idea over collaboration to
								fundraising and finally creating and operating game economies,
								we provide open protocols enabling coordination, ownership, fundraising and much more
								to sustainably improve economics of videogames, content creation and esports.
							</p>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Container>
		</Segment>
	</React.Fragment>

export default Footer
