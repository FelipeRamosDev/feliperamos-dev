import { TextResources } from '@/services';

const textResources = new TextResources();

textResources.create('CompaniesWidget.headerTitle', 'Companies');
textResources.create('CompaniesWidget.headerTitle', 'Empresas', 'pt');

textResources.create('CompaniesWidget.button.addCompany', 'Add Company');
textResources.create('CompaniesWidget.button.addCompany', 'Adicionar Empresa', 'pt');

textResources.create('CompaniesWidget.noDocuments', 'No companies found');
textResources.create('CompaniesWidget.noDocuments', 'Nenhuma empresa encontrada', 'pt');

textResources.create('CompaniesWidget.column.logo', 'Logo');
textResources.create('CompaniesWidget.column.logo', 'Logo', 'pt');

textResources.create('CompaniesWidget.column.company_name', 'Name');
textResources.create('CompaniesWidget.column.company_name', 'Nome', 'pt');

export default textResources;
