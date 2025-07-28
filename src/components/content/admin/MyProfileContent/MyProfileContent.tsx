'use client';

import Link from 'next/link';
import { Fragment, useState } from 'react';
import { useAuth } from '@/services';
import { RoundButton } from '@/components/buttons';
import { Card, Container, DateView } from '@/components/common';
import { PageHeader, WidgetHeader } from '@/components/headers';
import { ContentSidebar, DataContainer } from '@/components/layout';
import { CardProps } from '@/components/common/Card/Card.types';
import { Camera, Edit, GitHub, LinkedIn, WhatsApp } from '@mui/icons-material';
import EditUserAccountForm from '@/components/forms/users/EditUserAccountForm/EditUserAccountForm';
import EditUserPersonalForm from '@/components/forms/users/EditUserPersonalForm/EditUserPersonalForm';
import EditUserSocialForm from '@/components/forms/users/EditUserSocialForm/EditUserSocialForm';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './MyProfileContent.text'

export default function MyProfileContent() {
   const [editModeAccount, setEditModeAccount] = useState<boolean>(false);
   const [editModePersonal, setEditModePersonal] = useState<boolean>(false);
   const [editModeSocial, setEditModeSocial] = useState<boolean>(false);
   const { textResources } = useTextResources(texts);
   const { user } = useAuth();

   const whatappParsed = user?.whatsapp_number?.replace(/[^0-9]/g, '');
   const cardProps: CardProps = { padding: 'm' };

   return (
      <div className="MyProfileContent">
         <PageHeader
            title={textResources.getText('MyProfileContent.pageTitle')}
            description={textResources.getText('MyProfileContent.pageDescription')}
         />

         <Container>
            <ContentSidebar>
               <Fragment>
                  <Card {...cardProps}>
                     <WidgetHeader
                        title={textResources.getText('MyProfileContent.widgetAccount.title')}
                     >
                        {!editModeAccount && (
                           <RoundButton
                              title={textResources.getText('MyProfileContent.button.editAccountData')}
                              onClick={() => setEditModeAccount(true)}
                           >
                              <Edit />
                           </RoundButton>
                        )}
                     </WidgetHeader>

                     {editModeAccount && <EditUserAccountForm />}
                     {!editModeAccount && <Fragment>
                        <DataContainer>
                           <label>{textResources.getText('MyProfileContent.fields.email')}</label>
                           <Link href={`mailto:${user?.email}`}>{user?.email}</Link>
                        </DataContainer>
                        <DataContainer>
                           <label>{textResources.getText('MyProfileContent.fields.phoneNumber')}</label>
                           <Link href={`tel:${user?.phone}`}>{user?.phone}</Link>
                        </DataContainer>
                     </Fragment>}
                  </Card>

                  <Card {...cardProps}>
                     <WidgetHeader
                        title={textResources.getText('MyProfileContent.widgetPersonal.title')}
                     >
                        {!editModePersonal && (
                           <RoundButton
                              title={textResources.getText('MyProfileContent.button.editPersonalData')}
                              onClick={() => setEditModePersonal(true)}
                           >
                              <Edit />
                           </RoundButton>
                        )}
                     </WidgetHeader>

                     {editModePersonal && <EditUserPersonalForm />}
                     {!editModePersonal && <Fragment>
                        <DataContainer>
                           <label>{textResources.getText('MyProfileContent.fields.firstName')}</label>
                           <p>{user?.first_name}</p>
                        </DataContainer>
                        <DataContainer>
                           <label>{textResources.getText('MyProfileContent.fields.lastName')}</label>
                           <p>{user?.last_name}</p>
                        </DataContainer>
                        <DataContainer>
                           <label>{textResources.getText('MyProfileContent.fields.birthDate')}</label>
                           <DateView type="locale-standard" date={user?.birth_date} />
                        </DataContainer>
                        <DataContainer>
                           <label>{textResources.getText('MyProfileContent.fields.city')}</label>
                           <p>{user?.city}</p>
                        </DataContainer>
                        <DataContainer>
                           <label>{textResources.getText('MyProfileContent.fields.state')}</label>
                           <p>{user?.state}</p>
                        </DataContainer>
                        <DataContainer>
                           <label>{textResources.getText('MyProfileContent.fields.country')}</label>
                           <p>{user?.country}</p>
                        </DataContainer>
                     </Fragment>}
                  </Card>
               </Fragment>

               <Fragment>
                  <Card {...cardProps}>
                     <DataContainer vertical>
                        <label>{textResources.getText('MyProfileContent.fields.id')}</label>
                        <p>{user?.id}</p>
                     </DataContainer>
                  </Card>

                  <Card {...cardProps}>
                     <WidgetHeader
                        title={textResources.getText('MyProfileContent.widgetSocial.title')}
                     >
                        {!editModeSocial && (
                           <RoundButton
                              title={textResources.getText('MyProfileContent.button.editSocialLinks')}
                              onClick={() => setEditModeSocial(true)}
                           >
                              <Edit />
                           </RoundButton>
                        )}
                     </WidgetHeader>

                     {editModeSocial && <EditUserSocialForm />}
                     {!editModeSocial && <Fragment>
                        <DataContainer>
                           <label><GitHub /></label>
                           <Link target="_blank" href={user?.github_url || ''}>{user?.github_url}</Link>
                        </DataContainer>
                        <DataContainer>
                           <label><LinkedIn /></label>
                           <Link target="_blank" href={user?.linkedin_url || ''}>{user?.linkedin_url}</Link>
                        </DataContainer>
                        <DataContainer>
                           <label><WhatsApp /></label>
                           <Link target="_blank" href={`https://wa.me/${whatappParsed}`}>{user?.whatsapp_number}</Link>
                        </DataContainer>
                        <DataContainer>
                           <label><Camera /></label>
                           <Link target="_blank" href={user?.portfolio_url || ''}>{user?.portfolio_url}</Link>
                        </DataContainer>
                     </Fragment>}
                  </Card>
               </Fragment>
            </ContentSidebar>
         </Container>
      </div>
   );
}
