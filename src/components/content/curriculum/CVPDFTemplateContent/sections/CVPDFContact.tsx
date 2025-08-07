import { onlyNumbers, parseCSS } from '@/helpers/parse.helpers';
import styles from '../CVPDFTemplateContent.module.scss';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../CVPDFTemplateContext.text';
import { Email, GitHub, LinkedIn, Monitor, Phone, WhatsApp } from '@mui/icons-material';
import Link from 'next/link';
import { useCVPDFTemplate } from '../CVPDFTemplateContext';
import { Container } from '@/components/common';

export default function CVPDFContact() {
   const cv = useCVPDFTemplate();
   const { textResources } = useTextResources(texts);
   const CSS = parseCSS('CVPDFContact', styles.CVPDFContact);

   const iconSize = 'small'
   const whatsAppNumber = onlyNumbers(cv.user?.whatsapp_number);
   const whatsAppLink = whatsAppNumber ? `https://wa.me/${whatsAppNumber}` : '#';

   return (
      <section className={CSS}>
         <Container fullwidth>
            {/* <h2>{textResources.getText('CVPDFHeader.header.contactTitle')}</h2>
            <hr /> */}

            <ul>
               <li>
                  <label><Email fontSize={iconSize} /></label>
                  <Link href={`mailto:${cv.user?.email}`}>{cv.user?.email}</Link>
               </li>
               <li>
                  <label><Phone fontSize={iconSize} /></label>
                  <Link href={`tel:${cv.user?.phone}`}>{cv.user?.phone}</Link>
               </li>
               <li>
                  <label><GitHub fontSize={iconSize} /></label>
                  <Link href={cv.user?.github_url || '#'}>{textResources.getText('CVPDFHeader.header.github')}</Link>
               </li>
               <li>
                  <label><LinkedIn fontSize={iconSize} /></label>
                  <Link href={cv.user?.linkedin_url || '#'}>{textResources.getText('CVPDFHeader.header.linkedin')}</Link>
               </li>
               <li>
                  <label><Monitor fontSize={iconSize} /></label>
                  <Link href={cv.user?.portfolio_url || '#'}>{textResources.getText('CVPDFHeader.header.website')}</Link>
               </li>
               <li>
                  <label><WhatsApp fontSize={iconSize} /></label>
                  <Link href={whatsAppLink}>{textResources.getText('CVPDFHeader.header.whatsapp')}</Link>
               </li>
            </ul>
         </Container>
      </section>
   )
}
