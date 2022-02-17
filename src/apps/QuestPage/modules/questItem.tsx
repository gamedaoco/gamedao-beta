import { Box, Paper, Stack, Typography } from '@mui/material'
import { ICON_MAPPING, Icons } from '../../../components/Icons'
import { useTheme } from '@mui/material/styles'
import React from 'react'

interface ComponentProps {
	active: boolean
	activeImage: string
	title: string
	description: string
	rtl: boolean
	first?: boolean
	last?: boolean
}

export function QuestItem({
	active,
	activeImage,
	title,
	description,
	rtl,
	first,
	last,
}: ComponentProps) {
	const theme = useTheme()
	return (
		<Box
			className={`quest-page__item ${rtl ? 'quest-page__item--rtl' : ''} ${
				first ? 'quest-page__item--first' : ''
			} ${last ? 'quest-page__item--last' : ''} ${active ? 'quest-page__item--active' : ''}`}
		>
			<Stack component={Paper} padding={4} spacing={4}>
				<Stack spacing={8} direction={rtl ? 'row-reverse' : 'row'}>
					<Icons
						className={"questicon"}
						src={active ? activeImage : ICON_MAPPING.quest}
						alt={'QuestIcon'}
						sx={{ height: '6rem', width: '6rem' }}
					/>
					<Stack>
						<Typography variant="h3">{title}</Typography>
						<Typography>{description}</Typography>
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
