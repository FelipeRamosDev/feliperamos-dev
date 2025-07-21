'use client';

import { Card } from '@/components/common';
import { LoginForm } from '@/components/forms';
import LockIcon from '@mui/icons-material/Lock';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './LoginContent.text';

export default function LoginContent() {
   const { textResources } = useTextResources(texts);

   return (
      <div className="LoginContent">
         <Card className="login-card" radius="m" padding="l">
            <h1 className="login-title">
               <LockIcon className="login-icon" />
               {textResources.getText('LoginContent.title')}
            </h1>
            <p className="login-description">
               {textResources.getText('LoginContent.subtitle')}
            </p>

            <LoginForm />
         </Card>
      </div>
   );
}
