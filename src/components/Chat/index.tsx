import { parseCSS } from '@/helpers';
import React from 'react';
import Card from '@/components/Card';

type ChatProps = {
   className?: string | undefined;
};

const SHADOW_COLOR = '#b5b5b5';

const Chat: React.FC<ChatProps> = ({ className }) => {
   return (
      <Card className={parseCSS(className, 'chat card')} noElevation>
         <Card
            padding="xl"
            className="msg-container"
            shadowColor={SHADOW_COLOR}
            noElevation
         >
            
         </Card>

         <Card
            className="input-container"
            padding="xl"
            shadowColor={SHADOW_COLOR}
         >
            
         </Card>
      </Card>
   );
};

export default Chat;
