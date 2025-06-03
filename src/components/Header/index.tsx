import React from 'react';
import CTAButton from '../buttons/CTAButton';
import { useDispatch, useSelector } from 'react-redux';
import { chatSliceActions } from '@/store';
import { ChatSelector } from '@/store/store.types';

const Header: React.FC = () => {
   const chatState = useSelector((state: ChatSelector) => state?.chat?.chatState);
   const dispatch = useDispatch();
   const setChatState = () => dispatch(chatSliceActions.toggleChat());

   return (
      <header>
         <div className="header-content">
            <h1 className="title">Felipe Ramos AI-CV</h1>
            <p>Chat with my bot below and ask questions about me and my professional history. The AI was trained with my professional history, hobbies, study, etc.</p>
         </div>

         {!chatState && <div className="button-wrap">
            <CTAButton onClick={() => setChatState()}>Start Chat</CTAButton>
         </div>}
      </header>
   );
}

export default Header;
