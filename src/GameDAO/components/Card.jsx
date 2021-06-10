/**
					 _______________________________ ________
					 \____    /\_   _____/\______   \\_____  \
						 /     /  |    __)_  |       _/ /   |   \
						/     /_  |        \ |    |   \/    |    \
					 /_______ \/_______  / |____|_  /\_______  /
									 \/        \/         \/         \/
					 Z  E  R  O  .  I  O     N  E  T  W  O  R  K
					 © C O P Y R I O T   2 0 7 5   Z E R O . I O
**/

import React, { useEffect, useState } from 'react'
import { useSubstrate } from '../../substrate-lib'
import { TxButton } from '../../substrate-lib/components'
import { Card } from 'semantic-ui-react'

//
//
//

export const Card = props => {

	const { api } = useSubstrate()
	const { accountPair } = props
	const [ status, setStatus ] = useState()

	return (
		<Card>
			<h1>Card</h1>
		</Card>
	)

}

export default Card

//
//
//
