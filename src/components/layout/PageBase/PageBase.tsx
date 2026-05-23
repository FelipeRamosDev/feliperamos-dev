'use client';

import React from 'react';
import { PageBaseProps } from './PageBase.types';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material';
import defaultTheme from '@/theme/defaultTheme';
import store from '@/store';
import { TopHeader } from '@/components/headers';
import { BasicFooter } from '@/components/footers';
import { TextResourcesProvider } from '@/services/TextResources/TextResourcesProvider';

export default function PageBase({
   language,
   hideHeader = false,
   hideFooter = false,
   fullwidth = false,
   customHeader,
   children
}: PageBaseProps): React.ReactElement {
   return (
      <main className="PageBase" data-language={String(language)} data-testid="page-base">
         <TextResourcesProvider language={language}>
            <Provider store={store}>
               <ThemeProvider theme={defaultTheme}>
                  {!hideHeader && (customHeader || <TopHeader fullwidth={fullwidth} />)}
                  {children}
                  {!hideFooter && <BasicFooter fullwidth={fullwidth} />}
               </ThemeProvider>
            </Provider>
         </TextResourcesProvider>
      </main>
   );
}
