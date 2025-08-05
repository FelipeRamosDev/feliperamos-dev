import { Container } from '@/components/common';
import { Logo } from '@/components/common';
import Link from 'next/link';
import { TopHeaderProps } from './TopHeader.types';
import Image from 'next/image';
import { useAuth } from '@/services';

export default function TopHeader({ adminMenus, fullwidth }: TopHeaderProps): React.JSX.Element {
   const { user } = useAuth();
   const avatarUrl = user?.avatar_url || '/images/user-avatar.jpg';

   return (
      <header className="TopHeader">
         <Container fullwidth={fullwidth}>
            <Link href="/">
               <Logo />
            </Link>

            {adminMenus && (
               <Link className="user-avatar" href="/admin/my-profile">
                  <Image
                     src={avatarUrl}
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
