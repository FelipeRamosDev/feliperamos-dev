import { createTheme } from '@mui/material/styles';

export default createTheme({
   palette: {
      primary: { main: '#071E22' },
      secondary: { main: '#0FA3B1' },
      tertiary: { main: '#B0FE76' },
      success: { main: '#B0FE76' }
   },
   components: {
      MuiButton: {
         defaultProps: {
            variant: 'contained'
         }
      }
   }
});
