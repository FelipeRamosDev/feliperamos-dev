import { updateUserData } from '@/helpers/database.helpers';
import { Form, FormDatePicker, FormInput } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { useAuth } from '@/services';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './EditUserPersonalForm.text';

export default function EditUserPersonalForm() {
   const { textResources } = useTextResources(texts);
   const { user } = useAuth();
   const ajax = useAjax();

   const handleSubmit = async (data: FormValues) => {
      return await updateUserData(ajax, data);
   }

   return (
      <Form
         initialValues={Object(user)}
         submitLabel={textResources.getText('EditUserPersonalForm.submitLabel')}
         onSubmit={handleSubmit}
         editMode
      >
         <FormInput
            fieldName="first_name"
            label={textResources.getText('EditUserPersonalForm.firstName.label')}
            placeholder={textResources.getText('EditUserPersonalForm.firstName.placeholder')}
         />
         <FormInput
            fieldName="last_name"
            label={textResources.getText('EditUserPersonalForm.lastName.label')}
            placeholder={textResources.getText('EditUserPersonalForm.lastName.placeholder')}
         />
         <FormDatePicker
            fieldName="birth_date"
            label={textResources.getText('EditUserPersonalForm.birthDate.label')}
         />
         <FormInput
            fieldName="city"
            label={textResources.getText('EditUserPersonalForm.city.label')}
            placeholder={textResources.getText('EditUserPersonalForm.city.placeholder')}
         />
         <FormInput
            fieldName="state"
            label={textResources.getText('EditUserPersonalForm.state.label')}
            placeholder={textResources.getText('EditUserPersonalForm.state.placeholder')}
         />
         <FormInput
            fieldName="country"
            label={textResources.getText('EditUserPersonalForm.country.label')}
            placeholder={textResources.getText('EditUserPersonalForm.country.placeholder')}
         />
      </Form>
   );
}