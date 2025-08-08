import { Form, FormInput, FormSelect, FormSubmit } from '@/hooks';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './CreateLanguageForm.texts'
import { ContentSidebar } from '@/components/layout';
import { Fragment } from 'react';
import { Card, Container } from '@/components/common';
import { CardProps } from '@/components/common/Card/Card.types';
import { languageLevels } from '@/app.config';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { LanguageData } from '@/types/database.types';
import { useRouter } from 'next/navigation';

export default function CreateLanguageForm() {
   const { textResources } = useTextResources(texts);
   const ajax = useAjax();
   const router = useRouter();

   const cardProps: CardProps = { padding: 'm' };

   const handleSubmit = async (values: FormValues) => {
      try {
         const created = await ajax.post<LanguageData>('/language/create', values);

         if (!created.success) {
            throw created;
         }

         if (created.data?.id) {
            router.push(`/admin/language/${created.data.id}`);
         }

         return created;
      } catch (error) {
         throw error;
      }
   };

   return (
      <Container>
         <Form hideSubmit onSubmit={handleSubmit}>
            <ContentSidebar>
               <Fragment>
                  <Card {...cardProps}>
                     <FormInput
                        fieldName="default_name"
                        label={textResources.getText('CreateLanguageForm.default_name.label')}
                        placeholder={textResources.getText('CreateLanguageForm.default_name.placeholder')}
                     />
                     <FormInput
                        fieldName="local_name"
                        label={textResources.getText('CreateLanguageForm.local_name.label')}
                        placeholder={textResources.getText('CreateLanguageForm.local_name.placeholder')}
                     />
                     <FormInput
                        fieldName="locale_code"
                        label={textResources.getText('CreateLanguageForm.locale_code.label')}
                        placeholder={textResources.getText('CreateLanguageForm.locale_code.placeholder')}
                        max={2}
                     />
                  </Card>
               </Fragment>

               <Fragment>
                  <Card {...cardProps}>
                     <FormSelect
                        fieldName="reading_level"
                        label={textResources.getText('CreateLanguageForm.reading_level.label')}
                        options={languageLevels}
                     />
                     <FormSelect
                        fieldName="writing_level"
                        label={textResources.getText('CreateLanguageForm.writing_level.label')}
                        options={languageLevels}
                     />
                     <FormSelect
                        fieldName="speaking_level"
                        label={textResources.getText('CreateLanguageForm.speaking_level.label')}
                        options={languageLevels}
                     />
                     <FormSelect
                        fieldName="listening_level"
                        label={textResources.getText('CreateLanguageForm.listening_level.label')}
                        options={languageLevels}
                     />
                  </Card>
                  <Card {...cardProps}>
                     <FormSubmit label={textResources.getText('CreateLanguageForm.submit.label')} fullWidth />
                  </Card>
               </Fragment>
            </ContentSidebar>
         </Form>
      </Container>
   );
}
