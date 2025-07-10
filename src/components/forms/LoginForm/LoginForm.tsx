import { Form, FormInput } from '@/hooks';

const INITIAL_VALUES = { email: '', password: '' };

export default function LoginContent() {
   return (
      <Form
         submitLabel="Login"
         initialValues={INITIAL_VALUES}
         onSubmit={async (values) => {
            console.log('Form submitted with values:', values);
            return { success: true };
         }}
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
