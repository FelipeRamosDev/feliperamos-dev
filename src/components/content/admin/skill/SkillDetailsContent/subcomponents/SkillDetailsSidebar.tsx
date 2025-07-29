import { Card } from '@/components/common';
import { DataContainer } from '@/components/layout';
import { Fragment, useState } from 'react';
import { useSkillDetails } from '../SkillDetailsContext';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../SkillDetailsContent.text';
import { Form, FormSubmit } from '@/hooks';
import { useRouter } from 'next/navigation';
import { useAjax } from '@/hooks/useAjax';

export default function SkillDetailsSidebar(): React.ReactElement {
   const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
   const skill = useSkillDetails();
   const { textResources } = useTextResources(texts);
   const router = useRouter();
   const ajax = useAjax();

   const handleDelete = async () => {
      const confirmMessage = textResources.getText('SkillDetailsSidebar.confirmDelete');
      const confirmed = confirm(confirmMessage);

      if (!confirmed) {
         return { success: true };
      }

      try {
         setDeleteLoading(true);
         const deleted = await ajax.post('/skill/delete', { skillId: skill?.id });
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
         <Card padding="l">
            <DataContainer>
               <label>{textResources.getText('SkillDetailsSidebar.skillSidebar.id')}</label>
               <span>{skill.id}</span>
            </DataContainer>
         </Card>

         <Card padding="l">
            <Form hideSubmit onSubmit={handleDelete}>
               <FormSubmit
                  color="error"
                  label={textResources.getText('SkillDetailsSidebar.button.delete')}
                  loading={deleteLoading}
               />
            </Form>
         </Card>
      </Fragment>
   );
}
