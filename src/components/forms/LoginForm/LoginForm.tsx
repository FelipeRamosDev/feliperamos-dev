import { Form, FormInput } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAuth } from '@/services';
import { AjaxResponseError } from '@/services/Ajax/Ajax.types';
import { useRouter } from 'next/navigation';

const INITIAL_VALUES = { email: '', password: '' };

export default function LoginContent() {
   const router = useRouter();
   const { login } = useAuth();

   const handleSubmit = async (values: FormValues): Promise<FormValues | AjaxResponseError> => {
      try {
         const response = await login(values.email as string, values.password as string);

         if (response.success) {
            router.push('/admin');
         }

         return response;
      } catch (error: unknown) {
         console.error('Login failed:', error);
         return error as AjaxResponseError;
      }
   };

   return (
      <Form
         submitLabel="Login"
         initialValues={INITIAL_VALUES}
         onSubmit={handleSubmit}
      >
         <FormInput
            fieldName="email"
            label="Email"
            placeholder="Enter your email"
            type="email"
         />

         <FormInput
            fieldName="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
         />
      </Form>
   );
}
