import { Button, Drawer } from '@mui/material';
import { AdminMenuProps, MenuItem } from './AdminMenu.types';
import { parseCSS } from '@/helpers/parse.helpers';
import styles from './AdminMenu.module.scss';
import Link from 'next/link';
import { Dashboard } from '@mui/icons-material';
import { useEffect, useState } from 'react';

const MENU_ITEMS: MenuItem[] = [
   {
      label: 'Dashboard',
      href: '/admin',
      icon: <Dashboard />,
   }
];

export default function AdminMenu({ className, open }: AdminMenuProps): React.ReactElement {
   const [ currentPath, setCurrentPath ] = useState<string>('');

   const classes = parseCSS(className, [
      'AdminMenu',
      styles.AdminMenu,
      open ? 'opened' : 'closed',
   ]);

   useEffect(() => {
      const url = new URL(window.location.href);
      setCurrentPath(url.pathname);
   }, []);

   return (
      <Drawer
         className={classes}
         variant="persistent"
         anchor="left"
         open={open}
      >
         <nav>
            <span className={styles.sectionTitle}>Pages</span>

            {MENU_ITEMS.map((item, index) => (
               <Button
                  key={item.href + index}
                  LinkComponent={Link}
                  variant="text"
                  href={item.href}
                  startIcon={item.icon}
                  fullWidth
                  className={parseCSS(
                     styles.buttonLink,
                     currentPath === item.href ? styles.current : ''
                  )}
               >
                  {item.label}
               </Button>
            ))}
         </nav>
      </Drawer>
   )
}
