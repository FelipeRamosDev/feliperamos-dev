import { CardProps } from '@/components/common/Card/Card.types';
import { FormValues } from '@/hooks/Form/Form.types';
import { Ajax, TextResources } from '@/services';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { allowedLanguages, languageNames } from '@/app.config';
import { CompanyData, SkillData } from '@/types/database.types';

export const INITIAL_VALUES = (initialValues: Record<string, unknown>) => ({
   status: 'draft',
   ...initialValues
})

export const cardDefaultProps: CardProps = {
   padding: 'l',
   className: 'form-group'
};

export const createExperience = async (data: FormValues, ajax: Ajax, router: AppRouterInstance) => {
   try {
      const created = await ajax.post('/experience/create', data);

      if (!created.success) {
         return new Error('Failed to create experience');
      }

      router.push('/admin');
      return { success: true };
   } catch (error) {
      return error;
   }
}

export const handleExperienceLoadOptions = async (ajax: Ajax, textResources: TextResources) => {
   const { success, data, message } = await ajax.get<CompanyData[]>('/company/query', {
      params: { language_set: textResources.currentLanguage }
   });

   if (!success) {
      console.error('Failed to load companies:', message);
      return [];
   }

   return data.map((company: CompanyData) => ({
      value: company.id,
      label: company.company_name
   }));
}

export const handleSkillsLoadOptions = async (ajax: Ajax, textResources: TextResources) => {
   const { success, data, message } = await ajax.get<SkillData[]>('/skill/query', { params: { language_set: textResources.currentLanguage } });

   if (!success) {
      console.error('Failed to load skills:', message);
      return [];
   }

   return data.map((skill: SkillData) => ({
      value: skill.id,
      label: skill.name,
   }));
}

export const languagesOptions = allowedLanguages.map(lang => ({
   value: lang,
   label: languageNames[lang]
}));

export const typeOptions = [
   { value: 'contract', label: 'Contract' },
   { value: 'full_time', label: 'Full Time' },
   { value: 'part_time', label: 'Part Time' },
   { value: 'temporary', label: 'Temporary' },
   { value: 'internship', label: 'Internship' },
   { value: 'freelance', label: 'Freelance' },
   { value: 'other', label: 'Other' },
];

export const statusOptions = [
   { value: 'draft', label: 'Draft' },
   { value: 'published', label: 'Published' }
];

