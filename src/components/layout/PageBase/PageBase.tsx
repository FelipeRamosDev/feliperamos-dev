'use client';

import React from 'react';
import { PageBaseProps } from './PageBase.types';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material';
import defaultTheme from '@/theme/defaultTheme';
import store from '@/store';
import { TopHeader } from '@/components/headers';

export default function PageBase({ children }: PageBaseProps): React.ReactElement {
   return (
      <main className="PageBase">
         <Provider store={store}>
            <ThemeProvider theme={defaultTheme}>
               <TopHeader />
               {children}
            </ThemeProvider>
         </Provider>
      </main>
   );
}
