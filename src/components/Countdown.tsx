import Cntdwn from 'react-countdown'

import { Divider, Stack, Typography, styled } from './index'

const CountdownStack = styled(Stack)(({ theme }) => ({
	width: '80px',
}))

export const Countdown = (props) => (
	<Cntdwn
		date={props.date}
		intervalDelay={0}
		precision={2}
		renderer={(props) => {
			return (
				<Stack
					direction={'row'}
					sx={{ alignItems: 'center' }}
					divider={
						<Divider
							sx={{
								height: '30px',
								backgroundColor: 'common.white',
							}}
							orientation={'vertical'}
						/>
					}
					spacing={1}
				>
					<CountdownStack direction={'column'}>
						<Typography align={'center'} variant={'h3'} component={'span'}>
							{props.days}
						</Typography>
						<Typography align={'center'} variant={'body2'} component={'span'}>
							days
						</Typography>
					</CountdownStack>
					<CountdownStack direction={'column'}>
						<Typography align={'center'} variant={'h3'} component={'span'}>
							{props.hours}
						</Typography>
						<Typography align={'center'} variant={'body2'} component={'span'}>
							hours
						</Typography>
					</CountdownStack>
					<CountdownStack direction={'column'}>
						<Typography align={'center'} variant={'h3'} component={'span'}>
							{props.minutes}
						</Typography>
						<Typography align={'center'} variant={'body2'} component={'span'}>
							minutes
						</Typography>
					</CountdownStack>
					<CountdownStack direction={'column'}>
						<Typography align={'center'} variant={'h3'} component={'span'}>
							{props.seconds}
						</Typography>
						<Typography align={'center'} variant={'body2'} component={'span'}>
							seconds
						</Typography>
					</CountdownStack>
				</Stack>
			)
		}}
	/>
)
