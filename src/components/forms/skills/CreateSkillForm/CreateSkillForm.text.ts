import { TextResources } from '@/services';

const textResources = new TextResources();

textResources.create('CreateSkillForm.name.label', 'Skill Name');
textResources.create('CreateSkillForm.name.label', 'Nome da Habilidade', 'pt');
textResources.create('CreateSkillForm.name.placeholder', 'Enter skill name');
textResources.create('CreateSkillForm.name.placeholder', 'Insira o nome da habilidade', 'pt');

textResources.create('CreateSkillForm.category.label', 'Skill Category');
textResources.create('CreateSkillForm.category.label', 'Categoria da Habilidade', 'pt');
textResources.create('CreateSkillForm.category.placeholder', 'Select a skill category');
textResources.create('CreateSkillForm.category.placeholder', 'Selecione uma categoria de habilidade', 'pt');

textResources.create('CreateSkillForm.journey.label', 'Skill Journey');
textResources.create('CreateSkillForm.journey.label', 'Jornada da Habilidade', 'pt');
textResources.create('CreateSkillForm.journey.placeholder', 'Describe the skill journey');
textResources.create('CreateSkillForm.journey.placeholder', 'Descreva a jornada da habilidade', 'pt');

textResources.create('CreateSkillForm.category.placeholder', 'Select a skill category');
textResources.create('CreateSkillForm.category.placeholder', 'Selecione uma categoria de habilidade', 'pt');

textResources.create('CreateSkillForm.level.label', 'Skill Level');
textResources.create('CreateSkillForm.level.label', 'Nível da Habilidade', 'pt');
textResources.create('CreateSkillForm.level.placeholder', 'Enter skill level (1-10)');
textResources.create('CreateSkillForm.level.placeholder', 'Insira o nível da habilidade (1-10)', 'pt');

textResources.create('CreateSkillForm.submit.label', 'Create Skill');
textResources.create('CreateSkillForm.submit.label', 'Criar Habilidade', 'pt');

export default textResources;

