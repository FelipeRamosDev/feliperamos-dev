'use client';

import { CVPDFTemplateContentProps } from './CVPDFTemplateContent.types';
import CVPDFTemplateProvider from './CVPDFTemplateContext';
import CVPDFHeader from './sections/CVPDFHeader';
import CVPDFSkills from './sections/CVPDFSkills';
import CVPDFExperiences from './sections/CVPDFExperience';
import { parseCSS } from '@/helpers/parse.helpers';
import styles from './CVPDFTemplateContent.module.scss';

export default function CVPDFTemplateContent({ cv }: CVPDFTemplateContentProps): React.ReactElement {
   const CSS = parseCSS('CVPDFTemplateContent', styles.CVPDFTemplateContent);

   return (
      <CVPDFTemplateProvider cv={cv}>
         <div className={CSS}>
            <CVPDFHeader />
            <CVPDFSkills />
            <CVPDFExperiences />
         </div>
      </CVPDFTemplateProvider>
   );
}
