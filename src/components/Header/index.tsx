import React from 'react';
import CTAButton from '../buttons/CTAButton';

type HeaderProps = {
   chatState: boolean;
   setChatState: (state: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ chatState, setChatState }) => {
   return <header>
      <div className="header-content">
         <h1 className="title">Felipe Ramos AI-CV</h1>
         <p>Chat with my bot below and ask questions about me and my professional history. The AI was trained with my professional history, hobbies, study, etc.</p>
      </div>

      {!chatState && <div className="button-wrap">
         <CTAButton onClick={() => setChatState(true)}>Start Chat</CTAButton>
      </div>}
   </header>
}

export default Header;
