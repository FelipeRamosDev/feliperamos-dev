import Link from 'next/link';
import { useCVPDFTemplate } from '../CVPDFTemplateContext';
import { parseCSS } from '@/helpers/parse.helpers';
import styles from '../CVPDFTemplateContent.module.scss';
import { Container, Markdown } from '@/components/common';
import { Email, GitHub, LinkedIn, Monitor, Phone, WhatsApp } from '@mui/icons-material';

export default function CVPDFHeader({ className }: { className?: string }): React.ReactElement {
   const cv = useCVPDFTemplate();
   const iconSize = 'small';
   const CSS = parseCSS(className, [
      'CVPDFHeader',
      styles.CVPDFHeader,
   ]);

   return (
      <header className={CSS}>
         <Container className={styles.headerFlex} fullwidth>
            <div className={styles.headerInfo}>
               <h1>{cv.user?.first_name} {cv.user?.last_name}</h1>
               <p>{cv.job_title}</p>
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
                     <Link href={cv.user?.github_url || '#'}>GitHub Profile</Link>
                  </li>
                  <li>
                     <label><LinkedIn fontSize={iconSize} /></label>
                     <Link href={cv.user?.linkedin_url || '#'}>LinkedIn Profile</Link>
                  </li>
                  <li>
                     <label><Monitor fontSize={iconSize} /></label>
                     <Link href={cv.user?.portfolio_url || '#'}>Website</Link>
                  </li>
                  <li>
                     <label><WhatsApp fontSize={iconSize} /></label>
                     <Link href={`https://wa.me/${cv.user?.whatsapp_number}`}>WhatsApp</Link>
                  </li>
               </ul>
            </div>
         </Container>
      </header>
   );
}
