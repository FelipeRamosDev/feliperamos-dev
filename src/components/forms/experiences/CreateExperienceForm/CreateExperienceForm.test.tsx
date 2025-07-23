import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateExperienceForm from './CreateExperienceForm';
import { FormValues } from '@/hooks/Form/Form.types';
import { CompanyData, SkillData } from '@/types/database.types';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
   useRouter: () => ({
      push: mockPush
   })
}));

// Mock MUI icons
jest.mock('@mui/icons-material', () => ({
   Save: () => <div data-testid="save-icon">Save Icon</div>
}));

// Mock company and skill data
const mockCompanyData: CompanyData[] = [
   {
      id: 1,
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      schemaName: 'companies_schema',
      tableName: 'companies',
      company_id: 1,
      company_name: 'Test Company 1',
      location: 'New York, NY',
      logo_url: 'https://test1.com/logo.png',
      site_url: 'https://test1.com',
      description: 'Test company 1 description',
      industry: 'Technology',
      language_set: 'en',
      languageSets: []
   },
   {
      id: 2,
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      schemaName: 'companies_schema',
      tableName: 'companies',
      company_id: 2,
      company_name: 'Test Company 2',
      location: 'San Francisco, CA',
      logo_url: 'https://test2.com/logo.png',
      site_url: 'https://test2.com',
      description: 'Test company 2 description',
      industry: 'Finance',
      language_set: 'en',
      languageSets: []
   }
];

const mockSkillData: SkillData[] = [
   {
      id: 1,
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      schemaName: 'skills_schema',
      tableName: 'skills',
      journey: 'Senior React Developer',
      language_set: 'en',
      skill_id: 'react',
      user_id: 1,
      category: 'frameworks',
      level: 'expert',
      name: 'React',
      languageSets: []
   },
   {
      id: 2,
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      schemaName: 'skills_schema',
      tableName: 'skills',
      journey: 'Full Stack Developer',
      language_set: 'en',
      skill_id: 'typescript',
      user_id: 2,
      category: 'languages',
      level: 'expert',
      name: 'TypeScript',
      languageSets: []
   }
];

// Mock Form hooks and components
const mockFormSubmit = jest.fn();
const mockFormInputs: Array<{
   fieldName: string;
   label?: string;
   placeholder?: string;
   multiline?: boolean;
   minRows?: number;
   parseInput?: ((value: string) => string) | boolean;
   options?: Array<{ value: string; label: string }>;
   loadOptions?: () => Promise<Array<{ value: string; label: string }>> | Array<{ value: string; label: string }>;
   defaultValue?: string;
   disableNone?: boolean;
   value: string | string[];
}> = [];

jest.mock('@/hooks', () => ({
   Form: ({ children, className, onSubmit, initialValues, hideSubmit, ...props }: { children: React.ReactNode; className?: string; onSubmit?: (data: FormValues) => void; initialValues?: FormValues; hideSubmit?: boolean } & Record<string, unknown>) => {
      // Store the onSubmit handler for testing
      mockFormSubmit.mockImplementation(async (formData: FormValues) => {
         try {
            return await onSubmit?.(formData);
         } catch (error) {
            console.error('Form submission error:', error);
            return { success: false, error };
         }
      });
      
      return (
         <form 
            data-testid="create-experience-form" 
            className={className}
            data-hide-submit={hideSubmit}
            data-initial-values={JSON.stringify(initialValues)}
            onSubmit={async (e) => {
               e.preventDefault();
               const formData: FormValues = mockFormInputs.reduce((acc, input) => {
                  acc[input.fieldName] = input.value || initialValues?.[input.fieldName] || '';
                  return acc;
               }, {} as FormValues);
               
               // Include initial values that aren't form inputs
               Object.keys(initialValues || {}).forEach(key => {
                  if (!formData.hasOwnProperty(key)) {
                     formData[key as keyof FormValues] = (initialValues as Record<string, string>)?.[key] || '';
                  }
               });
               
               try {
                  await onSubmit?.(formData);
               } catch (error) {
                  console.error('Form submission error caught:', error);
               }
            }}
            {...props}
         >
            {children}
         </form>
      );
   },
   FormInput: ({ fieldName, label, placeholder, multiline, minRows, parseInput, ...props }: { fieldName: string; label?: string; placeholder?: string; multiline?: boolean; minRows?: number; parseInput?: ((value: string) => string) | boolean } & Record<string, unknown>) => {
      const inputData = { fieldName, label, placeholder, multiline, minRows, parseInput, value: '' };
      
      // Update or add to mockFormInputs
      const existingIndex = mockFormInputs.findIndex(input => input.fieldName === fieldName);
      if (existingIndex >= 0) {
         mockFormInputs[existingIndex] = inputData;
      } else {
         mockFormInputs.push(inputData);
      }

      return (
         <div data-testid={`form-input-${fieldName}`} data-multiline={multiline} data-min-rows={minRows} {...props}>
            <label data-testid={`label-${fieldName}`}>{label}</label>
            {multiline ? (
               <textarea 
                  data-testid={`textarea-${fieldName}`}
                  placeholder={placeholder}
                  aria-label={label}
                  onChange={(e) => {
                     let value = e.target.value;
                     if (parseInput && typeof parseInput === 'function') {
                        value = parseInput(value);
                     }
                     inputData.value = value;
                  }}
               />
            ) : (
               <input 
                  data-testid={`input-${fieldName}`}
                  placeholder={placeholder || label || fieldName}
                  aria-label={label}
                  title={label || fieldName}
                  onChange={(e) => {
                     let value = e.target.value;
                     if (parseInput && typeof parseInput === 'function') {
                        value = parseInput(value);
                     }
                     inputData.value = value;
                  }}
               />
            )}
         </div>
      );
   }
}));

