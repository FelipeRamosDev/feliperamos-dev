import { TextResources } from '@/services';

const experienceText = new TextResources();

experienceText.create('Experience.title', 'Work Experience');
experienceText.create('Experience.title', 'Experiência Profissional', 'pt');

experienceText.create('Experience.description', 'Check below my work experience. The companies I worked and a summary of my responsibilities for each one.');
experienceText.create('Experience.description', 'Confira abaixo minha experiência profissional. As empresas para as quais trabalhei e um resumo das minhas responsabilidades em cada uma estão abaixo.', 'pt');

export default experienceText;
