import { Box, Paper, Stack, Typography } from '@mui/material'
import { ICON_MAPPING, Icons } from '../../../components/Icons'
import { useTheme } from '@mui/material/styles'
import React from 'react'

interface ComponentProps {
	active: boolean
	questImage: string
	title: string
	story: string
}

export function QuestItem({
	active,
	questImage,
	title,
	story
}: ComponentProps) {
	const theme = useTheme()
	return (
		<Box>
			<Stack padding={4} spacing={4}>
				<Stack spacing={8}>
					<Icons
						className={"questicon"}
						src={active ? questImage : ICON_MAPPING.quest}
						alt={'QuestIcon'}
						sx={{ height: '6rem', width: '6rem' }}
					/>
					<Stack>
						<Typography variant="h3">{title}</Typography>
						<Typography>{story}</Typography>
						<Typography>
							Need help? Check out{' '}
							<a style={{ color: theme?.palette.text.primary }} href="#">
								documentation.
							</a>
						</Typography>
					</Stack>
				</Stack>
			</Stack>
		</Box>
	)
}