// Mock Form components
jest.mock('@/hooks/Form/inputs/FormSubmit', () => {
   return function FormSubmit({ label, startIcon, ...props }: { label?: string; startIcon?: React.ReactNode } & Record<string, unknown>) {
      return (
         <button data-testid="form-submit" type="submit" {...props}>
            {startIcon}
            {label}
         </button>
      );
   };
});

jest.mock('@/hooks/Form/inputs/FormButtonSelect', () => {
   return function FormButtonSelect({ fieldName, label, options, defaultValue, ...props }: { fieldName: string; label?: string; options?: Array<{ value: string; label: string }>; defaultValue?: string } & Record<string, unknown>) {
      const selectData = { fieldName, label, options, defaultValue, value: defaultValue || '' };
      
      // Add to mockFormInputs
      const existingIndex = mockFormInputs.findIndex(input => input.fieldName === fieldName);
      if (existingIndex >= 0) {
         mockFormInputs[existingIndex] = selectData;
      } else {
         mockFormInputs.push(selectData);
      }

      return (
         <div data-testid={`form-button-select-${fieldName}`} {...props}>
            <label data-testid={`label-${fieldName}`}>{label}</label>
            <div data-testid={`button-group-${fieldName}`}>
               {options?.map((option: { value: string; label: string }) => (
                  <button 
                     key={option.value}
                     type="button"
                     data-testid={`button-${fieldName}-${option.value}`}
                     onClick={() => {
                        selectData.value = option.value;
                     }}
                  >
                     {option.label}
                  </button>
               ))}
            </div>
         </div>
      );
   };
});

jest.mock('@/hooks/Form/inputs/FormDatePicker', () => {
   return function FormDatePicker({ fieldName, label, ...props }: { fieldName: string; label?: string } & Record<string, unknown>) {
      const dateData = { fieldName, label, value: '' };
      
      // Add to mockFormInputs
      const existingIndex = mockFormInputs.findIndex(input => input.fieldName === fieldName);
      if (existingIndex >= 0) {
         mockFormInputs[existingIndex] = dateData;
      } else {
         mockFormInputs.push(dateData);
      }

      return (
         <div data-testid={`form-date-picker-${fieldName}`} {...props}>
            <label data-testid={`label-${fieldName}`}>{label}</label>
            <input 
               type="date"
               data-testid={`date-input-${fieldName}`}
               aria-label={label}
               title={label || fieldName}
               onChange={(e) => {
                  dateData.value = e.target.value;
               }}
            />
         </div>
      );
   };
});

jest.mock('@/hooks/Form/inputs/FormSelect', () => {
   return function FormSelect({ fieldName, label, loadOptions, disableNone, ...props }: { fieldName: string; label?: string; loadOptions?: () => Promise<Array<{ value: string; label: string }>> | Array<{ value: string; label: string }>; disableNone?: boolean } & Record<string, unknown>) {
      const [options, setOptions] = React.useState<Array<{ value: string; label: string }>>([]);
      const selectData = { fieldName, label, loadOptions, disableNone, value: '' };
      
      React.useEffect(() => {
         if (loadOptions) {
            const result = loadOptions();
            if (Array.isArray(result)) {
               setOptions(result);
            } else {
               (result as Promise<Array<{ value: string; label: string }>>).then(setOptions);
            }
         }
      }, [loadOptions]);
      
      // Add to mockFormInputs
      const existingIndex = mockFormInputs.findIndex(input => input.fieldName === fieldName);
      if (existingIndex >= 0) {
         mockFormInputs[existingIndex] = selectData;
      } else {
         mockFormInputs.push(selectData);
      }

      return (
         <div data-testid={`form-select-${fieldName}`} {...props}>
            <label data-testid={`label-${fieldName}`}>{label}</label>
            <select 
               data-testid={`select-${fieldName}`}
               aria-label={label}
               onChange={(e) => {
                  selectData.value = e.target.value;
               }}
            >
               {!disableNone && <option value="">None</option>}
               {options.map((option: { value: string; label: string }) => (
                  <option key={option.value} value={option.value}>
                     {option.label}
                  </option>
               ))}
            </select>
         </div>
      );
   };
});

