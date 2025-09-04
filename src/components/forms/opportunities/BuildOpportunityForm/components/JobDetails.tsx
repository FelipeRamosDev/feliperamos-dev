import { Card, FlexLine } from '@/components/common';
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

         <FlexLine>
            <FormInput
               fieldName="jobCompany"
               label="Company Name"
               placeholder="Enter the job company"
            />

            <FormInput
               fieldName="jobLocation"
               label="Location"
               placeholder="Enter the job location"
            />
         </FlexLine>

         <FlexLine>
            <FormInput
               fieldName="jobSeniority"
               label="Seniority Level"
               placeholder="Enter the job seniority level"
            />

            <FormInput
               fieldName="jobEmploymentType"
               label="Employment Type"
               placeholder="Enter the job employment type"
            />
         </FlexLine>

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
