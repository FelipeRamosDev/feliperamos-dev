import HomePage from '@/components/content/HomePage/HomePage';
import { PageBase } from '@/components/layout';
import { SocketProvider } from '@/services/SocketClient';

export default function Home() {
  return (
    <PageBase>
      <SocketProvider config={{ url: 'https://localhost:5000/cv-chat' }}>
        <HomePage />
      </SocketProvider>
    </PageBase>
  );
}
