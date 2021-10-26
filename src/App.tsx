import React, { useState, createRef } from 'react'
import styled from '@emotion/styled'
import Router from './Router'

const Wrapper = styled.div`
	.react-icon {
		margin-right: 1em;
		margin-top: 2px;
	}
`

const App = (props) => {
	const contextRef = createRef()
	return (
		<Wrapper>
			<Router>{props.children}</Router>
		</Wrapper>
	)
}

export default App