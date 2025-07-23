import { Form, FormInput } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAuth } from '@/services';
import { AjaxResponseError } from '@/services/Ajax/Ajax.types';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { useRouter } from 'next/navigation';
import texts from './LoginForm.text';

const INITIAL_VALUES = { email: '', password: '' };

export default function LoginContent() {
   const router = useRouter();
   const { login } = useAuth();
   const { textResources } = useTextResources(texts);

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
         submitLabel={textResources.getText('LoginForm.submit')}
         initialValues={INITIAL_VALUES}
         onSubmit={handleSubmit}
      >
         <FormInput
            fieldName="email"
            label={textResources.getText('LoginForm.email')}
            placeholder={textResources.getText('LoginForm.placeholder.email')}
            type="email"
         />

         <FormInput
            fieldName="password"
            label={textResources.getText('LoginForm.password')}
            placeholder={textResources.getText('LoginForm.placeholder.password')}
            type="password"
         />
      </Form>
   );
}
