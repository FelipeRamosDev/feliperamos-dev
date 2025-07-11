'use client';

import React from 'react';
import { AdminPageBaseProps } from './AdminPageBase.types';
import { ThemeProvider } from '@mui/material';
import defaultTheme from '@/theme/defaultTheme';
import { TopHeader } from '@/components/headers';
import { BasicFooter } from '@/components/footers';
import { TextResourcesProvider } from '@/services/TextResources/TextResourcesProvider';
import { AuthProvider } from '@/services';

export default function AdminPageBase({ language, children }: AdminPageBaseProps): React.ReactElement {
   return (
      <main className="AdminPageBase">
         <TextResourcesProvider language={language}>
            <ThemeProvider theme={defaultTheme}>
               <TopHeader />

               <AuthProvider spinnerHeight="82vh" redirectLogin>
                  {children}
               </AuthProvider>

               <BasicFooter />
            </ThemeProvider>
         </TextResourcesProvider>
      </main>
   );
}
