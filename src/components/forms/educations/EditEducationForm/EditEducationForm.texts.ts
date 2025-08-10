import { TextResources } from '@/services';

const textResources = new TextResources();

textResources.create('EditEducationForm.fields.institution_name.label', 'Institution Name');
textResources.create('EditEducationForm.fields.institution_name.label', 'Nome da Instituição', 'pt');

textResources.create('EditEducationForm.fields.institution_name.placeholder', 'Enter institution name');
textResources.create('EditEducationForm.fields.institution_name.placeholder', 'Digite o nome da instituição', 'pt');

textResources.create('EditEducationForm.fields.start_date.label', 'Start Date');
textResources.create('EditEducationForm.fields.start_date.label', 'Data de Início', 'pt');

textResources.create('EditEducationForm.fields.start_date.placeholder', 'Select start date');
textResources.create('EditEducationForm.fields.start_date.placeholder', 'Selecione a data de início', 'pt');

textResources.create('EditEducationForm.fields.end_date.label', 'End Date');
textResources.create('EditEducationForm.fields.end_date.label', 'Data de Fim', 'pt');
textResources.create('EditEducationForm.fields.end_date.placeholder', 'Select end date');
textResources.create('EditEducationForm.fields.end_date.placeholder', 'Selecione a data de fim', 'pt');

export default textResources;
