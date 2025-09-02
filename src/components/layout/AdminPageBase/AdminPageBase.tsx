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
   const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);

   useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      setWindowWidth(window.innerWidth);

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   useEffect(() => {
      if (windowWidth !== undefined && windowWidth > 768) {
         setMenuOpen(true);
      }
   }, [windowWidth]);

   const toggleMenu = () => {
      if (windowWidth !== undefined && windowWidth > 768) {
         return;
      }

      setMenuOpen(!menuOpen);
   };

   return (
      <main className="AdminPageBase">
         <TextResourcesProvider language={language}>
            <Provider store={store}>
               <ThemeProvider theme={defaultTheme}>
                  <TopHeader adminMenus fullwidth menuState={menuOpen} toggleMenu={toggleMenu} />

                  <AuthProvider spinnerHeight="82vh" redirectLogin>
                     <div className="page-content">
                        <AdminMenu open={menuOpen} />

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
