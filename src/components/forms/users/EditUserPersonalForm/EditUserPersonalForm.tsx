import { updateUserData } from '@/helpers/database.helpers';
import { Form, FormDatePicker, FormInput } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { useAuth } from '@/services';

export default function EditUserPersonalForm() {
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
            fieldName="first_name"
            label="First Name"
            placeholder="Enter your first name..."
         />
         <FormInput
            fieldName="last_name"
            label="Last Name"
            placeholder="Enter your last name..."
         />
         <FormDatePicker
            fieldName="birth_date"
            label="Birth Date"
         />
         <FormInput
            fieldName="city"
            label="City"
            placeholder="Enter the city you live..."
         />
         <FormInput
            fieldName="state"
            label="State"
            placeholder="Enter the state you live..."
         />
         <FormInput
            fieldName="country"
            label="Country"
            placeholder="Enter the country you live..."
         />
      </Form>
   );
}