import { TextResources } from '@/services';

const textResources = new TextResources();

textResources.create('TableBase.noDocumentsText', 'There are no documents to list!');
textResources.create('TableBase.noDocumentsText', 'Sem documentos para listar!', 'pt');

textResources.create('TableBase.seeMoreButton', 'See More');
textResources.create('TableBase.seeMoreButton', 'Ver mais', 'pt');

export default textResources;
