import { useTheme } from '@mui/material'
import React, { DragEvent } from 'react'
import { Paper } from '../components'

export const FileDropZone: React.FC<
	React.PropsWithChildren<{
		onDroppedFiles: (files: File[]) => void
		accept: string
	}>
> = (props) => {
	const [hover, setHover] = React.useState(false)

	const onDragOver = React.useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setHover(true)
	}, [])

	const onDrop = React.useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		if (e.dataTransfer.files?.length) props.onDroppedFiles(Array.from(e.dataTransfer.files))
	}, [])

	const onDragLeave = React.useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setHover(false)
	}, [])

	const onFileInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.currentTarget.files) {
			props.onDroppedFiles(Array.from(e.currentTarget.files))
		}
	}, [])

	const theme = useTheme()

	const fileInputRef = React.useRef<HTMLInputElement>(null)

	return (
		<>
			<input
				style={{ position: 'absolute', left: '-9999999px' }}
				multiple
				type={'file'}
				accept={props.accept}
				onChange={onFileInputChange}
				ref={fileInputRef}
			/>
			<Paper
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onClick={() => fileInputRef.current?.click()}
				onDrop={onDrop}
				sx={{
					justifyContent: 'center',
					alignItems: 'center',
					padding: 4,
					background: hover
						? theme.palette.background.neutral
						: theme.palette.background.paper,
				}}
				component={'div'}
			>
				{props.children}
			</Paper>
		</>
	)
}

export default FileDropZone
