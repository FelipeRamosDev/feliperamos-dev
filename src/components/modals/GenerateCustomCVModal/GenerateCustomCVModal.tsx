import { Card, ModalBase, Spinner } from '@/components/common';
import { GenerateCustomCVModalProps, GenerateSummaryError, GenerateSummarySuccess, LoadStatusOptions } from './GenerateCustomCVModal.types';
import GenerateCustomCVForm from '@/components/forms/curriculums/GenerateCustomCVForm/GenerateCustomCVForm';
import { GenerateSummaryParams } from '@/components/widgets/CustomCVWidget/CustomCVWidget.types';
import { useSocket } from '@/services/SocketClient';
import { useEffect, useRef, useState } from 'react';
import { DocumentScanner } from '@mui/icons-material';
import { parseCSS } from '@/helpers/parse.helpers';
import styles from './GenerateCustomCVModal.module.scss';
import { CreateCurriculumForm } from '@/components/forms/curriculums';
import { CVData, EducationData, ExperienceData, LanguageData, SkillData } from '@/types/database.types';
import { Form, FormSelect } from '@/hooks';
import { loadUserCVs } from '@/helpers/database.helpers';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { useAjax } from '@/hooks/useAjax';
import { WidgetHeader } from '@/components/headers';

function parseLoadStatus(status: LoadStatusOptions) {
   switch (status) {
      case 'started':
         return 'Generating your CV...';
      case 'connecting':
         return 'Connecting to the server...';
      case 'fetching-url':
         return 'Fetching job description from LinkedIn...';
      case 'generating-summary':
         return 'Generating CV summary...';
      case 'success':
         return 'CV generated successfully!';
      case 'error':
         return 'Error generating CV.';
      default:
         return 'Unknown status.';
   }
}

export default function GenerateCustomCVModal({ className, genSummaryParams, isOpen, onClose }: GenerateCustomCVModalProps): React.JSX.Element {
   const { connect, disconnect, emit, socket } = useSocket();
   const { textResources } = useTextResources();
   const ajax = useAjax();

   const [loadStatus, setLoadStatus] = useState<LoadStatusOptions>('started');
   const [genParams, setGenParams] = useState<GenerateSummaryParams | null>(genSummaryParams);
   const [userCVs, setUserCVs] = useState<CVData[]>([]);
   const [cvTemplate, setCvTemplate] = useState<CVData | null>(null);

   const isInit = useRef(false);
   const isLoading = (loadStatus !== 'success' && loadStatus !== 'error');
   let newInit: Partial<CVData> | null = null;

   const generateSummary = async (data?: GenerateSummaryParams) => {
      setGenParams(null);

      emit('generate-summary', { ...genParams, ...data }, (response: unknown) => {
         const { summary, jobDescription, aiThread } = response as GenerateSummarySuccess;
         const { error } = response as GenerateSummaryError;

         if (error) {
            console.error('Error generating summary:', error);
            setLoadStatus('error');
            return;
         }

         setGenParams((prev) => ({
            ...prev,
            currentInput: summary || null,
            jobDescription: jobDescription || null,
            aiThread: aiThread || null
         } as GenerateSummaryParams));
      });

      return { success: true };
   };

   useEffect(() => {
      if (isInit.current || !socket) {
         return;
      }

      isInit.current = true;
      connect().then(() => {
         socket?.on('custom-cv:status', (status: unknown) => {
            setLoadStatus(status as LoadStatusOptions);
         });

         generateSummary();
      }).catch(() => {
         setLoadStatus('error');
      });

      loadUserCVs(ajax, textResources).then((cvs) => {
         setUserCVs(cvs.map(item => ({
            ...item,
            cv_educations: item.cv_educations?.map((edu) => (edu as EducationData).id),
            cv_experiences: item.cv_experiences?.map((exp) => (exp as ExperienceData).id),
            cv_languages: item.cv_languages?.map((lang) => (lang as LanguageData).id),
            cv_skills: item.cv_skills?.map((skill) => (skill as SkillData).id),
         })));
      }).catch((error) => {
         console.error('Error loading user CVs:', error);
      });
   }, [socket, connect, generateSummary, ajax, textResources]);



   if (cvTemplate) {
      newInit = {
         ...cvTemplate,
         summary: genParams?.currentInput,
         title: `${cvTemplate.title} (${new Date().toLocaleString()})`,
      };

      delete newInit.id;
      delete newInit.created_at;
      delete newInit.updated_at;
      delete newInit.notes;
      delete newInit.is_master;
   } else {
      newInit = null;
   }

   return (
      <ModalBase
         title="Generate Custom CV"
         icon={<DocumentScanner />}
         className={parseCSS(className, styles.GenerateCustomCVModal)}
         isOpen={isOpen}
         widthSize={isLoading ? 's' : 'l'}
         onClose={onClose}
         onDestroy={disconnect}
      >
         {isLoading && (
            <div className={styles.loadingWrap}>
               <Spinner size="large" />
               <p>{parseLoadStatus(loadStatus)}</p>
            </div>
         )}

         {(genParams?.currentInput) && (loadStatus === 'success') && (<>
            <GenerateCustomCVForm
               viewType="full"
               onSubmit={generateSummary}
               initialValues={{ ...genParams }}
            />

            <Card className={styles.createCVForm} padding="m">
               <WidgetHeader title="CV Template" />

               <Form hideSubmit>
                  <FormSelect
                     fieldName="cvTemplate"
                     label="Select a CV Template to Edit"
                     onChange={(itemID) => setCvTemplate(userCVs.find((cv) => cv.id === itemID) || null)}
                     options={userCVs.map((cv) => ({
                        value: cv.id,
                        label: cv.title
                     }))}
                  />
               </Form>
            </Card>

            {cvTemplate && <CreateCurriculumForm initialValues={{ ...newInit }} />}
         </>)}
      </ModalBase>
   );
   
}
