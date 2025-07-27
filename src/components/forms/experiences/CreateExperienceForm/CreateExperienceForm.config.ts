import { CardProps } from '@/components/common/Card/Card.types';
import { FormValues } from '@/hooks/Form/Form.types';
import { Ajax } from '@/services';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

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

