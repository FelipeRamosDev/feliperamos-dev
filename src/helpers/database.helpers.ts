import Ajax from "@/services/Ajax/Ajax";
import { ExperienceData } from "@/types/database.types";

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
