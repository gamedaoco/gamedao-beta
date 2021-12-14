import to from 'await-to-js'
import React, { useEffect, useState } from 'react'
import { Stack, Typography } from 'src/components'
import { createErrorNotification } from 'src/utils/notification'
import { gateway } from '../../lib/ipfs'

async function fetchOrganisationMetaData(cid, setLogo) {
	// Invalid ipfs hash
	if (cid?.length !== 46) return

	const [err, data] = await to(fetch(`${gateway}${cid}`))
	if (err) {
		createErrorNotification('Metadata for this organization could not be downloaded ')
		return console.error(err)
	}

	const [parseErr, parsedData] = await to(data.json())
	if (parseErr) {
		createErrorNotification('Metadata for this organization could not be parsed ')
		return console.error(parseErr)
	}

	if (parsedData.logo) {
		setLogo(parsedData.logo)
	}
}

export function ProposalBodyData({ body, metadata, proposalId }) {
	const [imageState, setImageState] = useState<any>()
	const proposalMeta = metadata?.[proposalId]

	// Fetch logo
	useEffect(() => {
		if (!body) return

		fetchOrganisationMetaData(body.cid, setImageState)
	}, [body])

	return (
		<Stack direction="row" justifyContent="space-between" width="100%">
			<Typography variant="h4">{proposalMeta.title}</Typography>
			{imageState ? (
				<img width="200px" height="100%" src={`${gateway}${imageState}`} />
			) : null}
		</Stack>
	)
}
