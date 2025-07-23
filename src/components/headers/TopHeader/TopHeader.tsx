import { Container } from "@/components/common";
import Logo from "@/components/common/Logo/Logo";
import Link from "next/link";

export default function TopHeader(): React.JSX.Element {
   return (
      <header className="TopHeader">
         <Container>
            <Link href="/">
               <Logo />
            </Link>
         </Container>
      </header>
   );
}
