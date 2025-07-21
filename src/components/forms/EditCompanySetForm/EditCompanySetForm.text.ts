import { TextResources } from '@/services';

const textResources = new TextResources();

textResources.create('EditCompanySetForm.language.label', 'Language');
textResources.create('EditCompanySetForm.language.label', 'Idioma', 'pt');

textResources.create('EditCompanySetForm.industry.label', 'Industry');
textResources.create('EditCompanySetForm.industry.label', 'Indústria', 'pt');  
textResources.create('EditCompanySetForm.industry.placeholder', 'Select industry');
textResources.create('EditCompanySetForm.industry.placeholder', 'Selecione a indústria', 'pt');

textResources.create('EditCompanySetForm.description.label', 'Description');
textResources.create('EditCompanySetForm.description.label', 'Descrição', 'pt');
textResources.create('EditCompanySetForm.description.placeholder', 'Enter company description');
textResources.create('EditCompanySetForm.description.placeholder', 'Insira a descrição da empresa', 'pt');

textResources.create('EditCompanySetForm.submitButton', 'Save Changes');
textResources.create('EditCompanySetForm.submitButton', 'Salvar Alterações', 'pt');

export default textResources;

