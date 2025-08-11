import { TextResources } from '@/services';

const textResources = new TextResources();

textResources.create('CreateLanguageForm.default_name.label', 'Default Name');
textResources.create('CreateLanguageForm.default_name.label', 'Nome Padrão', 'pt');
textResources.create('CreateLanguageForm.default_name.placeholder', 'Enter the default name. (Eg.: Portuguese)');
textResources.create('CreateLanguageForm.default_name.placeholder', 'Insira o nome padrão. (Ex.: Portuguese)', 'pt');

textResources.create('CreateLanguageForm.locale_name.label', 'Locale Name');
textResources.create('CreateLanguageForm.locale_name.label', 'Nome Nativo', 'pt');
textResources.create('CreateLanguageForm.locale_name.placeholder', 'Enter the local name. (Eg.: Português)');
textResources.create('CreateLanguageForm.locale_name.placeholder', 'Insira o nome local. (Ex.: Português)', 'pt');

textResources.create('CreateLanguageForm.locale_code.label', 'Locale Code');
textResources.create('CreateLanguageForm.locale_code.label', 'Código Local', 'pt');
textResources.create('CreateLanguageForm.locale_code.placeholder', 'Enter the locale code. (Eg.: "en")');
textResources.create('CreateLanguageForm.locale_code.placeholder', 'Insira o código local. (Ex.: "pt")', 'pt');

textResources.create('CreateLanguageForm.proficiency.label', 'Proficiency Level');
textResources.create('CreateLanguageForm.proficiency.label', 'Nível de Proficiência', 'pt');

textResources.create('CreateLanguageForm.submit.label', 'Create Language');
textResources.create('CreateLanguageForm.submit.label', 'Criar Idioma', 'pt');

export default textResources;
