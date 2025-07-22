'use client';

import { SkillBadge } from "@/components/badges"
import { Container } from "@/components/common"
import { useTextResources } from "@/services/TextResources/TextResourcesProvider"
import skillsText from "./Skills.text";
import experiencesText from "../Experience/Experience.text";
import { SkillsProps } from "./Skills.types";

export default function Skills({ skills: skillsData = [] }: SkillsProps) {
   const { textResources } = useTextResources(skillsText.merge(experiencesText));

   return <section className="Skills">
      <Container padding="xl">
         <h2 className="section-title">{textResources.getText('Skills.title')}</h2>
         <p className="section-description">{textResources.getText('Skills.description')}</p>

         <div className="skills-grid">
            {skillsData.map((skill) => (
               <SkillBadge
                  key={skill.id + skill.name + 'user-skill'}
                  value={skill.name}
                  className="skill-badge"
               />
            ))}
         </div>
      </Container>
   </section>
}
