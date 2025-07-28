import { updateUserData } from '@/helpers/database.helpers';
import { Form, FormInput } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { useAuth } from '@/services';

export default function EditUserSocialForm() {
   const { user } = useAuth();
   const ajax = useAjax();

   const handleSubmit = async (data: FormValues) => {
      return await updateUserData(ajax, data);
   }

   return (
      <Form
         initialValues={Object(user)}
         submitLabel="Save Changes"
         onSubmit={handleSubmit}
         editMode
      >
         <FormInput
            fieldName="github_url"
            label="GitHub Profile"
            placeholder="Enter your profile URL..."
         />
         <FormInput
            fieldName="linkedin_url"
            label="LinkedIn Profile"
            placeholder="Enter your profile URL..."
         />
         <FormInput
            fieldName="whatsapp_number"
            label="WhatsApp Number"
            placeholder="Enter your WhatsApp number..."
         />
         <FormInput
            fieldName="portfolio_url"
            label="Portfolio URL"
            placeholder="Enter your portfolio URL..."
         />
      </Form>
   );
}
