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

export default function MyProfileContent() {
   const [editModeAccount, setEditModeAccount] = useState<boolean>(false);
   const [editModePersonal, setEditModePersonal] = useState<boolean>(false);
   const [editModeSocial, setEditModeSocial] = useState<boolean>(false);
   const { user } = useAuth();

   const whatappParsed = user?.whatsapp_number?.replace(/[^0-9]/g, '');
   const cardProps: CardProps = { padding: 'm' };

   return (
      <div className="MyProfileContent">
         <PageHeader
            title="My Profile"
            description="Manage your profile information and settings."
         />

         <Container>
            <ContentSidebar>
               <Fragment>
                  <Card {...cardProps}>
                     <WidgetHeader title="Account Data">
                        {!editModeAccount && (
                           <RoundButton title="Edit Account Data" onClick={() => setEditModeAccount(true)}>
                              <Edit />
                           </RoundButton>
                        )}
                     </WidgetHeader>

                     {editModeAccount && <EditUserAccountForm />}
                     {!editModeAccount && <Fragment>
                        <DataContainer>
                           <label>E-mail:</label>
                           <Link href={`mailto:${user?.email}`}>{user?.email}</Link>
                        </DataContainer>
                        <DataContainer>
                           <label>Phone Number:</label>
                           <Link href={`tel:${user?.phone}`}>{user?.phone}</Link>
                        </DataContainer>
                     </Fragment>}
                  </Card>

                  <Card {...cardProps}>
                     <WidgetHeader title="Personal Data">
                        {!editModePersonal && (
                           <RoundButton title="Edit Personal Data" onClick={() => setEditModePersonal(true)}>
                              <Edit />
                           </RoundButton>
                        )}
                     </WidgetHeader>

                     {editModePersonal && <EditUserPersonalForm />}
                     {!editModePersonal && <Fragment>
                        <DataContainer>
                           <label>First Name:</label>
                           <p>{user?.first_name}</p>
                        </DataContainer>
                        <DataContainer>
                           <label>Last Name:</label>
                           <p>{user?.last_name}</p>
                        </DataContainer>
                        <DataContainer>
                           <label>Birth Date:</label>
                           <DateView type="locale-standard" date={user?.birth_date} />
                        </DataContainer>
                        <DataContainer>
                           <label>City:</label>
                           <p>{user?.city}</p>
                        </DataContainer>
                        <DataContainer>
                           <label>State:</label>
                           <p>{user?.state}</p>
                        </DataContainer>
                        <DataContainer>
                           <label>Country:</label>
                           <p>{user?.country}</p>
                        </DataContainer>
                     </Fragment>}
                  </Card>
               </Fragment>

               <Fragment>
                  <Card {...cardProps}>
                     <DataContainer vertical>
                        <label>User ID:</label>
                        <p>{user?.id}</p>
                     </DataContainer>
                  </Card>

                  <Card {...cardProps}>
                     <WidgetHeader title="Social Links">
                        {!editModeSocial && (
                           <RoundButton title="Edit Social Links" onClick={() => setEditModeSocial(true)}>
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
