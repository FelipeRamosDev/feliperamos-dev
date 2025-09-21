import { Form, FormInput, FormSelect, FormSubmit } from '@/hooks';
import { LetterData } from '@/types/database.types';
import { EditLetterFormProps } from './EditLetterForm.types';
import { ContentSidebar } from '@/components/layout';
import { Fragment } from 'react';
import { loadCompaniesOptions, loadOpportunitiesOptions } from '@/helpers/database.helpers';
import { useAjax } from '@/hooks/useAjax';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { Card } from '@/components/common';
import { CardProps } from '@/components/common/Card/Card.types';

export default function EditLetterForm({ letter, updateLetter }: EditLetterFormProps) {
   const { textResources } = useTextResources();
   const ajax = useAjax();
   const cardProps: CardProps = { padding: 'm' };

   const handleSubmit = async (data: Partial<LetterData>) => {
      if (!letter?.id) {
         throw new Error('Letter ID is required for updating');
      }

      try {
         const updated = await updateLetter(letter.id, data);
         return updated;
      } catch (error) {
         return error;
      }
   }

   return (
      <Form<LetterData>
         initialValues={letter}
         onSubmit={handleSubmit}
         editMode
         hideSubmit
      >
         <ContentSidebar>
            <Card {...cardProps}>
               <FormInput
                  fieldName="subject"
                  label="Subject"
                  placeholder="Enter the subject"
               />
               <FormInput
                  fieldName="body"
                  label="Body"
                  placeholder="Enter the body"
                  multiline
               />
            </Card>

            <Fragment>
               <Card {...cardProps}>
                  <FormSelect
                     fieldName="company_id"
                     label="Company"
                     loadOptions={() => loadCompaniesOptions(ajax, textResources)}
                  />
               </Card>
               <Card {...cardProps}>
                  <FormSelect
                     fieldName="opportunity_id"
                     label="Opportunity"
                     loadOptions={() => loadOpportunitiesOptions(ajax, letter?.company_id)}
                  />
               </Card>

               <Card {...cardProps}>
                  <FormSubmit label="Save Changes" />
               </Card>
            </Fragment>
         </ContentSidebar>
      </Form>
   );
}
