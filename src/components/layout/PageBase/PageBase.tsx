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
   hideFooter = false,
   fullwidth = false,
   customHeader,
   children
}: PageBaseProps): React.ReactElement {
   const Header = (): React.ReactNode => customHeader || <TopHeader fullwidth={fullwidth} />;
   const Footer = (): React.ReactNode => !hideFooter && <BasicFooter fullwidth={fullwidth} />;

   return (
      <main className="PageBase">
         <TextResourcesProvider language={language}>
            <Provider store={store}>
               <ThemeProvider theme={defaultTheme}>
                  <Header />
                  {children}
                  <Footer />
               </ThemeProvider>
            </Provider>
         </TextResourcesProvider>
      </main>
   );
}
