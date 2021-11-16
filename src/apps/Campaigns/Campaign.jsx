import * as React from 'react';
import { Suspense, useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { 
    Box, 
    Typography, 
    Chip, 
    Box16to9, 
    Container, 
    Button, 
    Stack,
    Slider,
    Image16to9
} from '../../components'

import { TileReward } from "./TileReward"

import { Renderer } from './three';

import { useCrowdfunding } from 'src/hooks/useCrowdfunding';
import { useWallet } from 'src/context/Wallet';




function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



export function Campaign(){
    const id = useParams().id
    const t = ['Open World', 'Trending', 'Survivial']

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const { campaignsCount, campaignBalance, campaignState, campaigns, campaignsIndex } = useCrowdfunding()

      const wallet = useWallet()

      const [content, setContent] = useState()

      useEffect(() => {
        if (!campaignsIndex || !campaignBalance || !campaignState || !campaigns) return

        const content = Object.keys(campaignsIndex).map((index) => {
          const itemHash = campaignsIndex[index]

          return {
            ...(campaigns[itemHash] ?? {}),
            state: campaignState[itemHash],
            balance: campaignBalance[itemHash],
          }
        })
        setContent(content)
      }, [campaignsIndex, campaignBalance, campaignState, campaigns])

      console.log(campaignsCount, campaignBalance, campaignState, campaigns, campaignsIndex)
      console.log(wallet)
  
    return <Box>
        <Box16to9 sx={{
            zIndex: '-1',
            background: 'url(https://picsum.photos/1240)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            height: '33vw',
            maxHeight: '1400px',
            minHeight: '450px'  
        }}>
            <Container
                maxWidth='md'
                sx={{
                    paddingTop: '10vw'
                }}
            >
                <Box sx={{display: 'flex'}}>
                    <Box sx={{ flexBasis: '50%' }}>
                        <Typography variant='h1'>CLOUD IMPERIUM</Typography>
                        <Typography variant='h3'>クラウドインペリアム</Typography>

                        <Box>
                            <Stack direction='row'>
                                {t.map(tag => {
                                    return <Chip sx={{ padding: 0 }} label={tag} variant="outlined" />
                                })}
                            </Stack>
                        </Box>

                        <Typography>From the developer of Virgo Versus The Zodiac and Osteoblasts comes a Tactical Rhythm JRPG in which you play as the Singer who fights the oppressive government to bring back Music to a melodyless world.</Typography>
                    </Box>

                    <Box sx={{ flexBasis: '50%' }}>
                      <Renderer/>
                    </Box>
                </Box>
            </Container>
        </Box16to9>
            <Container
                maxWidth='md'
                sx={{
                    marginTop: '-2vh'
                }}
            >
                <Box sx={{
                    display: 'flex',
                    border: '1px solid',
                    borderColor: 'primary.main',
                    background: 'grey'
                }}>
                    <Box sx={{ flexBasis: '70%', display: 'flex', alignItems: 'center', margin: '0 auto' }}>
                        <Slider disabled defaultValue={30} />
                    </Box>
                    <Box sx={{ margin: '0 auto'}}>
                        <Button>Participate</Button>
                    </Box>
                </Box>
            </Container>
              {/*<Box sx={{ 
                position: 'absolute', 
                zIndex: '100000 !important',
                right: '10vw',
                top: '5vh',
                width: '30vw',
                height: '30vh'
                }}>
                <Canvas invalidateFrameloop={true}>
                  <Suspense fallback={null}>
                    <Model scale={1}/>
                    <OrbitControls />
                  </Suspense>
                </Canvas>
              </Box>*/}
            <br/>
            <Container
                maxWidth='md'
            >
            <Box>
                <Box>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Description" {...a11yProps(0)} />
                        <Tab label="Rewards" {...a11yProps(1)} />
                        <Tab label="Milestones" {...a11yProps(2)} />
                        <Tab label="Funding" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                  <Description/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Rewards/>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Milestones/>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <Funding/>
                </TabPanel>
                </Box>
            </Container>
        </Box>
}

function Description(){
  return <Box sx={{ mt: 10 }}>
  <Typography variant="h4">LEVEL UP &</Typography>
  <Typography variant="h2">BE LEGENDARY</Typography>
  <Typography>From the developer of Virgo Versus The Zodiac and Osteoblasts comes a Tactical Rhythm JRPG in which you play as the Singer who fights the oppressive government to bring back Music to a melodyless world. Play as Ailuri, a small hero set on an adventure to protect the world from environmental destruction. Complete vast levels, rescue animals.</Typography>
  <Box 			
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      my: 10
    }}
  >
      <Typography variant="h4">CHOOSE YOUR</Typography>
      <Typography variant="h2">CHAMPION</Typography>

      <Stack direction="row" sx={{ width: '100%' }}>
        {[0,1,2,3,4].map(x => <TileReward/>)}
      </Stack>
  </Box>
  <Box 			
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      my: 10
    }}
  >
      <Typography variant="h4">SOME CATCHY</Typography>
      <Typography variant="h2">HEADLINE</Typography>
      <Typography>From the developer of Virgo Versus The Zodiac and Osteoblasts comes a Tactical Rhythm JRPG in which you play as the Singer who fights the oppressive government to bring back Music to a melodyless world. Play as Ailuri, a small hero set on an adventure to protect the world from environmental destruction. Complete vast levels, rescue animals.</Typography>
  </Box>

  <Box 			
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      my: 10
    }}
  >
      <Typography variant="h4">STUNNING &</Typography>
      <Typography variant="h2">MYSTICAL WORLDS</Typography>
      <Image16to9 sx={{ overflow: 'hidden', width: '100%' }} />
      <Stack direction="row" sx={{ width: '100%' }}>
        <Image16to9 sx={{ overflow: 'hidden', m: 1, flex: '1 1 auto' }} src=""/>
        <Image16to9 sx={{ overflow: 'hidden', m: 1, flex: '1 1 auto' }} src=""/>
        <Image16to9 sx={{ overflow: 'hidden', m: 1, flex: '1 1 auto' }} src=""/>
        <Image16to9 sx={{ overflow: 'hidden', m: 1, flex: '1 1 auto' }} src=""/>
      </Stack>
 </Box>
</Box>
}


function Rewards(){
  return <Box sx={{ mt: 10 }}>
  <Typography variant="h4">PRE HEADLINE</Typography>
  <Typography variant="h2">REWARDS</Typography>
  <Typography>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo.</Typography>
  <Box 			
    sx={{
      display: 'flex',
      flexFlow: 'row wrap',
    }}
  >
    <TileReward disabled/>
    {[0,1,2,3,4].map(x => <TileReward/>)}
  </Box>
</Box>
}

function Milestones(){
  return <Box sx={{ mt: 10 }}>
    <Typography variant="h4">PRE HEADLINE</Typography>
    <Typography variant="h2">MILESTONES</Typography>
    <Typography>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo.</Typography>
  </Box>
}

function Funding(){
  return <Box sx={{ mt: 10 }}>
    <Typography variant="h4">PRE HEADLINE</Typography>
    <Typography variant="h2">FUNDING</Typography>
    <Typography>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo.</Typography>
  </Box>
}





export default function Component(props) {
	const apiProvider = useApiProvider()
	return apiProvider ? <Campaign /> : null
}
