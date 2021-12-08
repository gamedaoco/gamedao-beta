import { Box } from 'src/components'
import RendererKoiJam from './koijam/Render'


export const foregroundContentMap = {
    koijam: <Box
        sx={{
            width: '66vw',
            height: '60vh',
            position: 'absolute',
            right: '0px',
            top: '28vh',
            overflow: 'hidden',
        }}>
            <RendererKoiJam />
    </Box>,
    pixzoo: <Box 
        sx={{
            overflowX: 'hidden',
            overflowY: 'hidden',
            width: '60vw',
            height: '60vh',
            position: 'absolute',
            right: '0px',
            top: '33vh'
        }}
        className="float">
        <img height='100%' src="https://ipfs.gamedao.co/gateway/QmevAQLQMThNR1pFfDHzMCxwaEi5xx9HqsnxVcb1yEzmBL"/>
    </Box>,
    default: <Box
        sx={{
            width: '66vw',
            height: '60vh',
            position: 'absolute',
            right: '0px',
            top: '0px',
        }}><img src='/assets/campaign-model.png'/>
    </Box>,
}