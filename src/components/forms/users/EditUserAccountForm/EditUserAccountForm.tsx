import { updateUserData } from '@/helpers/database.helpers';
import { Form, FormInput } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { useAuth } from '@/services';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './EditUserAccountForm.text';

export default function EditUserAccountForm() {
   const { textResources } = useTextResources(texts);
   const { user } = useAuth();
   const ajax = useAjax();

   const handleSubmit = async (data: FormValues) => {
      return await updateUserData(ajax, data);
   }

   return (
      <Form
         initialValues={Object(user)}
         submitLabel={textResources.getText('EditUserAccountForm.submitLabel')}
         onSubmit={handleSubmit}
         editMode
      >
         <FormInput
            fieldName={textResources.getText('EditUserAccountForm.email.label')}
            label={textResources.getText('EditUserAccountForm.email.label')}
            placeholder={textResources.getText('EditUserAccountForm.email.placeholder')}
         />
         <FormInput
            fieldName={textResources.getText('EditUserAccountForm.phone.label')}
            label={textResources.getText('EditUserAccountForm.phone.label')}
            placeholder={textResources.getText('EditUserAccountForm.phone.placeholder')}
         />
      </Form>
   );
}