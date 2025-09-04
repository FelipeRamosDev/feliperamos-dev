import { OpportunityCreate } from '@/components/content/admin/opportunity';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';
import { SocketProvider } from '@/services/SocketClient';

const HOST = process.env.NEXT_PUBLIC_SERVER_HOST || 'http://localhost';
const PORT = process.env.NEXT_PUBLIC_SERVER_SOCKET_PORT || '5000';

export default async function OpportunityCreatePage() {
   const locale = await headersAcceptLanguage();
   const url = new URL(HOST);

   url.port = PORT;
   url.pathname = '/opportunities';

   return (
      <AdminPageBase language={locale}>
         <SocketProvider config={{ url: url.toString() }}>
            <OpportunityCreate />
         </SocketProvider>
      </AdminPageBase>
   );
}
