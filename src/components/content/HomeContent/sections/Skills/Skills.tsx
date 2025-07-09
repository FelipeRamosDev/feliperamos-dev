'use client';

import { SkillBadge } from "@/components/badges"
import { Container } from "@/components/common"
import { useTextResources } from "@/services/TextResources/TextResourcesProvider"
import skillsText from "./Skills.text";
import experiencesText from "../Experience/Experience.text";
import companies from "../Experience/companies";

export default function Skills() {
   const { textResources } = useTextResources(skillsText.merge(experiencesText));
   const companiesList = companies(textResources) || [];
   const skills = companiesList.flatMap(company => company.skills || []);
   
   const skillMap = new Set<string>();
   skills.forEach(skill => {
      if (skill && typeof skill === 'string') {
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
               />
            ))}
         </div>
      </Container>
   </section>
}
