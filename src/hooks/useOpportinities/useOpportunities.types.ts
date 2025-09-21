export interface OpportunitiesSearchParams {
   where?: Record<string, any>;
   sort?: string;
   order?: 'ASC' | 'DESC';
}

export interface OpportunityCreateParams {
   jobURL: string;
   jobTitle: string;
   jobDescription: string;
   jobLocation: string;
   jobSeniority: string;
   jobEmploymentType: string;
   companyName: string;
   cvSummary: string;
   cvTemplate: string;
}
