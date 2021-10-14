import React, { useEffect, useState } from 'react'
import { useSubstrate } from '../substrate-lib'

import { Form, Icon, Accordion, List, Checkbox, Label, Header, Segment, Divider, Button } from 'semantic-ui-react'
import { TxButton } from '../../substrate-lib/components'

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
				<InputBond bond={this.fundingId} placeholder="Type the funding id" validator={(id) => id || null} />
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
