import { TextResources } from '@/services';

const textResources = new TextResources();

textResources.create('DashboardContent.pageHeader.title', 'Admin Dashboard');
textResources.create('DashboardContent.pageHeader.title', 'Painel de Administração', 'pt');

textResources.create('DashboardContent.pageHeader.description', 'This is the admin dashboard where you can manage the application settings and user data.');
textResources.create('DashboardContent.pageHeader.description', 'Este é o painel de administração onde você pode gerenciar as configurações do aplicativo e os dados do usuário.', 'pt');

export default textResources;

