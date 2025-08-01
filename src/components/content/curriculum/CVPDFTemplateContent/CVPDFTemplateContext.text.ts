import { TextResources } from '@/services';

const textResources = new TextResources();

// CVPDFHeader
textResources.create('CVPDFHeader.header.github', 'GitHub Profile');
textResources.create('CVPDFHeader.header.github', 'Perfil do GitHub', 'pt');

textResources.create('CVPDFHeader.header.linkedin', 'LinkedIn Profile');
textResources.create('CVPDFHeader.header.linkedin', 'Perfil do LinkedIn', 'pt');

textResources.create('CVPDFHeader.header.website', 'Website');
textResources.create('CVPDFHeader.header.website', 'Website', 'pt');

textResources.create('CVPDFHeader.header.whatsapp', 'WhatsApp');
textResources.create('CVPDFHeader.header.whatsapp', 'WhatsApp', 'pt');

// CVPDFExperiences
textResources.create('CVPDFExperiences.experiences.title', 'Work Experience');
textResources.create('CVPDFExperiences.experiences.title', 'Experiência de Trabalho', 'pt');

textResources.create('CVPDFExperiences.experiences.subtitle', 'Check below a summary of my work experience.');
textResources.create('CVPDFExperiences.experiences.subtitle', 'Confira abaixo um resumo da minha experiência profissional.', 'pt');

textResources.create('CVPDFExperiences.experiences.summary', 'Summary');
textResources.create('CVPDFExperiences.experiences.summary', 'Resumo', 'pt');

textResources.create('CVPDFExperiences.experiences.description', 'Description');
textResources.create('CVPDFExperiences.experiences.description', 'Descrição', 'pt');

textResources.create('CVPDFExperiences.experiences.responsibilities', 'Responsibilities');
textResources.create('CVPDFExperiences.experiences.responsibilities', 'Responsabilidades', 'pt');

// CVPDFSkills
textResources.create('CVPDFSkills.title', 'Skills');
textResources.create('CVPDFSkills.title', 'Habilidades', 'pt');

textResources.create('CVPDFSkills.subtitle', 'Programming Languages, Frameworks, Development Tools, Libraries, and others.');
textResources.create('CVPDFSkills.subtitle', 'Linguagens de Programação, Frameworks, Ferramentas de Desenvolvimento, Bibliotecas e outros', 'pt');

export default textResources;
