import { TextResources } from '@/services';

const textResources = new TextResources();

textResources.create('EditCVInfosForm.submitButton', 'Save Changes');
textResources.create('EditCVInfosForm.submitButton', 'Salvar Alterações', 'pt');

textResources.create('EditCVInfosForm.field.title.label', 'CV Title');
textResources.create('EditCVInfosForm.field.title.label', 'Título do CV', 'pt');
textResources.create('EditCVInfosForm.field.title.placeholder', 'Enter CV Title');
textResources.create('EditCVInfosForm.field.title.placeholder', 'Digite o Título do CV', 'pt');

textResources.create('EditCVInfosForm.field.notes.label', 'Reference Notes');
textResources.create('EditCVInfosForm.field.notes.label', 'Notas de Referência', 'pt');
textResources.create('EditCVInfosForm.field.notes.placeholder', 'Enter Reference Notes');
textResources.create('EditCVInfosForm.field.notes.placeholder', 'Digite as Notas de Referência', 'pt');

export default textResources;
