import { GenerateSummaryParams } from '@/components/widgets/CustomCVWidget/CustomCVWidget.types';

export interface GenerateCustomCVFormProps {
   initialValues?: GenerateSummaryParams;
   viewType: 'start' | 'full';
   className?: string | string[];
   onSubmit: (data: GenerateSummaryParams) => Promise<Record<string, unknown>>;
}
