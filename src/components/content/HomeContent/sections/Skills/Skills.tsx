'use client';

import { SkillBadge } from "@/components/badges"
import { Container } from "@/components/common"
import { useTextResources } from "@/services/TextResources/TextResourcesProvider"
import skillsText from "./Skills.text";
import experiencesText from "../Experience/Experience.text";
import { SkillsProps } from "./Skills.types";
import companies from "../Experience/companies";

export default function Skills({ skills: skillsData = [] }: SkillsProps) {
   const { textResources } = useTextResources(skillsText.merge(experiencesText));

   // If skillsData is provided via props, use it directly
   if (skillsData && skillsData.length > 0) {
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
                     data-testid="skill-badge"
                     data-value={skill.name}
                  />
               ))}
            </div>
         </Container>
      </section>
   }

   // Fallback: Extract skills from companies data
   const companiesList = companies(textResources) || [];
   const skills = companiesList.flatMap(company => company.skills || []);

   // Filter out null/undefined/non-string and deduplicate
   const skillMap = new Set<string>();
   skills.forEach(skill => {
      if (typeof skill === 'string' && skill) {
         skillMap.add(skill);
      }
   });
   const uniqueSkills = Array.from(skillMap);

   return <section className="Skills">
      <Container padding="xl">
         <h2 className="section-title">{textResources.getText('Skills.title')}</h2>
         <p className="section-description">{textResources.getText('Skills.description')}</p>

         <div className="skills-grid">
            {uniqueSkills.map((skill) => (
               <SkillBadge
                  key={skill}
                  value={skill}
                  className="skill-badge"
                  data-testid="skill-badge"
                  data-value={skill}
               />
            ))}
         </div>
      </Container>
   </section>
}
