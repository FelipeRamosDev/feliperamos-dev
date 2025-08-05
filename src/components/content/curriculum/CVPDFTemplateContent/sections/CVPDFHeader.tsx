import Link from 'next/link';
import { useCVPDFTemplate } from '../CVPDFTemplateContext';
import { parseCSS } from '@/helpers/parse.helpers';
import styles from '../CVPDFTemplateContent.module.scss';
import { Container, Markdown } from '@/components/common';
import { Email, GitHub, LinkedIn, Monitor, Phone, WhatsApp } from '@mui/icons-material';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../CVPDFTemplateContext.text';

export default function CVPDFHeader({ className }: { className?: string }): React.ReactElement {
   const cv = useCVPDFTemplate();
   const { textResources } = useTextResources(texts);
   const whatsAppNumber = cv.user?.whatsapp_number?.replace(/[^0-9]/g, '');
   const whatsAppLink = whatsAppNumber ? `https://wa.me/${whatsAppNumber}` : '#';

   const iconSize = 'small';
   const CSS = parseCSS(className, [
      'CVPDFHeader',
      styles.CVPDFHeader,
   ]);

   return (
      <header className={CSS}>
         <Container fullwidth>
            <div className={styles.headerInfo}>
               <h1>{cv.user?.first_name} {cv.user?.last_name}</h1>
               <p>{cv.job_title}</p>
               <span>{textResources.getText('CVPDFHeader.header.experienceTime', String(cv.experience_time))}</span>
            </div>
            
            <Markdown
               className={styles.headerSummary}
               value={cv.summary}
            />

            <div className={styles.contactInfos}> 
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
            </div>
         </Container>
      </header>
   );
}
