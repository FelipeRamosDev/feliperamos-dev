'use client';

import { ThemeProvider } from '@mui/material/styles';
import defaultTheme from '@/theme/defaultTheme';
import Page from '../components/Page';
import { Provider } from 'react-redux';
import store from '@/store';

export default function Home() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <Page />
      </ThemeProvider>
    </Provider>
  );
}