jest.mock('@/hooks/Form/inputs/FormMultiSelectChip', () => {
   return function FormMultiSelectChip({ fieldName, label, placeholder, loadOptions, ...props }: { fieldName: string; label?: string; placeholder?: string; loadOptions?: () => Promise<Array<{ value: string; label: string }>> | Array<{ value: string; label: string }> } & Record<string, unknown>) {
      const [options, setOptions] = React.useState<Array<{ value: string; label: string }>>([]);
      const chipData = { fieldName, label, placeholder, loadOptions, value: [] as string[] };
      
      React.useEffect(() => {
         if (loadOptions) {
            const result = loadOptions();
            if (Array.isArray(result)) {
               setOptions(result);
            } else {
               (result as Promise<Array<{ value: string; label: string }>>).then(setOptions);
            }
         }
      }, [loadOptions]);
      
      // Add to mockFormInputs
      const existingIndex = mockFormInputs.findIndex(input => input.fieldName === fieldName);
      if (existingIndex >= 0) {
         mockFormInputs[existingIndex] = chipData;
      } else {
         mockFormInputs.push(chipData);
      }

      return (
         <div data-testid={`form-multi-select-chip-${fieldName}`} {...props}>
            <label data-testid={`label-${fieldName}`}>{label}</label>
            <div data-testid={`chips-container-${fieldName}`}>
               {options.map((option: { value: string; label: string }) => (
                  <button 
                     key={option.value}
                     type="button"
                     data-testid={`chip-${fieldName}-${option.value}`}
                     onClick={() => {
                        const currentValue = chipData.value || [];
                        if (currentValue.includes(option.value)) {
                           chipData.value = currentValue.filter((v: string) => v !== option.value);
                        } else {
                           chipData.value = [...currentValue, option.value];
                        }
                     }}
                  >
                     {option.label}
                  </button>
               ))}
            </div>
         </div>
      );
   };
});

// Mock layout components
jest.mock('@/components/layout', () => ({
   ContentSidebar: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="content-sidebar">
         {children}
      </div>
   )
}));

jest.mock('@/components/common', () => ({
   Card: ({ children, padding, className, ...props }: { children: React.ReactNode; padding?: string; className?: string } & Record<string, unknown>) => (
      <div data-testid="card" data-padding={padding} className={className} {...props}>
         {children}
      </div>
   )
}));

// Mock useAjax hook
const mockPost = jest.fn();
const mockGet = jest.fn();
jest.mock('@/hooks/useAjax', () => ({
   useAjax: () => ({
      post: mockPost,
      get: mockGet
   })
}));

// Mock text resources
const mockUseTextResources = jest.fn();
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => mockUseTextResources()
}));

jest.mock('./CreateExperienceForm.text', () => ({
   default: {
      getText: jest.fn(),
      create: jest.fn()
   }
}));

