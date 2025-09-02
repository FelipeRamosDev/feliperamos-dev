import { Container } from '@/components/common';
import { Logo } from '@/components/common';
import Link from 'next/link';
import { TopHeaderProps } from './TopHeader.types';
import Image from 'next/image';
import { IconButton } from '@mui/material';
import { MenuOpen, Close } from '@mui/icons-material';

export default function TopHeader({ adminMenus, fullwidth, menuState, toggleMenu }: TopHeaderProps): React.JSX.Element {
   return (
      <header className="TopHeader">
         <Container fullwidth={fullwidth}>
            {toggleMenu && <IconButton className="menu-button" aria-label="Menu Button" onClick={toggleMenu}>
               {menuState ? <Close /> : <MenuOpen />}
            </IconButton>}

            <Link href="/" className="logo-wrap">
               <Logo />
            </Link>

            {adminMenus && (
               <Link className="user-avatar" href="/admin/my-profile">
                  <Image
                     src="/images/user-avatar.jpg"
                     alt="User Avatar"
                     width={40}
                     height={40}
                     quality={60}
                  />
               </Link>
            )}
         </Container>
      </header>
   );
}
