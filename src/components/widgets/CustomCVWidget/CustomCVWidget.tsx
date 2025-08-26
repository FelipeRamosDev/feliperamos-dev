import { WidgetHeader } from '@/components/headers';
import { CustomCVWidgetProps, GenerateSummaryParams } from './CustomCVWidget.types';
import { parseCSS } from '@/helpers/parse.helpers';
import GenerateCustomCVForm from '@/components/forms/curriculums/GenerateCustomCVForm/GenerateCustomCVForm';
import { Card } from '@/components/common';
import { GenerateCustomCVModal } from '@/components/modals';
import { useState } from 'react';
import { SocketProvider } from '@/services/SocketClient';
import { apiURL } from '@/helpers/app.helpers';

export default function CustomCVWidget({ className }: CustomCVWidgetProps): React.JSX.Element {
   const [genSummaryParams, setGenSummaryParams] = useState<GenerateSummaryParams | null>(null);
   const isModalOpen = Boolean(genSummaryParams);

   const url = new URL(apiURL('/custom-cv'));
   url.port = process.env.NEXT_PUBLIC_SERVER_SOCKET_PORT || '5000';

   const mainCSS = parseCSS(className, [
      'CustomCVWidget'
   ]);

   const startGenerate = async (data: GenerateSummaryParams) => {
      setGenSummaryParams(data);
      return { success: true };
   };

   return (
      <div className={mainCSS}>
         <WidgetHeader title="Generate Custom CV" />

         <Card padding="m">
            <GenerateCustomCVForm viewType="start" onSubmit={startGenerate} />
         </Card>

         {isModalOpen && (
            <SocketProvider config={{
               url: url.toString(),
               autoConnect: false
            }}>
               <GenerateCustomCVModal
                  isOpen={isModalOpen}
                  genSummaryParams={genSummaryParams}
                  onClose={() => setGenSummaryParams(null)}
               />
            </SocketProvider>
         )}
      </div>
   );
}
