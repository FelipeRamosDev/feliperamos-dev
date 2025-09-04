import { Card } from '@/components/common';
import { WidgetHeader } from '@/components/headers';
import { FormInput } from '@/hooks';

export default function JobDetails() {
   return (
      <Card>
         <WidgetHeader title="Job Details" />

         <FormInput
            fieldName="jobTitle"
            label="Job Title"
            placeholder="Enter the job title"
         />

         <FormInput
            fieldName="jobCompany"
            label="Company Name"
            placeholder="Enter the job company"
         />

         <FormInput
            fieldName="jobDescription"
            label="Job Description"
            placeholder="Enter the job description"
            multiline
            minRows={3}
            maxRows={6}
         />
      </Card>
   );
}
