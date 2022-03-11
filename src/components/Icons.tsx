import React from 'react'
import { Box } from '.'
import Icon from '@mui/material/Icon'

export const ICON_MAPPING = {
	logo: `${process.env.PUBLIC_URL}/assets/gamedao-logo-color.svg`,
	logoWhite: `${process.env.PUBLIC_URL}/assets/gamedao-logo-white.svg`,
	campains: `${process.env.PUBLIC_URL}/assets/icon_campaigns.svg`,
	dashboard: `${process.env.PUBLIC_URL}/assets/icon_dashboard.svg`,
	documentation: `${process.env.PUBLIC_URL}/assets/icon_documentation.svg`,
	howitworks: `${process.env.PUBLIC_URL}/assets/icon_howitworks.svg`,
	organizations: `${process.env.PUBLIC_URL}/assets/icon_organizations.svg`,
	organizations2: `${process.env.PUBLIC_URL}/assets/icon_organizations_2.svg`,
	store: `${process.env.PUBLIC_URL}/assets/icon_store.svg`,
	tangram: `${process.env.PUBLIC_URL}/assets/icon_tangram.svg`,
	voting: `${process.env.PUBLIC_URL}/assets/icon_voting.svg`,
	wallet: `${process.env.PUBLIC_URL}/assets/icon_wallet.svg`,
	moon: `${process.env.PUBLIC_URL}/assets/icon_moon.svg`,
	sun: `${process.env.PUBLIC_URL}/assets/icon_sun.svg`,
	logout: `${process.env.PUBLIC_URL}/assets/icon_logout.svg`,
	quest: `${process.env.PUBLIC_URL}/assets/quest.png`,
}

export function Icons({ src, alt, ...props }) {
	return <Box component={'img'} src={src} alt={alt || 'icon'} {...props} />
}

export function FontIcon({ name = 'tangram', ...props }) {
	return <Icon baseClassName='gamedao-icon-font' className={'icon-' + name} {...props} />
}
