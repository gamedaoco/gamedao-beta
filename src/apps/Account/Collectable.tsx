import { useEffect, useState } from 'react'
// import { useWallet } from 'src/context/Wallet'
// import { useTheme } from '@mui/material/styles'
import Modal from '@mui/material/Modal'
import { Grid, Card, Typography, Box, Link } from 'src/components'
import to from 'await-to-js'
// import '@google/model-viewer/dist/model-viewer'

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "model-viewer": {
                src: string
                "ios-src"?: string
                "camera-controls"?: boolean
                "disable-zoom"?: boolean
                "auto-rotate"?: boolean
                ar?: boolean
                autoplay?: boolean
                alt?: string
                "shadow-intensity"?: number | string
                "ar-scale"?: number | string
                toBlob?: () => Promise<Blob>
                width?: string | number
                height?: string | number
                style?: string
            } & React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            >
        }
    }
}

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '90vw',
	height: '90vw',
	bgcolor: 'black',
	borderRadius: '1rem',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	outline: 0,
	'*': { width: '90%', height: '90%' }
}

const Collectable = ({ content }) => {

	// const theme = useTheme()
	// const bgPlain = { backgroundColor: theme.palette.grey[500_16] }
	// const { account, address } = useWallet()
	const [ metadata, setMetadata ] = useState(null);
	const [ thumbnailURI, setThumbnailURI ] = useState(null);
	const [ mediaURI, setMediaURI ] = useState(null);

	const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	const GATEWAY = 'https://rmrk.mypinata.cloud/ipfs/'
	const SINGULAR_URL = 'https://singular.app/collectibles/'

	useEffect(()=>{
		if (!content?.metadata) return
		async function getMetadata(cid) {
			const URL = GATEWAY + cid.slice(12)
			const [err, data] = await to( fetch(URL) )
			if (err) console.error(err)
			else setMetadata( await data.json() )
		}
		getMetadata(content.metadata)
	},[content.metadata])

	useEffect(()=>{
		if(!metadata) return
		setThumbnailURI( GATEWAY + metadata.thumbnailUri.slice(12) )
		setMediaURI( GATEWAY + metadata.mediaUri.slice(12) )
	},[metadata])

	return (
		<>
			{ open &&
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
					>
					<Box sx={{ ...style }}>
						<model-viewer
							src={mediaURI}
							alt={content.metadata_name}
							ios-src=""
							camera-controls
							environment-image="neutral"
							shadow-intensity="1"
							auto-rotate
							autoplay
							ar
						/>
					</Box>
				</Modal>
			}
			<Grid item key={content.id}>
				<Card sx={{ width: '240px', minHeight: '240px',	alignItems: 'center', justifyContent: 'center' }}>
					{ !metadata
						? ('Loading...')
						: (<Link sx={{ color: '#f0f', fontStyle: 'italic'}} target='_blank' onClick={handleOpen}>
							<img alt={content.metadata_name} src={thumbnailURI} width='100%' height='auto'/>
							<Typography sx={{ pt: 1, px: 2, fontFamily: 'PT Serif Regular'}}>{content.metadata_name}</Typography>
							<Typography sx={{ pb: 1, px: 2, fontFamily:'PT Serif Regular'}}>{content.sn}</Typography>
						</Link>)
					}
				</Card>
			</Grid>
		</>
	)

}

export default Collectable