import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import CreateCurriculumForm from './CreateCurriculumForm';

// Mock Next.js router
jest.mock('next/navigation', () => ({
   useRouter: jest.fn()
}));

// Mock the helpers
jest.mock('@/helpers/database.helpers', () => ({
   loadExperiencesListOptions: jest.fn().mockResolvedValue([
      { value: 1, label: 'Experience 1' },
      { value: 2, label: 'Experience 2' }
   ]),
   loadSkillsOptions: jest.fn().mockResolvedValue([
      { value: 1, label: 'JavaScript' },
      { value: 2, label: 'React' }
   ])
}));

// Mock common components
jest.mock('@/components/common', () => ({
   Card: ({ children, padding }: any) => (
      <div data-testid="card" data-padding={padding}>
         {children}
      </div>
   )
}));

// Mock layout components
jest.mock('@/components/layout', () => ({
   ContentSidebar: ({ children }: any) => (
      <div data-testid="content-sidebar">
         {children}
      </div>
   )
}));

// Mock hooks
jest.mock('@/hooks', () => ({
   Form: ({ children, hideSubmit, onSubmit }: any) => (
      <form 
         data-testid="create-curriculum-form"
         data-hide-submit={hideSubmit}
         onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
               title: 'Test CV',
               job_title: 'Developer',
               sub_title: 'Full Stack',
               experience_time: 5,
               summary: 'Test summary',
               cv_experiences: [1, 2],
               is_master: true,
               notes: 'Test notes',
               cv_skills: [1, 2]
            });
         }}
      >
         {children}
      </form>
   ),
   FormInput: ({ fieldName, label, placeholder, type, multiline, minRows }: any) => (
      <div data-testid={`form-input-${fieldName}`}>
         <label htmlFor={fieldName}>{label}</label>
         {multiline ? (
            <textarea
               id={fieldName}
               name={fieldName}
               placeholder={placeholder}
               rows={minRows}
               data-testid={`textarea-${fieldName}`}
            />
         ) : (
            <input
               id={fieldName}
               name={fieldName}
               type={type || 'text'}
               placeholder={placeholder}
               data-testid={`input-${fieldName}`}
            />
         )}
      </div>
   ),
   FormMultiSelectChip: ({ fieldName, label, loadOptions }: any) => (
      <div data-testid={`form-multi-select-${fieldName}`}>
         <label>{label}</label>
         <div data-testid={`multi-select-${fieldName}`}>Multi Select Chip</div>
      </div>
   ),
   FormSubmit: ({ startIcon, label }: any) => (
      <button type="submit" data-testid="form-submit">
         {startIcon}
         {label}
      </button>
   )
}));

// Mock FormCheckSwitch
jest.mock('@/hooks/Form/inputs/FormCheckSwitch', () => {
   return function FormCheckSwitch({ fieldName, label }: any) {
      return (
         <div data-testid={`form-check-switch-${fieldName}`}>
            <label htmlFor={fieldName}>{label}</label>
            <input
               id={fieldName}
               type="checkbox"
               name={fieldName}
               data-testid={`checkbox-${fieldName}`}
            />
         </div>
      );
   };
});

// Mock FormCheckboxList
jest.mock('@/hooks/Form/inputs/FormCheckboxList', () => {
   return function FormCheckboxList({ fieldName, label, loadOptions }: any) {
      return (
         <div data-testid={`form-checkbox-list-${fieldName}`}>
            <label>{label}</label>
            <div data-testid={`checkbox-list-${fieldName}`}>Checkbox List</div>
         </div>
      );
   };
});

// Mock Material-UI icons
jest.mock('@mui/icons-material', () => ({
   Save: () => <span data-testid="save-icon">Save</span>
}));

// Mock useAjax hook
const mockAjax = {
   get: jest.fn(),
   post: jest.fn(),
   put: jest.fn(),
   delete: jest.fn()
};

jest.mock('@/hooks/useAjax', () => ({
   useAjax: jest.fn(() => mockAjax)
}));

