import { Avatar } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export default function ChatHeader(): React.ReactElement {
   return (
      <div className="ChatHeader">
         <Avatar alt="AI Assistant Avatar">
            <SmartToyIcon color="secondary" />
         </Avatar>

         <h2 className="chat-title">Felipe's AI Assistant</h2>
      </div>
   );
}
