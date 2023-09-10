import { ThemeOptions } from '@mui/material/styles';

const baseFonts = ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'];
const titleFonts = ['"DM Sans"', ...baseFonts];

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#6769c2',
    },
    secondary: {
      main: '#c067c2',
    },
    error: {
      main: '#c1484f',
    },
    info: {
      main: '#6796c2',
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    fontFamily: baseFonts.join(','),
    h1: {
      fontFamily: titleFonts.join(','),
      fontWeight: 600
    },
    h2: {
      fontFamily: titleFonts.join(','),
      fontWeight: 600
    },
    h3: {
      fontFamily: titleFonts.join(','),
      fontWeight: 600
    },
    h4: {
      fontFamily: titleFonts.join(','),
      fontWeight: 600
    },
    h5: {
      fontFamily: titleFonts.join(','),
      fontWeight: 600
    },
    button: {
      fontFamily: titleFonts.join(','),
      fontWeight: 600,
      textTransform: 'none'
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          paddingInline: 24,
          paddingTop: 9,
          paddingBottom: 9,
        }
      }
    }
  }
};
