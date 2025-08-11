import { dataViewString, dateDiffYearMonth } from '@/helpers/date.helpers';
import { TextResources } from '@/services';

const textResources = new TextResources();

// CVPDFHeader
textResources.create('CVPDFHeader.header.summaryTitle', 'Summary');
textResources.create('CVPDFHeader.header.summaryTitle', 'Resumo', 'pt');

textResources.create('CVPDFHeader.header.contactTitle', 'Contact Information');
textResources.create('CVPDFHeader.header.contactTitle', 'Informações de Contato', 'pt');

textResources.create('CVPDFHeader.header.github', 'GitHub Profile');
textResources.create('CVPDFHeader.header.github', 'Perfil do GitHub', 'pt');

textResources.create('CVPDFHeader.header.linkedin', 'LinkedIn Profile');
textResources.create('CVPDFHeader.header.linkedin', 'Perfil do LinkedIn', 'pt');

textResources.create('CVPDFHeader.header.website', 'Website');
textResources.create('CVPDFHeader.header.website', 'Website', 'pt');

textResources.create('CVPDFHeader.header.whatsapp', 'WhatsApp');
textResources.create('CVPDFHeader.header.whatsapp', 'WhatsApp', 'pt');

textResources.create('CVPDFHeader.header.experienceTime', (time: string) => `+${Math.round(Number(time))} years of Experience`);
textResources.create('CVPDFHeader.header.experienceTime', (time: string) => `+${Math.round(Number(time))} anos de Experiência`, 'pt');

// CVPDFExperiences
textResources.create('CVPDFExperiences.experiences.title', 'Work Experience');
textResources.create('CVPDFExperiences.experiences.title', 'Experiência de Trabalho', 'pt');

textResources.create('CVPDFExperiences.experienceHeader.title', (position: string, company: string) => `${position} at ${company}`);
textResources.create('CVPDFExperiences.experienceHeader.title', (position: string, company: string) => `${position} na ${company}`, 'pt');

textResources.create('CVPDFExperiences.experienceHeader.experienceTime', (start_date: string, end_date: string) => {
   const dateType = 'abbMonth-fullYear';
   const startDate = dataViewString(new Date(start_date), dateType, 'en');
   const endDate = dataViewString(new Date(end_date), dateType, 'en');

   return `${startDate} to ${endDate}`;
});
textResources.create('CVPDFExperiences.experienceHeader.experienceTime', (start_date: string, end_date: string) => {
   const dateType = 'abbMonth-fullYear';
   const startDate = dataViewString(new Date(start_date), dateType, 'pt');
   const endDate = dataViewString(new Date(end_date), dateType, 'pt');

   return `${startDate} a ${endDate}`;
}, 'pt');

textResources.create('CVPDFExperiences.experienceHeader.timeDifference', (startDate: string, endDate: string) => {
   const { year, month } = dateDiffYearMonth(startDate, endDate);
   const yearText = (year > 0) ? `${year} year${year > 1 ? 's' : ''}` : '';
   const monthText = (month > 0) ? `${month} month${month > 1 ? 's' : ''}` : '';

   return `(${[yearText, monthText].filter(Boolean).join(' and ')})`;
});
textResources.create('CVPDFExperiences.experienceHeader.timeDifference', (startDate: string, endDate: string) => {
   const { year, month } = dateDiffYearMonth(startDate, endDate);
   const yearText = (year > 0) ? `${year} ano${year > 1 ? 's' : ''}` : '';
   const monthText = (month > 0) ? `${month} mês${month > 1 ? 'es' : ''}` : '';

   return `(${[yearText, monthText].filter(Boolean).join(' e ')})`;
}, 'pt');

textResources.create('CVPDFExperiences.experiences.subtitle', 'Check below a summary of my work experience.');
textResources.create('CVPDFExperiences.experiences.subtitle', 'Confira abaixo um resumo da minha experiência profissional.', 'pt');

textResources.create('CVPDFExperiences.experiences.summary', 'Summary');
textResources.create('CVPDFExperiences.experiences.summary', 'Resumo', 'pt');

textResources.create('CVPDFExperiences.experiences.description', 'Description');
textResources.create('CVPDFExperiences.experiences.description', 'Descrição', 'pt');

textResources.create('CVPDFExperiences.experiences.responsibilities', 'Responsibilities');
textResources.create('CVPDFExperiences.experiences.responsibilities', 'Responsabilidades', 'pt');

textResources.create('CVPDFExperiences.experienceItem.skillsTitle', 'Skills used in this work experience');
textResources.create('CVPDFExperiences.experienceItem.skillsTitle', 'Habilidades utilizadas nesta experiência de trabalho', 'pt');

// CVPDFSkills
textResources.create('CVPDFSkills.title', 'Skills');
textResources.create('CVPDFSkills.title', 'Habilidades', 'pt');

textResources.create('CVPDFSkills.subtitle', 'Programming Languages, Frameworks, Development Tools, Libraries, and others.');
textResources.create('CVPDFSkills.subtitle', 'Linguagens de Programação, Frameworks, Ferramentas de Desenvolvimento, Bibliotecas e outros', 'pt');

textResources.create('CVPDFSkills.skills.languages', 'Programming Languages');
textResources.create('CVPDFSkills.skills.languages', 'Linguagens de Programação', 'pt');

textResources.create('CVPDFSkills.skills.frameworks', 'Frameworks');
textResources.create('CVPDFSkills.skills.frameworks', 'Frameworks', 'pt');

textResources.create('CVPDFSkills.skills.libraries', 'Libraries');
textResources.create('CVPDFSkills.skills.libraries', 'Bibliotecas', 'pt');

textResources.create('CVPDFSkills.skills.databases', 'Databases');
textResources.create('CVPDFSkills.skills.databases', 'Bancos de Dados', 'pt');

textResources.create('CVPDFSkills.skills.dev-tools', 'Development Tools');
textResources.create('CVPDFSkills.skills.dev-tools', 'Ferramentas de Desenvolvimento', 'pt');

textResources.create('CVPDFSkills.skills.cloud', 'Cloud Services');
textResources.create('CVPDFSkills.skills.cloud', 'Serviços de Nuvem', 'pt');

textResources.create('CVPDFSkills.skills.others', 'Others');
textResources.create('CVPDFSkills.skills.others', 'Outros', 'pt');

// CVPDFEducation
textResources.create('CVPDFEducation.title', 'Education');
textResources.create('CVPDFEducation.title', 'Educação', 'pt');

// CVPDFLanguages
textResources.create('CVPDFLanguages.title', 'Languages');
textResources.create('CVPDFLanguages.title', 'Idiomas', 'pt');

textResources.create('CVPDFLanguages.proficiency', 'Proficiency:');
textResources.create('CVPDFLanguages.proficiency', 'Proficiência:', 'pt');

export default textResources;
