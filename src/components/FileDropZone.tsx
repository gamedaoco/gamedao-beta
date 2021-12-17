import { useTheme } from '@mui/material'
import React, { DragEvent } from 'react'
import { Paper, Box } from '../components'

export const FileDropZone: React.FC<
	React.PropsWithChildren<{
		onDroppedFiles: (files: File[], e: any) => void
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
		if (e.dataTransfer.files?.length) props.onDroppedFiles(Array.from(e.dataTransfer.files), e)
	}, [])

	const onDragLeave = React.useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setHover(false)
	}, [])

	const onFileInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.currentTarget.files) {
			props.onDroppedFiles(Array.from(e.currentTarget.files), e)
		}
	}, [])

	const theme = useTheme()

	const fileInputRef = React.useRef<HTMLInputElement>(null)

	return (
		<>
			<input
				//@ts-ignore
				name={props.name}
				style={{ position: 'absolute', left: '-9999999px' }}
				multiple
				type={'file'}
				accept={props.accept}
				onChange={onFileInputChange}
				ref={fileInputRef}
			/>
			<Paper
				//@ts-ignore
				name={props.name}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onClick={() => fileInputRef.current?.click()}
				onDrop={onDrop}
				sx={{
					justifyContent: 'center',
					alignItems: 'center',
					textAlign: 'center',
					border: `1px solid ${theme.palette.background.neutral}`,
					display: 'flex',
					flexDirection: 'column',
					opacity: hover ? 1 : 0.6,
					cursor: 'pointer',
					transition: 'all 0.2s linear',
					padding: 4,
					background: hover
						? theme.palette.background.neutral
						: theme.palette.background.paper,
					['&:hover']: {
						background: theme.palette.background.neutral,
						opacity: 1,
					},
				}}
				component={'div'}
			>
				<Box style={{ width: '100%', pointerEvents: 'none' }}>{props.children}</Box>
			</Paper>
		</>
	)
}

export default FileDropZone
