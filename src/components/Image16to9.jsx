import { Box } from '.'


export function Image16to9({src, sx}){
    return <Box sx={{
            position: 'relative',
            /* 16:9 aspect ratio */
            paddingBottom: '56.25%',
            ...sx
        }}>
          <img style={{
            position: 'absolute',
            objectFit: 'cover',
            width: '100%',
          }} src={src || 'https://picsum.photos/1240'} />
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