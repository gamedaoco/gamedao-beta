import { Box } from '.'


export function Image16to9({src}){
    return <Box sx={{
            position: 'relative',
            /* 16:9 aspect ratio */
            paddingBottom: '56.25%',
        }}>
          <img style={{
            position: 'absolute',
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            maxHeight: "66vh"
          }} src={src} />
        </Box>
}


export function Box16to9({children, sx}){
  return <Box sx={{
          position: 'relative',
          /* 16:9 aspect ratio */
          paddingBottom: '56.25%',
          ...sx
      }}>
        {children}
      </Box>
}