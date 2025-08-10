import { FormCheckboxOption, FormSelectOption, FormValues } from "@/hooks/Form/Form.types";
import { TextResources, UserData } from "@/services";
import Ajax from "@/services/Ajax/Ajax";
import { CompanyData, EducationData, ExperienceData, LanguageData, SkillData } from "@/types/database.types";

export const handleExperienceUpdate = async (ajax: Ajax, experience: ExperienceData, values: Partial<ExperienceData>) => {
   if (!values || !Object.keys(values).length) {
      console.warn('No valid updates provided. The "updates" param is empty.');
      return { success: true };
   }

   try {
      const updated = await ajax.post<ExperienceData>('/experience/update', {
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
         secondary: item.level,
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

export async function updateUserData(ajax: Ajax, data: FormValues): Promise<UserData> {
   try {
      const updatedUser = await ajax.post<UserData>('/user/update', { updates: data });

      if (!updatedUser.success) {
         throw updatedUser;
      }

      window.location.reload();
      return updatedUser.data;
   } catch (error) {
      throw error;
   }
}
