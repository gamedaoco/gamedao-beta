import { Box } from 'src/components'
import RendererKoiJam from './koijam/Render'


export const foregroundContentMap = {
    koijam: <Box
        sx={{
            width: '66vw',
            height: '55vh',
            position: 'absolute',
            right: '0px',
            overflow: 'hidden',
        }}>
            <RendererKoiJam />
    </Box>,
    default: <></>
}