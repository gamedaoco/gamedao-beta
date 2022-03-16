import { useEffect, useState } from 'react'
import { useWallet } from 'src/context/Wallet'
import { useTheme } from '@mui/material/styles'
import Modal from '@mui/material/Modal'
import { Grid, Card, Typography, Box } from 'src/components'
import to from 'await-to-js'

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '90vw',
	height: '90vw',
	bgcolor: 'black',
	boxShadow: 24,
	borderRadius: '1rem',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}

const CollectableView = ({ content }) => {

	const theme = useTheme()
	const bgPlain = { backgroundColor: theme.palette.grey[500_16] }

	const { account, address } = useWallet()
	const [ metadata, setMetadata ] = useState(null);
	const [ thumbnailURI, setThumbnailURI ] = useState(null);
	const [ mediaURI, setMediaURI ] = useState(null);

	const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	const GATEWAY = 'https://rmrk.mypinata.cloud/ipfs/'

	useEffect(()=>{
		if (!content?.metadata) return
		async function getMetadata(cid) {
			const URL = GATEWAY + cid.slice(12)
			const [err, data] = await to( fetch(URL) )
			console.log(data)
			setMetadata( await data.json() )
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
					<Box sx={{ ...style }}>Content
					</Box>
				</Modal>
			}
			<Grid item key={content.id}>
				<Card sx={{ width: '240px', minHeight: '240px',	alignItems: 'center', justifyContent: 'center' }}>
					{ !metadata
						? ('Loading...')
						: (<>
							<img src={thumbnailURI} width='100%' height='auto' onClick={handleOpen}/>
							<Typography sx={{ pt: 1, px: 2, fontFamily: 'PT Serif Regular'}}>{content.metadata_name}</Typography>
							<Typography sx={{ pb: 1, px: 2, fontFamily:'PT Serif Regular'}}>{content.sn}</Typography>
						</>)
					}
				</Card>
			</Grid>
		</>
	)

}

export default CollectableView