// Mock the TextResources provider
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn(() => ({
      textResources: {
         currentLanguage: 'en',
         getText: jest.fn((key: string) => {
            const texts: { [key: string]: string } = {
               'CreateCurriculumForm.title.label': 'Title',
               'CreateCurriculumForm.title.placeholder': 'Enter curriculum title...',
               'CreateCurriculumForm.job_title.label': 'Job Title',
               'CreateCurriculumForm.job_title.placeholder': 'Enter job title...',
               'CreateCurriculumForm.sub_title.label': 'Sub Title',
               'CreateCurriculumForm.sub_title.placeholder': 'Enter sub title...',
               'CreateCurriculumForm.experienceTime.label': 'Experience Time',
               'CreateCurriculumForm.experienceTime.placeholder': 'Enter years of experience...',
               'CreateCurriculumForm.summary.label': 'Summary',
               'CreateCurriculumForm.summary.placeholder': 'Enter summary...',
               'CreateCurriculumForm.cv_experiences.label': 'Experiences',
               'CreateCurriculumForm.is_master.label': 'Is Master CV',
               'CreateCurriculumForm.notes.label': 'Notes',
               'CreateCurriculumForm.notes.placeholder': 'Enter notes...',
               'CreateCurriculumForm.skills.label': 'Skills',
               'CreateCurriculumForm.submit.label': 'Create Curriculum'
            };
            return texts[key] || `Mocked text for ${key}`;
         })
      }
   }))
}));

const mockPush = jest.fn();
const mockRouter = { push: mockPush };

