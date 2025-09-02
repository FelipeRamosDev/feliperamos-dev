'use client';

import { useEffect, useState } from 'react';
import { AdminPageBaseProps } from './AdminPageBase.types';
import { ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import defaultTheme from '@/theme/defaultTheme';
import store from '@/store';
import { TopHeader } from '@/components/headers';
import { BasicFooter } from '@/components/footers';
import { TextResourcesProvider } from '@/services/TextResources/TextResourcesProvider';
import { AuthProvider } from '@/services';
import { AdminMenu } from '@/components/menus';

export default function AdminPageBase({ language, children }: AdminPageBaseProps): React.ReactElement {
   const [menuOpen, setMenuOpen] = useState(false);

   const toggleMenu = () => {
      if (window.innerWidth > 768) {
         return;
      }

      setMenuOpen(!menuOpen);
   };

   useEffect(() => {
      if (window.innerWidth > 768) {
         setMenuOpen(true);
      }
   }, []);

   return (
      <main className="AdminPageBase">
         <TextResourcesProvider language={language}>
            <Provider store={store}>
               <ThemeProvider theme={defaultTheme}>
                  <TopHeader adminMenus fullwidth menuState={menuOpen} toggleMenu={toggleMenu} />

                  <AuthProvider spinnerHeight="82vh" redirectLogin>
                     <div className="page-content">
                        <AdminMenu toggleMenu={toggleMenu} open={menuOpen} />

                        <div className="content">
                           {children}
                        </div>
                     </div>
                  </AuthProvider>

                  <BasicFooter />
               </ThemeProvider>
            </Provider>
         </TextResourcesProvider>
      </main>
   );
}
