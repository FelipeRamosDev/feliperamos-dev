export interface BasicData {
   id: number;
   created_at: Date;
   updated_at?: Date;
   schemaName: string;
   tableName: string;
}

export interface ExperienceData extends ExperienceSetData {
   company: CompanyData;
   company_id: number;
   end_date: Date;
   languageSets: ExperienceSetData[];
   skills: SkillData[];
   start_date: Date;
   status: string;
   title?: string;
   type: string;
}

export interface ExperienceSetData extends BasicData {
   description?: string;
   language_set?: string;
   position?: string;
   responsibilities?: string;
   slug?: string;
   summary?: string;
}

export interface CompanyData extends CompanySetData {
   company_name: string;
   location: string;
   logo_url: string;
   site_url: string;
   languageSets: CompanySetData[];
}

export interface CompanySetData extends BasicData {
   company_id: number;
   description?: string;
   industry?: string;
   language_set?: string;
}

export interface SkillData extends SkillSetData {
   category: string;
   level: string;
   name: string;
}

export interface SkillSetData extends BasicData {
   journey: string;
   language_set: string;
   skill_id: string;
   user_id: string;
   languageSets: SkillData[];
}
