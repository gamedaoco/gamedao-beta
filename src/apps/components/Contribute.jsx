import React from 'react'
import { Icon, Label, Header, Segment } from 'semantic-ui-react'

const Invest = (props) => {
	return (
		<Segment style={{ margin: '1em' }} padded>
			<Header as="h2">
				<Icon name="thumbs up" />
				<Header.Content>
					Let's invest
					<Header.Subheader>Support your favourite funding project</Header.Subheader>
				</Header.Content>
			</Header>
			<div style={{ paddingBottom: '1em' }}>
				<div style={{ fontSize: 'small' }}>Funding Id</div>
				<InputBond
					bond={this.fundingId}
					placeholder="Type the funding id"
					validator={(id) => id || null}
				/>
			</div>
			<div style={{ paddingBottom: '1em' }}>
				<div style={{ fontSize: 'small' }}>invest amount</div>
				<BalanceBond bond={this.amount} />
			</div>
			<div style={{ paddingBottom: '1em' }}>
				<div style={{ fontSize: 'small' }}>Account</div>
				<SignerBond bond={this.skAccount} />
				<If
					condition={this.skAccount.ready()}
					then={
						<span>
							<Label>
								Balance
								<Label.Detail>
									<Pretty value={runtime.balances.freeBalance(this.skAccount)} />
								</Label.Detail>
							</Label>
							<Label>
								Nonce
								<Label.Detail>
									<Pretty value={runtime.system.accountNonce(this.skAccount)} />
								</Label.Detail>
							</Label>
						</span>
					}
				/>
			</div>
			<TransactButton
				content="Invest"
				icon="thumbs up"
				tx={{
					sender: runtime.indices.tryIndex(this.skAccount),
					call: calls.fundingFactory.invest(this.fundingId, this.amount),
					compact: false,
					longevity: true,
				}}
			/>
		</Segment>
	)
}