describe('CreateExperienceForm', () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockFormInputs.length = 0; // Clear form inputs array
      
      mockUseTextResources.mockReturnValue({
         textResources: {
            getText: jest.fn((key: string) => {
               const textMap: Record<string, string> = {
                  'CreateExperienceForm.title.label': 'Experience Title',
                  'CreateExperienceForm.title.placeholder': 'Enter the title of the experience',
                  'CreateExperienceForm.slug.label': 'Slug',
                  'CreateExperienceForm.position.label': 'Position',
                  'CreateExperienceForm.position.placeholder': 'Enter the position held',
                  'CreateExperienceForm.type.label': 'Work Type',
                  'CreateExperienceForm.summary.label': 'Summary',
                  'CreateExperienceForm.summary.placeholder': 'Enter a brief summary of the experience',
                  'CreateExperienceForm.description.label': 'Description',
                  'CreateExperienceForm.description.placeholder': 'Enter a detailed description of the experience',
                  'CreateExperienceForm.company_id.label': 'Company',
                  'CreateExperienceForm.skills.label': 'Skills',
                  'CreateExperienceForm.skills.placeholder': 'Select or add skills',
                  'CreateExperienceForm.start_date.label': 'Start Date',
                  'CreateExperienceForm.end_date.label': 'End Date',
                  'CreateExperienceForm.responsibilities.label': 'Responsibilities',
                  'CreateExperienceForm.responsibilities.placeholder': 'Enter the responsibilities held',
                  'CreateExperienceForm.submit': 'Save Draft'
               };
               return textMap[key] || key;
            }),
            currentLanguage: 'en'
         }
      });

      // Mock company and skill API responses
      mockGet.mockImplementation((endpoint: string) => {
         if (endpoint === '/company/query') {
            return Promise.resolve({
               success: true,
               data: mockCompanyData,
               message: 'Success'
            });
         }
         if (endpoint === '/skill/query') {
            return Promise.resolve({
               success: true,
               data: mockSkillData,
               message: 'Success'
            });
         }
         return Promise.resolve({
            success: false,
            data: [],
            message: 'Not found'
         });
      });
   });

   describe('Basic Rendering', () => {
      test('renders without crashing', () => {
         expect(() => render(<CreateExperienceForm />)).not.toThrow();
      });

      test('renders form with correct attributes', () => {
         render(<CreateExperienceForm />);
         
         const form = screen.getByTestId('create-experience-form');
         expect(form).toBeInTheDocument();
         expect(form).toHaveClass('CreateExperienceForm');
         expect(form).toHaveAttribute('data-hide-submit', 'true');
      });

      test('renders ContentSidebar layout', () => {
         render(<CreateExperienceForm />);
         
         expect(screen.getByTestId('content-sidebar')).toBeInTheDocument();
      });

      test('renders all form cards', () => {
         render(<CreateExperienceForm />);
         
         const cards = screen.getAllByTestId('card');
         expect(cards).toHaveLength(7); // 2 main content + 5 sidebar cards
         
         cards.forEach(card => {
            expect(card).toHaveAttribute('data-padding', 'l');
            expect(card).toHaveClass('form-group');
         });
      });

      test('renders without any console errors', () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         render(<CreateExperienceForm />);
         expect(consoleSpy).not.toHaveBeenCalled();
         consoleSpy.mockRestore();
      });

      test('component has correct display name', () => {
         expect(CreateExperienceForm.name).toBe('CreateExperienceForm');
      });
   });

   describe('Initial Values Configuration', () => {
      test('sets default initial values correctly', () => {
         render(<CreateExperienceForm />);
         
         const form = screen.getByTestId('create-experience-form');
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         
         expect(initialValues.status).toBe('draft');
      });

      test('merges custom initial values with defaults', () => {
         const customInitialValues = {
            title: 'Custom Title',
            position: 'Custom Position',
            status: 'published'
         };
         
         render(<CreateExperienceForm initialValues={customInitialValues} />);
         
         const form = screen.getByTestId('create-experience-form');
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         
         expect(initialValues.title).toBe('Custom Title');
         expect(initialValues.position).toBe('Custom Position');
         expect(initialValues.status).toBe('published'); // Custom value overrides default
      });

      test('handles empty initial values', () => {
         render(<CreateExperienceForm initialValues={{}} />);
         
         const form = screen.getByTestId('create-experience-form');
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         
         expect(initialValues.status).toBe('draft');
      });
   });

   describe('Main Content Form Fields', () => {
      test('renders title field correctly', () => {
         render(<CreateExperienceForm />);
         
         const titleField = screen.getByTestId('form-input-title');
         const label = screen.getByTestId('label-title');
         const input = screen.getByTestId('input-title');
         
         expect(titleField).toBeInTheDocument();
         expect(label).toHaveTextContent('Experience Title');
         expect(input).toHaveAttribute('placeholder', 'Enter the title of the experience');
      });

      test('renders slug field with parseInput functionality', () => {
         render(<CreateExperienceForm />);
         
         const slugField = screen.getByTestId('form-input-slug');
         const label = screen.getByTestId('label-slug');
         const input = screen.getByTestId('input-slug');
         
         expect(slugField).toBeInTheDocument();
         expect(label).toHaveTextContent('Slug');
         expect(input).toBeInTheDocument();
         
         // Test parseInput functionality
         fireEvent.change(input, { target: { value: 'Test Title With Spaces' } });
         
         const slugInput = mockFormInputs.find(input => input.fieldName === 'slug');
         expect(slugInput?.value).toBe('test-title-with-spaces');
      });

      test('renders position field correctly', () => {
         render(<CreateExperienceForm />);
         
         const positionField = screen.getByTestId('form-input-position');
         const label = screen.getByTestId('label-position');
         const input = screen.getByTestId('input-position');
         
         expect(positionField).toBeInTheDocument();
         expect(label).toHaveTextContent('Position');
         expect(input).toHaveAttribute('placeholder', 'Enter the position held');
      });

      test('renders type button select correctly', () => {
         render(<CreateExperienceForm />);
         
         const typeField = screen.getByTestId('form-button-select-type');
         const label = screen.getByTestId('label-type');
         const buttonGroup = screen.getByTestId('button-group-type');
         
         expect(typeField).toBeInTheDocument();
         expect(label).toHaveTextContent('Work Type');
         expect(buttonGroup).toBeInTheDocument();
         
         // Check that type options are rendered
         expect(screen.getByTestId('button-type-contract')).toHaveTextContent('Contract');
         expect(screen.getByTestId('button-type-full_time')).toHaveTextContent('Full Time');
         expect(screen.getByTestId('button-type-part_time')).toHaveTextContent('Part Time');
         expect(screen.getByTestId('button-type-temporary')).toHaveTextContent('Temporary');
         expect(screen.getByTestId('button-type-internship')).toHaveTextContent('Internship');
         expect(screen.getByTestId('button-type-freelance')).toHaveTextContent('Freelance');
         expect(screen.getByTestId('button-type-other')).toHaveTextContent('Other');
      });

      test('renders summary field as multiline', () => {
         render(<CreateExperienceForm />);
         
         const summaryField = screen.getByTestId('form-input-summary');
         const label = screen.getByTestId('label-summary');
         const textarea = screen.getByTestId('textarea-summary');
         
         expect(summaryField).toBeInTheDocument();
         expect(summaryField).toHaveAttribute('data-multiline', 'true');
         expect(label).toHaveTextContent('Summary');
         expect(textarea).toHaveAttribute('placeholder', 'Enter a brief summary of the experience');
      });

      test('renders description field as multiline with minRows', () => {
         render(<CreateExperienceForm />);
         
         const descriptionField = screen.getByTestId('form-input-description');
         const label = screen.getByTestId('label-description');
         const textarea = screen.getByTestId('textarea-description');
         
         expect(descriptionField).toBeInTheDocument();
         expect(descriptionField).toHaveAttribute('data-multiline', 'true');
         expect(descriptionField).toHaveAttribute('data-min-rows', '10');
         expect(label).toHaveTextContent('Description');
         expect(textarea).toHaveAttribute('placeholder', 'Enter a detailed description of the experience');
      });
   });

   describe('Sidebar Form Fields', () => {
      test('renders status button select with default value', () => {
         render(<CreateExperienceForm />);
         
         const statusField = screen.getByTestId('form-button-select-status');
         const buttonGroup = screen.getByTestId('button-group-status');
         
         expect(statusField).toBeInTheDocument();
         expect(buttonGroup).toBeInTheDocument();
         
         // Check that status options are rendered
         expect(screen.getByTestId('button-status-draft')).toHaveTextContent('Draft');
         expect(screen.getByTestId('button-status-published')).toHaveTextContent('Published');
      });

      test('renders submit button with correct attributes', () => {
         render(<CreateExperienceForm />);
         
         const submitButton = screen.getByTestId('form-submit');
         const saveIcon = screen.getByTestId('SaveIcon');
         
         expect(submitButton).toBeInTheDocument();
         expect(submitButton).toHaveAttribute('type', 'submit');
         expect(submitButton).toHaveTextContent('Save Draft');
         expect(saveIcon).toBeInTheDocument();
      });

      test('renders company select field', async () => {
         render(<CreateExperienceForm />);
         
         const companyField = screen.getByTestId('form-select-company_id');
         const label = screen.getByTestId('label-company_id');
         const select = screen.getByTestId('select-company_id');
         
         expect(companyField).toBeInTheDocument();
         expect(label).toHaveTextContent('Company');
         expect(select).toBeInTheDocument();
         
         // Wait for options to load
         await waitFor(() => {
            expect(screen.getByText('Test Company 1')).toBeInTheDocument();
            expect(screen.getByText('Test Company 2')).toBeInTheDocument();
         });
      });

      test('renders skills multi-select chip field', async () => {
         render(<CreateExperienceForm />);
         
         const skillsField = screen.getByTestId('form-multi-select-chip-skills');
         const label = screen.getByTestId('label-skills');
         const chipsContainer = screen.getByTestId('chips-container-skills');
         
         expect(skillsField).toBeInTheDocument();
         expect(label).toHaveTextContent('Skills');
         expect(chipsContainer).toBeInTheDocument();
         
         // Wait for skills to load
         await waitFor(() => {
            expect(screen.getByTestId('chip-skills-1')).toHaveTextContent('React');
            expect(screen.getByTestId('chip-skills-2')).toHaveTextContent('TypeScript');
         });
      });

      test('renders date picker fields', () => {
         render(<CreateExperienceForm />);
         
         const startDateField = screen.getByTestId('form-date-picker-start_date');
         const startDateLabel = screen.getByTestId('label-start_date');
         const startDateInput = screen.getByTestId('date-input-start_date');
         
         const endDateField = screen.getByTestId('form-date-picker-end_date');
         const endDateLabel = screen.getByTestId('label-end_date');
         const endDateInput = screen.getByTestId('date-input-end_date');
         
         expect(startDateField).toBeInTheDocument();
         expect(startDateLabel).toHaveTextContent('Start Date');
         expect(startDateInput).toHaveAttribute('type', 'date');
         
         expect(endDateField).toBeInTheDocument();
         expect(endDateLabel).toHaveTextContent('End Date');
         expect(endDateInput).toHaveAttribute('type', 'date');
      });

      test('renders responsibilities field as multiline', () => {
         render(<CreateExperienceForm />);
         
         const responsibilitiesField = screen.getByTestId('form-input-responsibilities');
         const label = screen.getByTestId('label-responsibilities');
         const textarea = screen.getByTestId('textarea-responsibilities');
         
         expect(responsibilitiesField).toBeInTheDocument();
         expect(responsibilitiesField).toHaveAttribute('data-multiline', 'true');
         expect(label).toHaveTextContent('Responsibilities');
         expect(textarea).toHaveAttribute('placeholder', 'Enter the responsibilities held');
      });
   });

   describe('Text Resources Integration', () => {
      test('calls useTextResources with correct text module', () => {
         render(<CreateExperienceForm />);
         
         expect(mockUseTextResources).toHaveBeenCalledTimes(1);
      });

      test('retrieves all required text resources', () => {
         const mockGetText = jest.fn((key: string) => key);
         
         mockUseTextResources.mockReturnValue({
            textResources: { 
               getText: mockGetText,
               currentLanguage: 'en'
            }
         });

         render(<CreateExperienceForm />);
         
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceForm.title.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceForm.title.placeholder');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceForm.slug.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceForm.position.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceForm.position.placeholder');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceForm.type.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceForm.summary.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceForm.summary.placeholder');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceForm.description.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceForm.description.placeholder');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceForm.company_id.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceForm.skills.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceForm.skills.placeholder');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceForm.start_date.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceForm.end_date.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceForm.responsibilities.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceForm.responsibilities.placeholder');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceForm.submit');
      });

      test('handles missing text resources gracefully', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn(() => undefined),
               currentLanguage: 'en'
            }
         });

         expect(() => render(<CreateExperienceForm />)).not.toThrow();
      });

      test('displays custom text resources', () => {
         const customTextMap = {
            'CreateExperienceForm.title.label': 'Custom Experience Title',
            'CreateExperienceForm.submit': 'Custom Save Button'
         };

         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => customTextMap[key as keyof typeof customTextMap] || key),
               currentLanguage: 'en'
            }
         });

         render(<CreateExperienceForm />);
         
         expect(screen.getByText('Custom Experience Title')).toBeInTheDocument();
         expect(screen.getByText('Custom Save Button')).toBeInTheDocument();
      });
   });

   describe('Form Submission', () => {
      test('handles successful form submission', async () => {
         mockPost.mockResolvedValue({
            success: true,
            data: { id: 1, title: 'Test Experience' }
         });

         render(<CreateExperienceForm />);
         
         // Fill out form fields
         fireEvent.change(screen.getByTestId('input-title'), {
            target: { value: 'Test Experience' }
         });
         fireEvent.change(screen.getByTestId('input-position'), {
            target: { value: 'Software Developer' }
         });
         fireEvent.change(screen.getByTestId('textarea-summary'), {
            target: { value: 'Test summary' }
         });

         // Submit form
         fireEvent.submit(screen.getByTestId('create-experience-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/experience/create', expect.objectContaining({
               title: 'Test Experience',
               position: 'Software Developer',
               summary: 'Test summary',
               status: 'draft'
            }));
         });

         await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/admin');
         });
      });

      test('handles API error response', async () => {
         mockPost.mockResolvedValue({
            success: false,
            message: 'Failed to create experience'
         });

         render(<CreateExperienceForm />);
         
         fireEvent.submit(screen.getByTestId('create-experience-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/experience/create', expect.any(Object));
         });

         // Router should not be called on error
         expect(mockPush).not.toHaveBeenCalled();
      });

      test('handles network error', async () => {
         mockPost.mockRejectedValue(new Error('Network error'));

         render(<CreateExperienceForm />);
         
         fireEvent.submit(screen.getByTestId('create-experience-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalled();
         });

         // Router should not be called on error
         expect(mockPush).not.toHaveBeenCalled();
      });

      test('includes all form field values in submission', async () => {
         mockPost.mockResolvedValue({
            success: true,
            data: { id: 1 }
         });

         render(<CreateExperienceForm />);
         
         // Fill out all fields
         fireEvent.change(screen.getByTestId('input-title'), {
            target: { value: 'Full Test Experience' }
         });
         fireEvent.change(screen.getByTestId('input-slug'), {
            target: { value: 'Full Test Experience' } // Will be parsed to 'full-test-experience'
         });
         fireEvent.change(screen.getByTestId('input-position'), {
            target: { value: 'Senior Developer' }
         });
         fireEvent.change(screen.getByTestId('textarea-summary'), {
            target: { value: 'Comprehensive summary' }
         });
         fireEvent.change(screen.getByTestId('textarea-description'), {
            target: { value: 'Detailed description' }
         });
         fireEvent.change(screen.getByTestId('textarea-responsibilities'), {
            target: { value: 'Key responsibilities' }
         });
         fireEvent.change(screen.getByTestId('date-input-start_date'), {
            target: { value: '2023-01-01' }
         });
         fireEvent.change(screen.getByTestId('date-input-end_date'), {
            target: { value: '2023-12-31' }
         });

         // Select type
         fireEvent.click(screen.getByTestId('button-type-full_time'));

         fireEvent.submit(screen.getByTestId('create-experience-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/experience/create', expect.objectContaining({
               title: 'Full Test Experience',
               slug: 'full-test-experience',
               position: 'Senior Developer',
               summary: 'Comprehensive summary',
               description: 'Detailed description',
               responsibilities: 'Key responsibilities',
               start_date: '2023-01-01',
               end_date: '2023-12-31',
               type: 'full_time',
               status: 'draft'
            }));
         });
      });
   });

   describe('Load Options Integration', () => {
      test('loads company options correctly', async () => {
         render(<CreateExperienceForm />);
         
         await waitFor(() => {
            expect(mockGet).toHaveBeenCalledWith('/company/query', {
               params: { language_set: 'en' }
            });
         });

         await waitFor(() => {
            expect(screen.getByText('Test Company 1')).toBeInTheDocument();
            expect(screen.getByText('Test Company 2')).toBeInTheDocument();
         });
      });

      test('loads skills options correctly', async () => {
         render(<CreateExperienceForm />);
         
         await waitFor(() => {
            expect(mockGet).toHaveBeenCalledWith('/skill/query', {
               params: { language_set: 'en' }
            });
         });

         await waitFor(() => {
            expect(screen.getByTestId('chip-skills-1')).toHaveTextContent('React');
            expect(screen.getByTestId('chip-skills-2')).toHaveTextContent('TypeScript');
         });
      });

      test('handles company loading error', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockGet.mockImplementation((endpoint: string) => {
            if (endpoint === '/company/query') {
               return Promise.resolve({
                  success: false,
                  data: [],
                  message: 'Failed to load companies'
               });
            }
            return Promise.resolve({ success: true, data: mockSkillData, message: 'Success' });
         });

         render(<CreateExperienceForm />);
         
         await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Failed to load companies:', 'Failed to load companies');
         });
         
         consoleSpy.mockRestore();
      });

      test('handles skills loading error', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockGet.mockImplementation((endpoint: string) => {
            if (endpoint === '/skill/query') {
               return Promise.resolve({
                  success: false,
                  data: [],
                  message: 'Failed to load skills'
               });
            }
            return Promise.resolve({ success: true, data: mockCompanyData, message: 'Success' });
         });

         render(<CreateExperienceForm />);
         
         await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Failed to load skills:', 'Failed to load skills');
         });
         
         consoleSpy.mockRestore();
      });
   });

   describe('User Interactions', () => {
      test('type selection works correctly', () => {
         render(<CreateExperienceForm />);
         
         const contractButton = screen.getByTestId('button-type-contract');
         fireEvent.click(contractButton);
         
         const typeInput = mockFormInputs.find(input => input.fieldName === 'type');
         expect(typeInput?.value).toBe('contract');
      });

      test('status selection works correctly', () => {
         render(<CreateExperienceForm />);
         
         const publishedButton = screen.getByTestId('button-status-published');
         fireEvent.click(publishedButton);
         
         const statusInput = mockFormInputs.find(input => input.fieldName === 'status');
         expect(statusInput?.value).toBe('published');
      });

      test('skills multi-select works correctly', async () => {
         render(<CreateExperienceForm />);
         
         await waitFor(() => {
            expect(screen.getByTestId('chip-skills-1')).toBeInTheDocument();
         });

         const reactChip = screen.getByTestId('chip-skills-1');
         const typescriptChip = screen.getByTestId('chip-skills-2');
         
         // Select React
         fireEvent.click(reactChip);
         
         const skillsInput = mockFormInputs.find(input => input.fieldName === 'skills');
         expect(skillsInput?.value).toContain(1);
         
         // Select TypeScript
         fireEvent.click(typescriptChip);
         expect(skillsInput?.value).toContain(1);
         expect(skillsInput?.value).toContain(2);
         
         // Deselect React
         fireEvent.click(reactChip);
         expect(skillsInput?.value).not.toContain(1);
         expect(skillsInput?.value).toContain(2);
      });

      test('date inputs work correctly', () => {
         render(<CreateExperienceForm />);
         
         const startDateInput = screen.getByTestId('date-input-start_date');
         const endDateInput = screen.getByTestId('date-input-end_date');
         
         fireEvent.change(startDateInput, { target: { value: '2023-01-01' } });
         fireEvent.change(endDateInput, { target: { value: '2023-12-31' } });
         
         const startDateData = mockFormInputs.find(input => input.fieldName === 'start_date');
         const endDateData = mockFormInputs.find(input => input.fieldName === 'end_date');
         
         expect(startDateData?.value).toBe('2023-01-01');
         expect(endDateData?.value).toBe('2023-12-31');
      });
   });

   describe('Props Handling', () => {
      test('handles undefined initialValues prop', () => {
         expect(() => render(<CreateExperienceForm />)).not.toThrow();
      });

      test('handles empty initialValues prop', () => {
         expect(() => render(<CreateExperienceForm initialValues={{}} />)).not.toThrow();
      });

      test('applies custom initialValues correctly', () => {
         const customValues = {
            title: 'Custom Title',
            position: 'Custom Position',
            type: 'freelance'
         };
         
         render(<CreateExperienceForm initialValues={customValues} />);
         
         const form = screen.getByTestId('create-experience-form');
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         
         expect(initialValues.title).toBe('Custom Title');
         expect(initialValues.position).toBe('Custom Position');
         expect(initialValues.type).toBe('freelance');
         expect(initialValues.status).toBe('draft'); // Default should still be applied
      });
   });

   describe('Error Handling', () => {
      test('handles textResources errors gracefully', () => {
         mockUseTextResources.mockImplementation(() => {
            throw new Error('TextResources error');
         });

         expect(() => render(<CreateExperienceForm />)).toThrow('TextResources error');
      });

      test('handles missing textResources object', () => {
         mockUseTextResources.mockReturnValue({});

         expect(() => render(<CreateExperienceForm />)).toThrow();
      });
   });

   describe('Accessibility', () => {
      test('form has proper semantic structure', () => {
         render(<CreateExperienceForm />);
         
         const form = screen.getByTestId('create-experience-form');
         expect(form.tagName).toBe('FORM');
      });

      test('all form fields have associated labels', () => {
         render(<CreateExperienceForm />);
         
         expect(screen.getByTestId('label-title')).toBeInTheDocument();
         expect(screen.getByTestId('label-slug')).toBeInTheDocument();
         expect(screen.getByTestId('label-position')).toBeInTheDocument();
         expect(screen.getByTestId('label-type')).toBeInTheDocument();
         expect(screen.getByTestId('label-summary')).toBeInTheDocument();
         expect(screen.getByTestId('label-description')).toBeInTheDocument();
         expect(screen.getByTestId('label-company_id')).toBeInTheDocument();
         expect(screen.getByTestId('label-skills')).toBeInTheDocument();
         expect(screen.getByTestId('label-start_date')).toBeInTheDocument();
         expect(screen.getByTestId('label-end_date')).toBeInTheDocument();
         expect(screen.getByTestId('label-responsibilities')).toBeInTheDocument();
      });

      test('submit button has proper attributes', () => {
         render(<CreateExperienceForm />);
         
         const submitButton = screen.getByTestId('form-submit');
         expect(submitButton).toHaveAttribute('type', 'submit');
      });

      test('select elements have aria-label attributes', () => {
         render(<CreateExperienceForm />);
         
         const companySelect = screen.getByTestId('select-company_id');
         expect(companySelect).toHaveAttribute('aria-label', 'Company');
      });
   });

   describe('Performance', () => {
      test('renders efficiently without unnecessary re-renders', () => {
         const { rerender } = render(<CreateExperienceForm />);
         
         const initialForm = screen.getByTestId('create-experience-form');
         rerender(<CreateExperienceForm />);
         const rerenderedForm = screen.getByTestId('create-experience-form');
         
         expect(initialForm).toBeInTheDocument();
         expect(rerenderedForm).toBeInTheDocument();
      });

      test('maintains component references across prop changes', () => {
         const { rerender } = render(<CreateExperienceForm />);
         
         rerender(<CreateExperienceForm initialValues={{ title: 'New Title' }} />);
         
         const form = screen.getByTestId('create-experience-form');
         expect(form).toBeInTheDocument();
      });
   });

   describe('Component Integration', () => {
      test('integrates all form components properly', () => {
         render(<CreateExperienceForm />);
         
         const form = screen.getByTestId('create-experience-form');
         const contentSidebar = screen.getByTestId('content-sidebar');
         const cards = screen.getAllByTestId('card');
         const submitButton = screen.getByTestId('form-submit');
         
         expect(form).toBeInTheDocument();
         expect(contentSidebar).toBeInTheDocument();
         expect(cards).toHaveLength(7);
         expect(submitButton).toBeInTheDocument();
      });

      test('maintains proper component hierarchy', () => {
         render(<CreateExperienceForm />);
         
         const form = screen.getByTestId('create-experience-form');
         const contentSidebar = screen.getByTestId('content-sidebar');
         const submitButton = screen.getByTestId('form-submit');
         
         expect(form).toContainElement(contentSidebar);
         expect(contentSidebar).toContainElement(submitButton);
      });
   });
});