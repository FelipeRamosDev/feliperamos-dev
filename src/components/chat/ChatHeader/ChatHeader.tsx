import { Avatar } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import chatHeaderText from './ChatHeader.text';

export default function ChatHeader(): React.ReactElement {
   const { textResources } = useTextResources(chatHeaderText);

   return (
      <div className="ChatHeader">
         <Avatar alt={textResources.getText('ChatHeader.avatarAlt')} className="assistant-avatar">
            <SmartToyIcon color="secondary" />
         </Avatar>

         <div className="assistant-info">
            <h2 className="assistant-name">{textResources.getText('ChatHeader.assistantName')}</h2>
            <p className="assistant-description">
               {textResources.getText('ChatHeader.assistantDescription')}
            </p>
         </div>
      </div>
   );
}
