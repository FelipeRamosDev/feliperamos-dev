import { Button, Drawer } from '@mui/material';
import { AdminMenuProps, MenuItem } from './AdminMenu.types';
import { parseCSS } from '@/helpers/parse.helpers';
import styles from './AdminMenu.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
   Dashboard,
   RequestQuote,
   PictureAsPdf,
   WorkHistory,
   Store,
   DownhillSkiing,
   School,
   Language,
   MarkAsUnread
} from '@mui/icons-material';

const MENU_ITEMS: MenuItem[] = [
   {
      label: 'Dashboard',
      href: '/admin',
      icon: <Dashboard />,
   },
   {
      label: 'Curriculums',
      href: '#',
      icon: <PictureAsPdf />,
   },
   {
      label: 'Cover Letters',
      href: '/admin/cover-letter/search',
      icon: <MarkAsUnread />,
   },
   {
      label: 'Experiences',
      href: '#',
      icon: <WorkHistory />,
   },
   {
      label: 'Opportunities',
      href: '/admin/opportunity/search',
      icon: <RequestQuote />,
   },
   {
      label: 'Companies',
      href: '#',
      icon: <Store />,
   },
   {
      label: 'Skills',
      href: '#',
      icon: <DownhillSkiing />,
   },
   {
      label: 'Educations',
      href: '#',
      icon: <School />,
   },
   {
      label: 'Languages',
      href: '#',
      icon: <Language />,
   },
];

export default function AdminMenu({ className, open }: AdminMenuProps): React.ReactElement {
   const currentPath = usePathname();

   const classes = parseCSS(className, [
      'AdminMenu',
      styles.AdminMenu,
      open ? 'opened' : 'closed',
   ]);

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
