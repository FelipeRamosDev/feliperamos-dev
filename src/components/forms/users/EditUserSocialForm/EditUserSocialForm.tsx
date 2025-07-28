import { updateUserData } from '@/helpers/database.helpers';
import { Form, FormInput } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { useAuth } from '@/services';
import texts from './EditUserSocialForm.text';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';

export default function EditUserSocialForm() {
   const { textResources } = useTextResources(texts);
   const { user } = useAuth();
   const ajax = useAjax();

   const handleSubmit = async (data: FormValues) => {
      return await updateUserData(ajax, data);
   }

   return (
      <Form
         initialValues={Object(user)}
         submitLabel={textResources.getText('EditUserSocialForm.submitLabel')}
         onSubmit={handleSubmit}
         editMode
      >
         <FormInput
            fieldName="github_url"
            label={textResources.getText('EditUserSocialForm.githubUrl.label')}
            placeholder={textResources.getText('EditUserSocialForm.githubUrl.placeholder')}
         />
         <FormInput
            fieldName="linkedin_url"
            label={textResources.getText('EditUserSocialForm.linkedinUrl.label')}
            placeholder={textResources.getText('EditUserSocialForm.linkedinUrl.placeholder')}
         />
         <FormInput
            fieldName="whatsapp_number"
            label={textResources.getText('EditUserSocialForm.whatsappNumber.label')}
            placeholder={textResources.getText('EditUserSocialForm.whatsappNumber.placeholder')}
         />
         <FormInput
            fieldName="portfolio_url"
            label={textResources.getText('EditUserSocialForm.portfolioUrl.label')}
            placeholder={textResources.getText('EditUserSocialForm.portfolioUrl.placeholder')}
         />
      </Form>
   );
}
