import { Container } from "@/components/common";
import { useTextResources } from "@/services/TextResources/TextResourcesProvider";
import basicFooterText from "./BasicFooter.text";
import { BasicFooterProps } from "./BasicFooter.types";

export default function BasicFooter({ fullwidth }: BasicFooterProps): React.JSX.Element {
   const { textResources } = useTextResources(basicFooterText);
   const copyrightText = textResources.getText('BasicFooter.copyright');

   return (
      <footer className="BasicFooter">
         <Container fullwidth={fullwidth}>
            <p className="company-info">{copyrightText}</p>
         </Container>
      </footer>
   );
}
