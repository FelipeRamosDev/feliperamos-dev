import { UserData } from '@/services/Auth/Auth.types';

export type ExperienceDataStatus = 'draft' | 'published' | 'archived';
export type ExperienceDataType = 'internship' | 'freelance' | 'contract' | 'temporary' | 'full_time' | 'part_time' | 'other';

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
   status: ExperienceDataStatus;
   title?: string;
   type: ExperienceDataType;
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
   user_id: number;
   languageSets: SkillData[];
}

export interface CVData extends CVSetData {
   title: string;
   experience_time?: number;
   is_master: boolean;
   notes?: string;
   cv_experiences?: ExperienceData[];
   cv_skills?: SkillData[];
   languageSets: CVSetData[];
   cv_owner_id: number;
}

export interface CVSetData extends BasicData {
   language_set: string;
   summary?: string;
   job_title?: string;
   sub_title?: string;
   user_id: number;
   cv_id: number;
   user?: UserData;
}

export interface LanguageData extends BasicData {
   default_name: string;
   local_name: string;
   locale_code: string;
   reading_level: string;
   writing_level: string;
   speaking_level: string;
   listening_level: string;
}

export interface EducationData extends EducationSetData {
   institution_name: string;
   start_date: Date;
   end_date: Date;
   is_current: boolean;
   student_id: number;
   languageSets: EducationSetData[];
}

export interface EducationSetData extends BasicData {
   degree?: string;
   field_of_study?: string;
   grade?: string;
   description?: string;
   education_id: number;
   language_set: string;
   user_id: number;
}
