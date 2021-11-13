import React from 'react'
import ListIcon from '@mui/icons-material/List'
import TileIcon from '@mui/icons-material/ViewColumn'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'

export enum ListTileEnum {
	TILE,
	LIST,
}

export const ListTileSwitch: React.FC<{
	mode: ListTileEnum
	onSwitch: (mode: ListTileEnum) => void
}> = (props) => {
	return (
		<Box
			sx={{
				borderRadius: 2,
				padding: 2,
				backgroundColor: 'background.default',
				color: 'text.disabled',
			}}
		>
			<Stack
				divider={<Divider sx={{ borderColor: 'text.disabled' }} orientation={'vertical'} flexItem />}
				direction={'row'}
				justifyContent={'flex-end'}
				spacing={1}
			>
				<IconButton
					onClick={() => props.onSwitch?.(ListTileEnum.LIST)}
					sx={{
						color: props.mode === ListTileEnum.LIST ? 'text.primary' : 'text.disabled',
					}}
				>
					<ListIcon />
				</IconButton>
				<IconButton
					onClick={() => props.onSwitch?.(ListTileEnum.TILE)}
					sx={{
						color: props.mode === ListTileEnum.TILE ? 'text.primary' : 'text.disabled',
					}}
				>
					<TileIcon />
				</IconButton>
			</Stack>
		</Box>
	)
}

export default ListTileSwitch
