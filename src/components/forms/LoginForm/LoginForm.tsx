import { Form, FormInput } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { useRouter } from 'next/navigation';

const INITIAL_VALUES = { email: '', password: '' };

export default function LoginContent() {
   const ajax = useAjax();
   const router = useRouter();

   const handleSubmit = async (values: FormValues) => {
      try {
         const response = await ajax.post('/auth/login', {
            email: values.email,
            password: values.password
         });

         if (response.success) {
            router.push('/admin');
         }

         return response;
      } catch (error) {
         console.error('Login failed:', error);
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
