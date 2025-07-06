'use client';

import { SkillBadge } from "@/components/badges"
import { Container } from "@/components/common"
import { useTextResources } from "@/services/TextResources/TextResourcesProvider"
import skillsText from "./Skills.text";

export default function Skills() {
   const { textResources } = useTextResources(skillsText);

   return <section className="Skills">
      <Container padding="xl">
         <h2 className="section-title">{textResources.getText('Skills.title')}</h2>
         <p className="section-description">{textResources.getText('Skills.description')}</p>

         <div className="skills-grid">
            <SkillBadge value="JavaScript" />
            <SkillBadge value="TypeScript" />
            <SkillBadge value="Node JS" />
            <SkillBadge value="React JS" />
            <SkillBadge value="Next.js" />
            <SkillBadge value="Redux" />
            <SkillBadge value="React Testing Library" />
            <SkillBadge value="Jest" />
            <SkillBadge value="HTML5" />
            <SkillBadge value="CSS3" />
            <SkillBadge value="SCSS" />
            <SkillBadge value="Salesforce (SFCC)" />
            <SkillBadge value="Express" />
            <SkillBadge value="Socket.io" />
            <SkillBadge value="MongoDB" />
            <SkillBadge value="PostgreSQL" />
            <SkillBadge value="Firebase" />
            <SkillBadge value="Redis" />
            <SkillBadge value="Docker" />
            <SkillBadge value="Material UI" />
            <SkillBadge value="JSON Web Token (JWT)" />
            <SkillBadge value="JIRA" />
            <SkillBadge value="AGILE" />
         </div>
      </Container>
   </section>
}
