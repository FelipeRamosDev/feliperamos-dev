import { TextResources } from "@/services";

const textResources = new TextResources();

textResources.create('LanguagesWidget.title', 'Languages');
textResources.create('LanguagesWidget.title', 'Linguagens', 'pt');

textResources.create('LanguagesWidget.addButton.title', 'Add Language');
textResources.create('LanguagesWidget.addButton.title', 'Adicionar Idioma', 'pt');

textResources.create('LanguagesWidget.noLanguages', 'No languages found');
textResources.create('LanguagesWidget.noLanguages', 'Nenhuma linguagem encontrada', 'pt');

textResources.create('LanguagesWidget.levels.reading', (level) => `Reading: ${level}`);
textResources.create('LanguagesWidget.levels.reading', (level) => `Leitura: ${level}`, 'pt');

textResources.create('LanguagesWidget.levels.writing', (level) => `Writing: ${level}`);
textResources.create('LanguagesWidget.levels.writing', (level) => `Escrita: ${level}`, 'pt');

textResources.create('LanguagesWidget.levels.speaking', (level) => `Speaking: ${level}`);
textResources.create('LanguagesWidget.levels.speaking', (level) => `Fala: ${level}`, 'pt');

textResources.create('LanguagesWidget.levels.listening', (level) => `Listening: ${level}`);
textResources.create('LanguagesWidget.levels.listening', (level) => `Audição: ${level}`, 'pt');

export default textResources;
