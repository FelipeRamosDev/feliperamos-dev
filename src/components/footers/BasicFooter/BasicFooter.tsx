import { Container } from "@/components/common";
import { useTextResources } from "@/services/TextResources/TextResourcesProvider";
import basicFooterText from "./BasicFooter.text";

export default function BasicFooter() {
   const { textResources } = useTextResources(basicFooterText);
   const copyrightText = textResources.getText('BasicFooter.copyright');

   return (
      <footer className="BasicFooter">
         <Container>
            <p className="company-info">{copyrightText}</p>
         </Container>
      </footer>
   );
}
