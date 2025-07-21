import { TextResources } from '@/services';

const textResources = new TextResources();

textResources.create('EditSkillForm.name', 'Skill Name');
textResources.create('EditSkillForm.name', 'Nome da Habilidade', 'pt');

textResources.create('EditSkillForm.category', 'Category');
textResources.create('EditSkillForm.category', 'Categoria', 'pt');

textResources.create('EditSkillForm.level', 'Level');
textResources.create('EditSkillForm.level', 'Nível', 'pt');

export default textResources;
