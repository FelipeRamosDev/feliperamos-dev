import { displayProficiency } from '@/helpers/app.helpers';
import { TextResources } from '@/services';

const textResources = new TextResources();

textResources.create('LanguageDetails.headerTitle', 'Language Details');
textResources.create('LanguageDetails.headerTitle', 'Idioma Detalhes', 'pt');

textResources.create('LanguageDetails.headerDescription', 'Manage the details of the language');
textResources.create('LanguageDetails.headerDescription', 'Gerenciar os detalhes do idioma', 'pt');

textResources.create('LanguageDetails.field.id', 'ID');
textResources.create('LanguageDetails.field.id', 'ID', 'pt');

textResources.create('LanguageDetails.field.createdAt', 'Created At');
textResources.create('LanguageDetails.field.createdAt', 'Criado Em', 'pt');

textResources.create('LanguageDetails.field.updatedAt', 'Updated At');
textResources.create('LanguageDetails.field.updatedAt', 'Atualizado Em', 'pt');

textResources.create('LanguageDetails.field.defaultName', 'Default Name');
textResources.create('LanguageDetails.field.defaultName', 'Nome Padrão', 'pt');

textResources.create('LanguageDetails.field.localeName', 'Locale Name');
textResources.create('LanguageDetails.field.localeName', 'Nome Nativo', 'pt');

textResources.create('LanguageDetails.field.localeCode', 'Locale Code');
textResources.create('LanguageDetails.field.localeCode', 'Código do Idioma', 'pt');

textResources.create('LanguageDetails.field.proficiency', 'Level');
textResources.create('LanguageDetails.field.proficiency', 'Nível', 'pt');

textResources.create('LanguageDetails.field.proficiency.value', (value: string) => displayProficiency(value)); 
textResources.create('LanguageDetails.field.proficiency.value', (value: string) => displayProficiency(value, 'pt'), 'pt'); 

textResources.create('LanguageDetails.detailsHeader.title', 'Language Details');
textResources.create('LanguageDetails.detailsHeader.title', 'Detalhes do Idioma', 'pt');

textResources.create('LanguageDetails.levelsHeader.title', 'Proficiency Levels');
textResources.create('LanguageDetails.levelsHeader.title', 'Níveis de Proficiência', 'pt');

textResources.create('LanguageDetails.deleteConfirm', 'Are you sure you want to delete this language? This action cannot be undone.');
textResources.create('LanguageDetails.deleteConfirm', 'Tem certeza de que deseja excluir este idioma? Esta ação não pode ser desfeita.', 'pt');

export default textResources;
