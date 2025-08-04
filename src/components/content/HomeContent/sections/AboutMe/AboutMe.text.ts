import { dateDifference } from "@/helpers/date.helpers";
import { TextResources } from "@/services";
import dayjs from "dayjs";

const textResources = new TextResources();

textResources.create('AboutMe.title', 'Summary');
textResources.create('AboutMe.title', 'Resumo', 'pt');

textResources.create('AboutMe.description', 'This is the about me section.');
textResources.create('AboutMe.description', 'Esta é a seção sobre mim.', 'pt');

textResources.create('AboutMe.content', 'Here you can write about your experiences and skills.');
textResources.create('AboutMe.content', 'Aqui você pode escrever sobre suas experiências e habilidades.', 'pt');

textResources.create('AboutMe.birthDate', (date) => dayjs(date).format('MMMM DD YYYY'));
textResources.create('AboutMe.birthDate', (date) => dayjs(date).format('DD MMMM YYYY'), 'pt');

textResources.create('AboutMe.experienceTime', (years) => `${years} years of experience`);
textResources.create('AboutMe.experienceTime', (years) => `${years} anos de experiência`, 'pt');

export default textResources;
