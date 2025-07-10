'use client';

import { Card } from '@/components/common';
import { LoginForm } from '@/components/forms';
import LockIcon from '@mui/icons-material/Lock';

export default function LoginContent() {
   return (
      <div className="LoginContent">
         <Card className="login-card" radius="m" padding="l">
            <h1 className="login-title">
               <LockIcon className="login-icon" />
               Admin Area
            </h1>
            <p className="login-description">
               Enter your credentials to access the admin area.
            </p>

            <LoginForm />
         </Card>
      </div>
   );
}
