import { Container } from '@/components/common';
import { Logo } from '@/components/common';
import Link from 'next/link';
import { TopHeaderProps } from './TopHeader.types';
import Image from 'next/image';

export default function TopHeader({ adminMenus }: TopHeaderProps): React.JSX.Element {
   return (
      <header className="TopHeader">
         <Container>
            <Link href="/">
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
