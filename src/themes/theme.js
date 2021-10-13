import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f50057',
    },
    secondary: {
      main: '#3f51b5',
    },
  },
  shape: {
    borderRadius: 1
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true, // No more ripple, on the whole application 💣!
      },
    },
  },
});


export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#f50057',
    },
    secondary: {
      main: '#3f51b5',
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true, // No more ripple, on the whole application 💣!
      },
    },
  },
});