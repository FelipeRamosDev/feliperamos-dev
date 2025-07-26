import { TextResources } from '@/services';

const textResources = new TextResources();

textResources.create('CVsWidget.title', 'My CVs');
textResources.create('CVsWidget.title', 'Meus CVs', 'pt');

textResources.create('CVsWidget.noCV', 'No CVs available');
textResources.create('CVsWidget.noCV', 'Nenhum CV disponível', 'pt');

export default textResources;
