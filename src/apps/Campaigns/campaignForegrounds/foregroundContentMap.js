import { Box } from 'src/components'
import RendererKoiJam from './koijam/Render'


export const foregroundContentMap = {
    koijam: <Box
        sx={{
            width: '66vw',
            height: '60vh',
            position: 'absolute',
            right: '0px',
            top: '25vh',
            overflow: 'hidden',
        }}>
            <RendererKoiJam />
    </Box>,
    default: <></>
}