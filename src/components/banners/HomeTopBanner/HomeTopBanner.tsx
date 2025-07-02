'use client';

import { Container } from '@/components/common';
import { Chat } from '@/components/chat';
import { useSelector, useDispatch } from 'react-redux';
import { ChatState } from '@/store/store.types';
import { chatSliceActions } from '@/store';
import { CTAButton } from '@/components/common/buttons';
import { useSocket } from '@/services/SocketClient';
import { handleStartChat } from './HomeTopBanner.scripts';

export default function HomeTopBanner(): React.ReactElement {
   const dispatch = useDispatch();
   const { socket, emit } = useSocket();

   // States
   const chatState = useSelector((state: { chat: ChatState }) => state?.chat?.chatState);

   // Setters
   const setChatState = () => dispatch(chatSliceActions.toggleChat());
   const setThreadID = (id: string | null) => dispatch(chatSliceActions.setThreadID(id));
   const setAssistantTyping = (status: boolean) => dispatch(chatSliceActions.setAssistantTyping(status));

   const startChat = () => handleStartChat(
      socket,
      chatState,
      emit,
      dispatch,
      setChatState,
      setThreadID,
      setAssistantTyping
   );

   return (
      <section className="HomeBanner">
         <Container className="double-column">
            <div className="column presentation">
               <div className="presentation-content">
                  <h1 className="banner-title">Felipe Ramos</h1>
                  <p className="banner_sub-title">Fullstack JavaScript Developer</p>
               </div>

               {!chatState && <div className="button-wrap">
                  <CTAButton onClick={startChat}>Start Chat</CTAButton>
               </div>}
            </div>

            <div className="column chat-wrap">
               <Chat />
            </div>
         </Container>
      </section>
   )
}
