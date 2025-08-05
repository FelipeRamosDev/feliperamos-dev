import { TextResources } from '@/services';

const textResources = new TextResources();

textResources.create('EditUserAccountForm.submitLabel', 'Save Changes'); 
textResources.create('EditUserAccountForm.submitLabel', 'Salvar Alterações', 'pt');

textResources.create('EditUserAccountForm.email.label', 'E-mail');
textResources.create('EditUserAccountForm.email.label', 'E-mail', 'pt');
textResources.create('EditUserAccountForm.email.placeholder', 'Enter your email...');
textResources.create('EditUserAccountForm.email.placeholder', 'Digite seu e-mail...', 'pt');

textResources.create('EditUserAccountForm.phone.label', 'Phone Number');
textResources.create('EditUserAccountForm.phone.label', 'Número de Telefone', 'pt');
textResources.create('EditUserAccountForm.phone.placeholder', 'Enter your phone number...');
textResources.create('EditUserAccountForm.phone.placeholder', 'Digite seu número de telefone...', 'pt');

export default textResources;
