import { TextResources } from '@/services';

const textResources = new TextResources();

textResources.create('EditLevelsForm.reading_level', 'Reading');
textResources.create('EditLevelsForm.reading_level', 'Leitura', 'pt');

textResources.create('EditLevelsForm.writing_level', 'Writing');
textResources.create('EditLevelsForm.writing_level', 'Escrita', 'pt');

textResources.create('EditLevelsForm.speaking_level', 'Speaking');
textResources.create('EditLevelsForm.speaking_level', 'Fala', 'pt');

textResources.create('EditLevelsForm.listening_level', 'Listening');
textResources.create('EditLevelsForm.listening_level', 'Audição', 'pt');

export default textResources;
