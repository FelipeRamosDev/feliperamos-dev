'use client';

import { CVPDFTemplateContentProps } from './CVPDFTemplateContent.types';
import CVPDFTemplateProvider from './CVPDFTemplateContext';
import CVPDFHeader from './sections/CVPDFHeader';
import CVPDFSkills from './sections/CVPDFSkills';
import CVPDFExperiences from './sections/CVPDFExperience';
import { parseCSS } from '@/helpers/parse.helpers';
import styles from './CVPDFTemplateContent.module.scss';
import CVPDFContact from './sections/CVPDFContact';
import CVPDFSummary from './sections/CVPDFSummary';

export default function CVPDFTemplateContent({ cv }: CVPDFTemplateContentProps): React.ReactElement {
   const CSS = parseCSS('CVPDFTemplateContent', styles.CVPDFTemplateContent);

   return (
      <CVPDFTemplateProvider cv={cv}>
         <div className={CSS}>
            <CVPDFHeader />
            <CVPDFContact />
            <CVPDFSummary />
            <CVPDFSkills />
            <CVPDFExperiences />
         </div>
      </CVPDFTemplateProvider>
   );
}
