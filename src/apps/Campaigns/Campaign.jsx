import * as React from 'react';
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
    Slider
} from '../../components'

import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense } from "react";

const Model = () => {
  const gltf = useLoader(GLTFLoader, "/assets/models/tangram/Tangram.gltf");
  return (
    <>
      <primitive object={gltf.scene} scale={0.4} />
    </>
  );
};


function Renderer() {
  return (
    <>
      <Canvas>
        <Suspense fallback={null}>
          <Model />
          <OrbitControls />
          <Environment preset="dawn" background />
        </Suspense>
      </Canvas>
    </>
  );
}



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



export default function Campaign(){
    const id = useParams().id
    const t = ['Open World', 'Trending', 'Survivial']

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
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
                                    return <Chip label="Chip Outlined" variant="outlined" />
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
                    Item One
                </TabPanel>
                <TabPanel value={value} index={1}>
                    Item Two
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Item Three
                </TabPanel>
                </Box>
            </Container>
        </Box>
}
