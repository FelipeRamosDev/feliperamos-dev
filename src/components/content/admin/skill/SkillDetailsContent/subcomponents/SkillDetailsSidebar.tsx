import { Card } from "@/components/common";
import DataContainer from "@/components/layout/DataContainer/DataContainer";
import { Fragment } from "react";
import { useSkillDetails } from "../SkillDetailsContext";

export default function SkillDetailsSidebar(): React.ReactElement {
   const skill = useSkillDetails();

   return (
      <Fragment>
         <Card padding="l">
            <DataContainer>
               <label>ID:</label>
               <span>{skill.id}</span>
            </DataContainer>
         </Card>
      </Fragment>
   );
}
