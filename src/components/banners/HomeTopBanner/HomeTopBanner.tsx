'use client';

import { Container } from '@/components/common';
import { Chat } from '@/components/chat';
import { SocketClientConfig, SocketProvider } from '@/services/SocketClient';
import { Download } from '@mui/icons-material';
import { Button } from '@mui/material';

const HOST = process.env.NEXT_PUBLIC_SERVER_HOST || 'http://localhost';
const PORT = process.env.NEXT_PUBLIC_SERVER_SOCKET_PORT || '5000';

export default function HomeTopBanner(): React.ReactElement {
   const url = new URL(HOST);

   url.port = PORT;
   url.pathname = '/cv-chat';

   const socketConfig: SocketClientConfig = {
      url: url.toString(),
      autoConnect: false
   };

   return (
      <section className="HomeBanner">
         <Container className="double-column">
            <div className="column presentation">
               <div className="presentation-content">
                  <h1 className="banner-title">Felipe Ramos</h1>
                  <p className="banner_sub-title">{'Fullstack Developer (JavaScript)'}</p>
               </div>

               <Button startIcon={<Download />}>
                  Download CV
               </Button>
            </div>

            <div className="column chat-wrap">
               <SocketProvider config={socketConfig}>
                  <Chat />
               </SocketProvider>
            </div>
         </Container>
      </section>
   )
}
