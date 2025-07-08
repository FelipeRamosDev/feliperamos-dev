'use client';

import { SkillBadge } from "@/components/badges"
import { Container } from "@/components/common"
import { useTextResources } from "@/services/TextResources/TextResourcesProvider"
import skillsText from "./Skills.text";
import companies from "../Experience/companies";

export default function Skills() {
   const { textResources } = useTextResources(skillsText);
   const companiesList = companies(textResources);
   const skills = companiesList.flatMap(company => company.skills);
   
   const skillMap = new Map();
   skills.forEach(skill => {
      skillMap.set(skill, true);
   });

   const uniqueSkills = Array.from(skillMap.keys());
   return <section className="Skills">
      <Container padding="xl">
         <h2 className="section-title">{textResources.getText('Skills.title')}</h2>
         <p className="section-description">{textResources.getText('Skills.description')}</p>

         <div className="skills-grid">
            {uniqueSkills.map((skill, index) => (
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
