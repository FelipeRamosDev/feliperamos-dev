'use client';

import { ThemeProvider } from '@mui/material/styles';
import defaultTheme from '@/theme/defaultTheme';
import Page from '../components/Page';

export default function Home() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Page />
    </ThemeProvider>
  );
}
