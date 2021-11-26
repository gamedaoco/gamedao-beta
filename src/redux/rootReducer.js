import { balanceReducer } from './duck/balance.duck'
import { governanceReducer } from './duck/gameDaoGovernance.duck'
import { identityReducer } from './duck/identity.duck'
import { crowdfundingReducer } from './duck/crowdfunding.duck'
import { gameDaoControlReducer } from './duck/gameDaoControl.duck'

// eslint-disable-next-line no-unused-vars
export default function rootReducer(state = {}, action) {
	return {
		balance: balanceReducer(state.balance, action),
		governance: governanceReducer(state.governance, action),
		identity: identityReducer(state.identity, action),
		crowdfunding: crowdfundingReducer(state.crowdfunding, action),
		gameDaoControl: gameDaoControlReducer(state.gameDaoControl, action),
	}
}
