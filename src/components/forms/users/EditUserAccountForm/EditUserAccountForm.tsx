import { updateUserData } from '@/helpers/database.helpers';
import { Form, FormInput } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { useAuth } from '@/services';

export default function EditUserAccountForm() {
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
            fieldName="email"
            label="E-mail"
            placeholder="Enter your email..."
         />
         <FormInput
            fieldName="phone"
            label="Phone Number"
            placeholder="Enter your phone number..."
         />
      </Form>
   );
}