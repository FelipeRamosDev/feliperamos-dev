import { createTheme } from '@mui/material/styles';

export default createTheme({
   palette: {
      primary: { main: '#006C67' },
      secondary: { main: '#0D1B2A' },
      tertiary: { main: '#8FE388' },
      success: { main: '#8FE388' },
      error: { main: '#e74438' },
   },
   components: {
      MuiButton: {
         defaultProps: {
            variant: 'contained'
         }
      }
   }
});
