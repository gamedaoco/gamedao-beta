import { useApiProvider } from '@substra-hooks/core'
import React, { useEffect, useState } from 'react'
import { Feed, Grid, Button } from 'semantic-ui-react'

// Events to be filtered from feed
const FILTERED_EVENTS = [
	'system:ExtrinsicSuccess:: (phase={"ApplyExtrinsic":0})',
	'system:ExtrinsicSuccess:: (phase={"ApplyExtrinsic":1})',
]

function Main(props) {
	const apiProvider = useApiProvider()
	const [eventFeed, setEventFeed] = useState([])

	useEffect(() => {
		let unsub = null
		const allEvents = async () => {
			unsub = await apiProvider.query.system.events((events) => {
				// loop through the Vec<EventRecord>
				events.forEach((record) => {
					// extract the phase, event and the event types
					const { event, phase } = record
					const types = event.typeDef

					// show what we are busy with
					const eventName = `${event.section}:${
						event.method
					}:: (phase=${phase.toString()})`

					if (FILTERED_EVENTS.includes(eventName)) return

					// loop through each of the parameters, displaying the type and data
					const params = event.data.map(
						(data, index) => `${types[index].type}: ${data.toString()}`
					)

					setEventFeed((e) => [
						{
							icon: 'bell',
							summary: `${eventName}-${e.length}`,
							extraText: event.meta.documentation.join(', ').toString(),
							content: params.join(', '),
						},
						...e,
					])
				})
			})
		}

		allEvents()
		return () => unsub && unsub()
	}, [apiProvider.query.system])

	const { feedMaxHeight = 250 } = props

	return (
		<Grid.Column>
			<h1 style={{ float: 'left' }}>Events</h1>
			<Button
				basic
				circular
				size="mini"
				color="grey"
				floated="right"
				icon="erase"
				onClick={(_) => setEventFeed([])}
			/>
			<Feed
				style={{ clear: 'both', overflow: 'auto', maxHeight: feedMaxHeight }}
				events={eventFeed}
			/>
		</Grid.Column>
	)
}

export default function Events(props) {
	const apiProvider = useApiProvider()
	return apiProvider.query && apiProvider.query.system && apiProvider.query.system.events ? (
		<Main {...props} />
	) : null
}
