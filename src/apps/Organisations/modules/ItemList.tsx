import React, { useEffect, useState, useMemo } from 'react'
import { ListTileEnum, ListTileSwitch } from 'src/apps/components/ListTileSwitch'
import { Stack, TablePagination, Box, styled } from '../../../components'
import { Item } from './Item'

const TileWrapper = styled(Box)(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: '1fr',
	rowGap: theme.spacing(2),
	columnGap: theme.spacing(2),
	[theme.breakpoints.up('md')]: {
		gridTemplateColumns: '1fr 1fr',
	},
	[theme.breakpoints.up('lg')]: {
		gridTemplateColumns: '1fr 1fr 1fr',
	},
	[theme.breakpoints.up('xl')]: {
		gridTemplateColumns: '1fr 1fr 1fr 1fr',
	},
}))

const ListWrapper = styled(Box)(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: '1fr',
	rowGap: theme.spacing(2),
	columnGap: theme.spacing(2),
}))

export function ItemList({ data }) {
	const [pageState, setPageState] = useState(0)
	const [rowsPerPageState, setRowsPerPageState] = useState(25)
	const [displayModeState, setDisplayModeState] = useState(ListTileEnum.TILE)
	const [displayState, setDisplayState] = useState([])

	useEffect(() => {
		if (data) {
			setDisplayState(
				data.slice(pageState * rowsPerPageState, (pageState + 1) * rowsPerPageState)
			)
		}
	}, [data, pageState, rowsPerPageState])

	const Wrapper = useMemo(
		() => (displayModeState === ListTileEnum.LIST ? ListWrapper : TileWrapper),
		[displayModeState]
	)

	if (!Array.isArray(data)) return null

	return (
		<Stack alignItems="center" spacing="2">
			<Box marginLeft="auto">
				<ListTileSwitch mode={displayModeState} onSwitch={setDisplayModeState} />
			</Box>
			<Box>
				<Wrapper>
					{displayState?.map((itemData) => (
						<React.Fragment key={itemData?.hash}>
							<Item data={itemData} displayMode={displayModeState} />
						</React.Fragment>
					))}
				</Wrapper>
			</Box>
			<TablePagination
				sx={{ borderTop: 'none' }}
				count={data.length}
				rowsPerPage={rowsPerPageState}
				page={pageState}
				onPageChange={(_, page) => setPageState(page)}
				onRowsPerPageChange={(e) => setRowsPerPageState(+e?.target?.value)}
			/>
		</Stack>
	)
}
