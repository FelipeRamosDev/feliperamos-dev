import { TextResources } from '@/services';

const skillsText = new TextResources();

skillsText.create('Skills.title', 'Main Skills');
skillsText.create('Skills.title', 'Principais Habilidades', 'pt-BR');

skillsText.create('Skills.description', 'Here are my skills and technologies I have experience with: Programming languages, Frameworks, Libraries, Tools, and more.');
skillsText.create('Skills.description', 'Confira abaixo minhas habilidades e tecnologias que tenho experiência: Linguagens de programação, Frameworks, Bibliotecas, Ferramentas e muito mais.', 'pt-BR');

export default skillsText;
