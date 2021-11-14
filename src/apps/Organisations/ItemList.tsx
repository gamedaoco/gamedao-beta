import React, { useEffect, useState, lazy } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSubstrate } from '../../substrate-lib'
import { useWallet } from 'src/context/Wallet'
import { web3FromSource } from '@polkadot/extension-dapp'
import { encodeAddress } from '@polkadot/util-crypto'

const ItemList = (props) => {
	const { content } = props

	///
	const [page, setPage] = React.useState(0)
	const [rowsPerPage, setRowsPerPage] = React.useState(10)

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value)
		setPage(0)
	}
	///

	const [activePage, setActivePage] = useState(1)
	const [totalPages, setTotalPages] = useState(0)
	const [offset, setOffset] = useState(0)
	const [itemsPerPage, setItemsPerPage] = useState(3)
	const [displayMode, setDisplayMode] = useState(ListTileEnum.LIST)

	const iPP = [3, 5, 9, 18, 36, 72]
	const handleShowMoreItems = () => setItemsPerPage(itemsPerPage < iPP.length - 1 ? itemsPerPage + 1 : itemsPerPage)
	const handleShowLessItems = () => setItemsPerPage(itemsPerPage > 0 ? itemsPerPage - 1 : 0)

	useEffect(() => {
		const _totalPages = Math.ceil(content.length / iPP[itemsPerPage])
		setTotalPages(_totalPages)
		if (activePage > _totalPages) setActivePage(_totalPages)
	}, [content, itemsPerPage, activePage])

	const handlePaginationChange = (e, { activePage }) => {
		setActivePage(activePage)
		setOffset((activePage - 1) * iPP[itemsPerPage])
	}

	const Wrapper = React.useMemo(() => (displayMode === ListTileEnum.LIST ? ListWrapper : TileWrapper), [displayMode])

	if (!content) return null

	// console.log(activePage,totalPages,offset,itemsPerPage)

	return (
		<Box>
			<ListTileSwitch mode={displayMode} onSwitch={setDisplayMode} />
			<Wrapper>
				{content.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((d, i) => {
					const _content = {
						...d,
					}
					return <Item mode={displayMode} key={offset + i} content={_content} />
				})}
			</Wrapper>
			<Box sx={{ my: 2 }} />
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component="div"
				count={content.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Box>
	)
}
