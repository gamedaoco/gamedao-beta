import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export default function Select(theme: Theme) {
	return {
		MuiSelect: {
			defaultProps: {
				IconComponent: ExpandMoreRoundedIcon,
			},
			styleOverrides: {
				root: {
				},
				sizeSmall: {
					padding: '1.5em 2em',
				},
			},
		},
	}
}
