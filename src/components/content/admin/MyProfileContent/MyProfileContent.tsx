'use client';

import { Card, Container } from "@/components/common";
import { CardProps } from "@/components/common/Card/Card.types";
import { PageHeader } from "@/components/headers";
import WidgetHeader from "@/components/headers/WidgetHeader/WidgetHeader";
import { ContentSidebar } from "@/components/layout";
import DataContainer from "@/components/layout/DataContainer/DataContainer";
import { useAuth } from "@/services";
import { Camera, GitHub, LinkedIn, WhatsApp } from "@mui/icons-material";
import Link from "next/link";
import { Fragment } from "react";

export default function MyProfileContent() {
   const cardProps: CardProps = { padding: 'm' };
   const { user } = useAuth();
   const whatappParsed = user?.whatsapp_number?.replace(/[^0-9]/g, '');

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
                     <WidgetHeader title="Account Data" />
                     
                     <DataContainer>
                        <label>E-mail:</label>
                        <Link href={`mailto:${user?.email}`}>{user?.email}</Link>
                     </DataContainer>
                     <DataContainer>
                        <label>Phone Number:</label>
                        <Link href={`tel:${user?.phone}`}>{user?.phone}</Link>
                     </DataContainer>
                  </Card>

                  <Card {...cardProps}>
                     <WidgetHeader title="Personal Data" />

                     <DataContainer>
                        <label>First Name:</label>
                        <p>{user?.first_name}</p>
                     </DataContainer>
                     <DataContainer>
                        <label>Last Name:</label>
                        <p>{user?.last_name}</p>
                     </DataContainer>
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
                     <WidgetHeader title="Social Links" />

                     <DataContainer>
                        <label><GitHub /></label>
                        <Link href={user?.github_url || ''}>{user?.github_url}</Link>
                     </DataContainer>
                     <DataContainer>
                        <label><LinkedIn /></label>
                        <Link href={user?.linkedin_url || ''}>{user?.linkedin_url}</Link>
                     </DataContainer>
                     <DataContainer>
                        <label><WhatsApp /></label>
                        <Link href={`https://wa.me/${whatappParsed}`}>{user?.whatsapp_number}</Link>
                     </DataContainer>
                     <DataContainer>
                        <label><Camera /></label>
                        <Link href={user?.portfolio_url || ''}>{user?.portfolio_url}</Link>
                     </DataContainer>
                  </Card>
               </Fragment>
            </ContentSidebar>
         </Container>
      </div>
   );
}