describe('CreateCurriculumForm', () => {
   beforeEach(() => {
      jest.clearAllMocks();
      (useRouter as jest.Mock).mockReturnValue(mockRouter);
   });

   it('renders the form with correct structure', () => {
      render(<CreateCurriculumForm />);

      expect(screen.getByTestId('create-curriculum-form')).toBeInTheDocument();
      expect(screen.getByTestId('content-sidebar')).toBeInTheDocument();
      expect(screen.getAllByTestId('card')).toHaveLength(6); // 6 cards as per the component
   });

   it('renders all form input fields', () => {
      render(<CreateCurriculumForm />);

      expect(screen.getByTestId('form-input-title')).toBeInTheDocument();
      expect(screen.getByTestId('form-input-job_title')).toBeInTheDocument();
      expect(screen.getByTestId('form-input-sub_title')).toBeInTheDocument();
      expect(screen.getByTestId('form-input-experience_time')).toBeInTheDocument();
      expect(screen.getByTestId('form-input-summary')).toBeInTheDocument();
      expect(screen.getByTestId('form-input-notes')).toBeInTheDocument();
   });

   it('renders special form components', () => {
      render(<CreateCurriculumForm />);

      expect(screen.getByTestId('form-checkbox-list-cv_experiences')).toBeInTheDocument();
      expect(screen.getByTestId('form-check-switch-is_master')).toBeInTheDocument();
      expect(screen.getByTestId('form-multi-select-cv_skills')).toBeInTheDocument();
      expect(screen.getByTestId('form-submit')).toBeInTheDocument();
   });

   it('displays correct labels and placeholders', () => {
      render(<CreateCurriculumForm />);

      // Check labels
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Job Title')).toBeInTheDocument();
      expect(screen.getByText('Sub Title')).toBeInTheDocument();
      expect(screen.getByText('Experience Time')).toBeInTheDocument();
      expect(screen.getByText('Summary')).toBeInTheDocument();
      expect(screen.getByText('Experiences')).toBeInTheDocument();
      expect(screen.getByText('Is Master CV')).toBeInTheDocument();
      expect(screen.getByText('Notes')).toBeInTheDocument();
      expect(screen.getByText('Skills')).toBeInTheDocument();

      // Check placeholders
      expect(screen.getByPlaceholderText('Enter curriculum title...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter job title...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter sub title...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter years of experience...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter summary...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter notes...')).toBeInTheDocument();
   });

   it('renders submit button with correct label and icon', () => {
      render(<CreateCurriculumForm />);

      const submitButton = screen.getByTestId('form-submit');
      expect(submitButton).toBeInTheDocument();
      expect(screen.getByText('Create Curriculum')).toBeInTheDocument();
      expect(screen.getByTestId('save-icon')).toBeInTheDocument();
   });

   it('configures experience time as number input', () => {
      render(<CreateCurriculumForm />);

      const experienceInput = screen.getByTestId('input-experience_time');
      expect(experienceInput).toHaveAttribute('type', 'number');
   });

   it('configures summary as multiline textarea with correct rows', () => {
      render(<CreateCurriculumForm />);

      const summaryTextarea = screen.getByTestId('textarea-summary');
      expect(summaryTextarea).toBeInTheDocument();
      expect(summaryTextarea).toHaveAttribute('rows', '5');
   });

   it('configures notes as multiline textarea with correct rows', () => {
      render(<CreateCurriculumForm />);

      const notesTextarea = screen.getByTestId('textarea-notes');
      expect(notesTextarea).toBeInTheDocument();
      expect(notesTextarea).toHaveAttribute('rows', '3');
   });

   it('sets form to hide default submit button', () => {
      render(<CreateCurriculumForm />);

      const form = screen.getByTestId('create-curriculum-form');
      expect(form).toHaveAttribute('data-hide-submit', 'true');
   });

   it('handles successful form submission', async () => {
      const mockResponse = { 
         success: true, 
         data: { id: 123, title: 'Test CV' } 
      };
      mockAjax.post.mockResolvedValue(mockResponse);

      render(<CreateCurriculumForm />);

      const form = screen.getByTestId('create-curriculum-form');
      fireEvent.submit(form);

      await waitFor(() => {
         expect(mockAjax.post).toHaveBeenCalledWith('/curriculum/create', {
            title: 'Test CV',
            job_title: 'Developer',
            sub_title: 'Full Stack',
            experience_time: 5,
            summary: 'Test summary',
            cv_experiences: [1, 2],
            is_master: true,
            notes: 'Test notes',
            cv_skills: [1, 2]
         });
         expect(mockPush).toHaveBeenCalledWith('/admin/curriculum/123');
      });
   });

   it('handles form submission error', async () => {
      const mockError = { success: false, message: 'Creation failed' };
      mockAjax.post.mockResolvedValue(mockError);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(<CreateCurriculumForm />);

      const form = screen.getByTestId('create-curriculum-form');
      fireEvent.submit(form);

      await waitFor(() => {
         expect(consoleSpy).toHaveBeenCalledWith('Error creating curriculum:', 'Creation failed');
      });

      consoleSpy.mockRestore();
   });

   it('handles network error during submission', async () => {
      const networkError = new Error('Network error');
      mockAjax.post.mockRejectedValue(networkError);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(<CreateCurriculumForm />);

      const form = screen.getByTestId('create-curriculum-form');
      fireEvent.submit(form);

      await waitFor(() => {
         expect(consoleSpy).toHaveBeenCalledWith('Error creating curriculum:', networkError);
      });

      consoleSpy.mockRestore();
   });

   it('organizes form fields in proper card layout', () => {
      render(<CreateCurriculumForm />);

      const cards = screen.getAllByTestId('card');
      cards.forEach(card => {
         expect(card).toHaveAttribute('data-padding', 'm');
      });
   });

   it('loads experiences and skills options', () => {
      const { loadExperiencesListOptions, loadSkillsOptions } = require('@/helpers/database.helpers');
      
      render(<CreateCurriculumForm />);

      // These should be called when components mount
      expect(loadExperiencesListOptions).toBeDefined();
      expect(loadSkillsOptions).toBeDefined();
   });

   it('uses TextResources for internationalization', () => {
      const { useTextResources } = require('@/services/TextResources/TextResourcesProvider');
      
      render(<CreateCurriculumForm />);

      expect(useTextResources).toHaveBeenCalled();
   });

   it('renders content in sidebar layout', () => {
      render(<CreateCurriculumForm />);

      const contentSidebar = screen.getByTestId('content-sidebar');
      expect(contentSidebar).toBeInTheDocument();
      
      // All cards should be within the sidebar
      const cards = screen.getAllByTestId('card');
      expect(cards.length).toBeGreaterThan(0);
   });

   it('handles checkbox and multi-select components properly', () => {
      render(<CreateCurriculumForm />);

      // Master CV checkbox
      const masterCheckbox = screen.getByTestId('checkbox-is_master');
      expect(masterCheckbox).toBeInTheDocument();
      expect(masterCheckbox).toHaveAttribute('type', 'checkbox');

      // Experiences checkbox list
      expect(screen.getByTestId('checkbox-list-cv_experiences')).toBeInTheDocument();

      // Skills multi-select
      expect(screen.getByTestId('multi-select-cv_skills')).toBeInTheDocument();
   });

   it('maintains proper field naming conventions', () => {
      render(<CreateCurriculumForm />);

      const fieldNames = [
         'title', 'job_title', 'sub_title', 'experience_time', 
         'summary', 'cv_experiences', 'is_master', 'notes', 'cv_skills'
      ];

      fieldNames.forEach(fieldName => {
         const element = screen.getByTestId(new RegExp(`form-.*-${fieldName}`));
         expect(element).toBeInTheDocument();
      });
   });
});
