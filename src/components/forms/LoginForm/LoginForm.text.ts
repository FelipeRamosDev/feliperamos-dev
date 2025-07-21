import { TextResources } from '@/services';

const textResources = new TextResources();

textResources.create('LoginForm.email', 'Email');
textResources.create('LoginForm.email', 'Email', 'pt');
textResources.create('LoginForm.placeholder.email', 'Enter your email');
textResources.create('LoginForm.placeholder.email', 'Digite seu email', 'pt');

textResources.create('LoginForm.password', 'Password');
textResources.create('LoginForm.password', 'Senha', 'pt');
textResources.create('LoginForm.placeholder.password', 'Enter your password');
textResources.create('LoginForm.placeholder.password', 'Digite sua senha', 'pt');

textResources.create('LoginForm.submit', 'Login');
textResources.create('LoginForm.submit', 'Entrar', 'pt');

export default textResources;
