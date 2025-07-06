import { Container } from "@/components/common";
import { useTextResources } from "@/services/TextResources/TextResourcesProvider";
import basicFooterText from "./BasicFooter.text";

export default function BasicFooter() {
   const { textResources } = useTextResources(basicFooterText);
   const copywriteText = textResources.getText('BasicFooter.copywrite');

   return (
      <footer className="BasicFooter">
         <Container>
            <p className="company-info">{copywriteText}</p>
         </Container>
      </footer>
   );
}
