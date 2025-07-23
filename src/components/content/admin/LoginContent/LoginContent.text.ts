import { TextResources } from '@/services';

const textResources = new TextResources();

textResources.create('LoginContent.title', 'Login');
textResources.create('LoginContent.title', 'Login', 'pt');

textResources.create('LoginContent.subtitle', 'Enter your credentials to access the admin area.');
textResources.create('LoginContent.subtitle', 'Insira suas credenciais para acessar a área administrativa.', 'pt');

export default textResources;

