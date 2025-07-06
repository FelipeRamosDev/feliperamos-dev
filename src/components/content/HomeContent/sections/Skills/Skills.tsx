'use client';

import { SkillBadge } from "@/components/badges"
import { Container } from "@/components/common"
import { useTextResources } from "@/services/TextResources/TextResourcesProvider"
import skillsText, { SKILLS } from "./Skills.text";

export default function Skills() {
   const { textResources } = useTextResources(skillsText);

   return <section className="Skills">
      <Container padding="xl">
         <h2 className="section-title">{textResources.getText('Skills.title')}</h2>
         <p className="section-description">{textResources.getText('Skills.description')}</p>

         <div className="skills-grid">
            {SKILLS.map((skill, index) => (
               <SkillBadge
                  key={index}
                  value={skill}
                  className="skill-badge"
               />
            ))}
         </div>
      </Container>
   </section>
}
