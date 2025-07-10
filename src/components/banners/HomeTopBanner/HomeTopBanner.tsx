'use client';

import { Container, SocialLinks } from '@/components/common';
import { Chat } from '@/components/chat';
import { SocketClientConfig, SocketProvider } from '@/services/SocketClient';
import { Download } from '@mui/icons-material';
import { Button } from '@mui/material';
import homeTopBannerText from './HomeTopBanner.text';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';

const HOST = process.env.NEXT_PUBLIC_SERVER_HOST || 'http://localhost';
const PORT = process.env.NEXT_PUBLIC_SERVER_SOCKET_PORT || '5000';

export default function HomeTopBanner(): React.ReactElement {
   const { textResources } = useTextResources(homeTopBannerText);
   const url = new URL(HOST);

   url.port = PORT;
   url.pathname = '/cv-chat';

   const socketConfig: SocketClientConfig = {
      url: url.toString(),
      autoConnect: false
   };

   const downloadCV = () => {
      const link = document.createElement('a');

      link.target = '_blank';
      link.href = '/cv/felipe_ramos_cv.pdf';
      link.download = 'felipe_ramos_cv.pdf';

      link.click();
   }

   return (
      <section className="HomeBanner">
         <Container className="double-column">
            <div className="column presentation">
               <div className="presentation-content">
                  <h1 className="banner-title">{textResources.getText('HomeTopBanner.title')}</h1>
                  <p className="banner_sub-title">{textResources.getText('HomeTopBanner.subtitle')}</p>
                  <p className="banner_tech-stack">{textResources.getText('HomeTopBanner.techStack')}</p>
               </div>

               <SocialLinks />

               <Button
                  title={textResources.getText('HomeTopBanner.button.downloadCV')}
                  aria-label={textResources.getText('HomeTopBanner.button.downloadCV')}
                  startIcon={<Download />}
                  onClick={downloadCV}
               >
                  {textResources.getText('HomeTopBanner.button.downloadCV')}
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
