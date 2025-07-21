export interface CreateExperienceFormProps {
   initialValues?: Record<string, unknown>;
}

export interface ExperienceCompanyProps {
   id: string;
   company_name: string;
   logo_url?: string;
   site_url?: string;
   description?: string;
   location?: string;
   created_at?: string;
   category?: string;
}
