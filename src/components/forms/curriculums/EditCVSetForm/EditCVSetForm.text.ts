import { TextResources } from '@/services';

const textResources = new TextResources();

textResources.create('EditCVSetForm.submitButton', 'Save Changes');
textResources.create('EditCVSetForm.submitButton', 'Salvar Alterações', 'pt');

textResources.create('EditCVSetForm.field.language_set.label', 'Language Set');
textResources.create('EditCVSetForm.field.language_set.label', 'Campos de Idiomas', 'pt');

textResources.create('EditCVSetForm.field.job_title.label', 'Job Title');
textResources.create('EditCVSetForm.field.job_title.label', 'Título do Trabalho', 'pt');
textResources.create('EditCVSetForm.field.job_title.placeholder', 'Enter Job Title');
textResources.create('EditCVSetForm.field.job_title.placeholder', 'Digite o Título do Trabalho', 'pt');

textResources.create('EditCVSetForm.field.summary.label', 'Summary');
textResources.create('EditCVSetForm.field.summary.label', 'Resumo', 'pt');
textResources.create('EditCVSetForm.field.summary.placeholder', 'Enter Summary');
textResources.create('EditCVSetForm.field.summary.placeholder', 'Digite o Resumo', 'pt');

export default textResources;
