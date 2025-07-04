import { Avatar } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export default function ChatHeader(): React.ReactElement {
   return (
      <div className="ChatHeader">
         <Avatar alt="AI Assistant Avatar">
            <SmartToyIcon color="secondary" />
         </Avatar>

         <div className="assistant-info">
            <h2 className="assistant-name">{`Felipe's AI Assistant`}</h2>
            <p className="assistant-description">
               {`Trained AI with Felipe's professional background and experience, ask anything!`}
            </p>
         </div>
      </div>
   );
}
