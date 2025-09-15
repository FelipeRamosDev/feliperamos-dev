import { OpportunitySearch } from '@/components/content/admin/opportunity';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';
import { SocketProvider } from '@/services/SocketClient';

const HOST = process.env.NEXT_PUBLIC_SERVER_HOST || 'http://localhost';
const PORT = process.env.NEXT_PUBLIC_SERVER_SOCKET_PORT || '5000';

export default async function OpportunitySearchPage() {
   const locale = await headersAcceptLanguage();
   const url = new URL(HOST);

   url.port = PORT;
   url.pathname = '/cover-letter';

   return (
      <SocketProvider config={{ url: url.toString() }}>
         <AdminPageBase language={locale}>
            <OpportunitySearch />
         </AdminPageBase>
      </SocketProvider>
   );
}
