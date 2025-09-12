import { Card, DateView, FlexLine, Markdown, ModalBase } from "@/components/common";
import { OpportunityModalProps } from "./OpportunityModal.types";
import { ContentSidebar, DataContainer } from "@/components/layout";
import { Fragment } from "react";
import { WidgetHeader } from "@/components/headers";
import { RequestQuote } from "@mui/icons-material";

export default function OpportunityModal({ isOpen, onClose, data }: OpportunityModalProps) {
   if (!data) return null;
   return (
      <ModalBase
         isOpen={isOpen}
         onClose={onClose}
         title={<><RequestQuote /> Opportunity Details</>}
         widthSize="xl"
      >
         <ContentSidebar>
            <Fragment>
               <Card>
                  <DataContainer>
                     <label>Job Title</label>
                     <p>{data.job_title}</p>
                  </DataContainer>
                  <DataContainer>
                     <label>Job URL</label>
                     <p>{data.job_url || '---'}</p>
                  </DataContainer>
               </Card>
               <Card>
                  <FlexLine>
                     <DataContainer vertical>
                        <label>Created At</label>
                        <DateView date={data.created_at || '---'} />
                     </DataContainer>
                     <DataContainer vertical>
                        <label>Location</label>
                        <p>{data.location || '---'}</p>
                     </DataContainer>
                  </FlexLine>

                  <FlexLine>
                     <DataContainer vertical>
                        <label>Employment Type</label>
                        <p>{data.employment_type || '---'}</p>
                     </DataContainer>
                     <DataContainer vertical>
                        <label>Seniority Level</label>
                        <p>{data.seniority_level || '---'}</p>
                     </DataContainer>
                  </FlexLine>
               </Card>

               <Card>
                  <DataContainer vertical>
                     <label>Job Description</label>
                     <Markdown value={data.job_description || '---'} />
                  </DataContainer>
               </Card>
            </Fragment>

            <Fragment>
               <Card>
                  <WidgetHeader title="Cover Letter" />
               </Card>
               <Card>
                  <WidgetHeader title="Custom CV" />

                  {data.relatedCV?.title}
               </Card>
            </Fragment>
         </ContentSidebar>
      </ModalBase>
   );
}
