import { Container } from "@/components/common";
import Logo from "@/components/common/Logo/Logo";

export default function TopHeader(): React.JSX.Element {
   return (
      <header className="TopHeader">
         <Container>
            <Logo />
         </Container>
      </header>
   );
}
