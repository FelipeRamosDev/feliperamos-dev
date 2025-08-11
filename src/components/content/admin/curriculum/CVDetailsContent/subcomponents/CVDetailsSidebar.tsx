import { Fragment, useState } from 'react';
import { CVDetailsSubcomponentProps } from '../CVDetailsContent.types';
import { Card } from '@/components/common';
import { DataContainer } from '@/components/layout';
import { useCVDetails } from '../CVDetailsContext';
import { WidgetHeader } from '@/components/headers';
import { SkillBadge } from '@/components/badges';
import { EditButtons } from '@/components/buttons';
import { EditCVSkillsForm, EditCVMasterForm, EditCVLanguagesForm } from '@/components/forms/curriculums';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../CVDetailsContent.text';
import styles from '../CVDetailsContent.module.scss';
import { Form, FormSubmit } from '@/hooks';
import { useAjax } from '@/hooks/useAjax';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import { cvPDFDownloadLink } from '@/helpers/app.helpers';
import Link from 'next/link';
import { LanguageTile } from '@/components/tiles';

export default function CVDetailsSidebar({ cardProps }: CVDetailsSubcomponentProps): React.ReactElement {
   const [editMode, setEditMode] = useState<boolean>(false);
   const [languagesEdit, setLanguagesEdit] = useState<boolean>(false);
   const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
   const { textResources } = useTextResources(texts);
   const cv = useCVDetails();
   const ajax = useAjax();
   const router = useRouter();
   const cv_skills = cv?.cv_skills || [];
   const cv_languages = cv?.cv_languages || [];

   const handleDelete = async () => {
      const confirmMessage = textResources.getText('CVDetailsSidebar.confirmDelete');
      const confirmed = confirm(confirmMessage);

      if (!confirmed) {
         return { success: true };
      }

      try {
         setDeleteLoading(true);
         const deleted = await ajax.post('/curriculum/delete', { cvId: cv?.id });
         if (!deleted.success) {
            return deleted;
         }

         router.push('/admin');
         return deleted;
      } catch (error) {
         throw error;
      } finally {
         setDeleteLoading(false);
      }
   }

   return (
      <Fragment>
         <Card {...cardProps}>
            <WidgetHeader title={textResources.getText('CVDetailsSidebar.pdf.widgetTitle')} />

            <div className={styles.pdfDownload}>
               <Button
                  className={styles.downloadButton}
                  LinkComponent={Link}
                  href={cvPDFDownloadLink(cv, 'en')}
                  target="_blank"
               >
                  {textResources.getText('CVDetailsSidebar.pdf.downloadButton.en')}
               </Button>
               <Button
                  className={styles.downloadButton}
                  LinkComponent={Link}
                  href={cvPDFDownloadLink(cv, 'pt')}
                  target="_blank"
               >
                  {textResources.getText('CVDetailsSidebar.pdf.downloadButton.pt')}
               </Button>
            </div>
         </Card>
         <Card {...cardProps}>
            {!cv.is_master ? (
               <EditCVMasterForm />
            ) : (
               <div className={styles.masterDisplay}>
                  {textResources.getText('CVDetailsSidebar.is_master.text')}
               </div>
            )}
         </Card>

         <Card {...cardProps}>
            <DataContainer vertical>
               <label>{textResources.getText('CVDetailsSidebar.field.id.label')}</label>
               <p>{cv.id}</p>
            </DataContainer>
            <DataContainer vertical>
               <label>{textResources.getText('CVDetailsSidebar.field.createdAt.label')}</label>
               <p>{new Date(cv.created_at).toLocaleString()}</p>
            </DataContainer>
            {cv.updated_at && (
               <DataContainer vertical>
                  <label>{textResources.getText('CVDetailsSidebar.field.updatedAt.label')}</label>
                  <p>{new Date(cv.updated_at).toLocaleString()}</p>
               </DataContainer>
            )}
         </Card>

         <Card {...cardProps}>
            <WidgetHeader title={textResources.getText('CVDetailsSidebar.skills.widgetTitle')}>
               <EditButtons
                  editMode={editMode}
                  setEditMode={setEditMode}
               />
            </WidgetHeader>

            {editMode && <EditCVSkillsForm />}
            {!editMode && <div className="skills-list">
               {cv_skills.length > 0 && cv_skills.map((skill) => (
                  <SkillBadge key={skill.id} value={skill.name} />
               ))}
            </div>}
         </Card>

         <Card {...cardProps}>
            <WidgetHeader title={textResources.getText('CVDetailsSidebar.languages.widgetTitle')}>
               <EditButtons
                  editMode={languagesEdit}
                  setEditMode={setLanguagesEdit}
               />
            </WidgetHeader>

            {languagesEdit && <EditCVLanguagesForm />}
            {!languagesEdit && <div className="languages-list">
               {cv_languages.length > 0 ? (
                  cv_languages.map((lang) => (
                     <LanguageTile key={lang.id} language={lang} />
                  ))
               ) : (
                  <p>{textResources.getText('CVDetailsSidebar.languages.noLanguages')}</p>
               )}
            </div>}
         </Card>

         <Card {...cardProps}>
            <Form hideSubmit onSubmit={handleDelete}>
               <FormSubmit
                  color="error"
                  loading={deleteLoading}
                  label={textResources.getText('CVDetailsSidebar.button.delete')}
               />
            </Form>
         </Card>
      </Fragment>
   );
}
