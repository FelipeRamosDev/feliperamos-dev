'use client';

import { ThemeProvider } from '@mui/material/styles';
import defaultTheme from '@/theme/defaultTheme';
import Page from '../components/Page';
import { Provider } from 'react-redux';
import store from '@/store';
import { SocketProvider } from '@/services/SocketClient';

export default function Home() {
  return (
    <SocketProvider config={{ url: 'https://localhost:5000/cv-chat' }}>
      <Provider store={store}>
        <ThemeProvider theme={defaultTheme}>
          <Page />
        </ThemeProvider>
      </Provider>
    </SocketProvider>
  );
}
