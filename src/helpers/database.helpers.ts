import { FormCheckboxOption, FormSelectOption, FormValues } from "@/hooks/Form/Form.types";
import { TextResources, UserData } from "@/services";
import Ajax from "@/services/Ajax/Ajax";
import { CompanyData, CVData, EducationData, ExperienceData, LanguageData, LetterData, OpportunityData, SkillData } from "@/types/database.types";
import { displayProficiency } from "./app.helpers";

export const handleExperienceUpdate = async (ajax: Ajax, experience: ExperienceData, values: Partial<ExperienceData>) => {
   if (!values || !Object.keys(values).length) {
      console.warn('No valid updates provided. The "updates" param is empty.');
      return { success: true };
   }

   try {
      const updated = await ajax.patch<ExperienceData>('/experience/update', {
         experienceId: experience.id,
         updates: values,
      });

      if (!updated.success) {
         throw updated;
      }

      window.location.reload();
      return { success: true };
   } catch (error) {
      throw error;
   }
};

export async function loadSkillsOptions(ajax: Ajax, textResources: TextResources): Promise<FormSelectOption[]> {
   const { success, data, message } = await ajax.get<SkillData[]>('/skill/query', { params: { language_set: textResources.currentLanguage } });

   if (!success) {
      console.error('Failed to load skills:', message);
      return [];
   }

   return data.map((skill: SkillData) => ({
      value: Number(skill.id),
      label: String(skill.name),
   }));
}

export async function loadCompaniesOptions(ajax: Ajax, textResources: TextResources): Promise<FormSelectOption[]> {
   const { success, data, message } = await ajax.get<CompanyData[]>('/company/query', {
      params: { language_set: textResources.currentLanguage }
   });

   if (!success) {
      console.error('Failed to load companies:', message);
      return [];
   }

   return data.map((company: CompanyData) => ({
      value: Number(company.id),
      label: String(company.company_name)
   }));
}

export async function loadExperiencesListOptions(ajax: Ajax, language_set: string): Promise<FormCheckboxOption[]> {
   try {
      const { data = [] } = await ajax.get<ExperienceData[]>('/experience/query', { params: { language_set } });

      if (!Array.isArray(data)) {
         throw new Error("Failed to load experiences");
      }

      return data.map((item: ExperienceData) => ({
         id: item.id,
         primary: `${item.company?.company_name} (${item.position})`,
         secondary: item.title,
         avatarUrl: item.company?.logo_url
      }));
   } catch (error) {
      console.error("Error loading experiences list options:", error);
      throw error;
   }
}

export async function loadLanguagesOptions(ajax: Ajax, language_set: string): Promise<FormCheckboxOption[]> {
   try {
      const response = await ajax.get<LanguageData[]>('/user/languages', { params: { language_set } });

      if (!response.success) {
         throw new Error("Failed to load languages");
      }

      return response.data.map((item) => ({
         id: item.id,
         primary: item.default_name,
         secondary: displayProficiency(item.proficiency, language_set),
      }));
   } catch (error) {
      console.error("Error loading languages options:", error);
      throw error;
   }
}

export async function loadEducationsOptions(ajax: Ajax, language_set: string): Promise<FormCheckboxOption[]> {
   try {
      const response = await ajax.get<EducationData[]>('/user/educations', { params: { language_set } });

      if (!response.success) {
         throw new Error("Failed to load educations");
      }

      return response.data.map((item) => ({
         id: item.id,
         primary: item.institution_name,
         secondary: item.field_of_study,
      }));
   } catch (error) {
      console.error("Error loading educations options:", error);
      throw error;
   }
}

export async function loadOpportunitiesOptions(ajax: Ajax, company_id?: number): Promise<FormSelectOption[]> {
   const { success, data, message } = await ajax.get<OpportunityData[]>('/opportunity/search', {
      params: company_id ? { where: { company_id } } : {}
   });

   if (!success) {
      console.error('Failed to load opportunities:', message);
      return [];
   }

   return data.map((opportunity: OpportunityData) => ({
      value: Number(opportunity.id),
      label: String(opportunity.job_title)
   }));
}

export async function loadUserCVs(ajax: Ajax, textResources: TextResources): Promise<CVData[]> {
   try {
      const { success, data = [], message } = await ajax.get<CVData[]>('/user/cvs', {
         params: { language_set: textResources.currentLanguage }
      });

      if (!success) {
         console.error('Failed to load CV templates:', message);
         throw new Error('Failed to load CV templates');
      }

      return data as CVData[];
   } catch (error) {
      console.error(error);
      throw error;
   }
}


export async function getLetter(ajax: Ajax, id: number): Promise<LetterData | null> {
   if (!id || isNaN(Number(id))) {
      throw new Error('Cover letter ID is required to fetch a cover letter');
   }

   try {
      const loaded = await ajax.get<LetterData>(`/cover-letter/search/${id}`);

      if (loaded.error) {
         throw new Error(loaded.message);
      }

      return loaded.data;
   } catch (error) {
      console.error('Error fetching cover letter:', error);
      throw error;
   }
}


export async function updateUserData(ajax: Ajax, data: FormValues): Promise<UserData> {
   try {
      const updatedUser = await ajax.patch<UserData>('/user/update', { updates: data });

      if (!updatedUser.success) {
         throw updatedUser;
      }

      window.location.reload();
      return updatedUser.data;
   } catch (error) {
      throw error;
   }
}
