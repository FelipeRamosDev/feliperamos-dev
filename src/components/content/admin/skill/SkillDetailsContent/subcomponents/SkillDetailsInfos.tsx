import { Card } from "@/components/common";
import EditSkillForm from "@/components/forms/EditSkillForm/EditSkillForm";
import WidgetHeader from "@/components/headers/WidgetHeader/WidgetHeader";
import DataContainer from "@/components/layout/DataContainer/DataContainer";
import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Fragment, useState } from "react";
import { useSkillDetails } from "../SkillDetailsContext";

export default function SkillInfos(): React.ReactElement {
   const [ editMode, setEditMode ] = useState<boolean>(false);
   const skill = useSkillDetails();

   return (
      <Card padding="l">
         <WidgetHeader title="Skill Information">
            <IconButton onClick={() => setEditMode(!editMode)} aria-label="Edit Skill">
               <Edit />
            </IconButton>
         </WidgetHeader>

         {editMode && <EditSkillForm />}
         {!editMode && <Fragment>
            <DataContainer>
               <label>Skill Name:</label>
               <span>{skill.name}</span>
            </DataContainer>
            <DataContainer>
               <label>Category:</label>
               <span>{skill.category}</span>
            </DataContainer>
            <DataContainer>
               <label>Level:</label>
               <span>{skill.level}</span>
            </DataContainer>
         </Fragment>}
      </Card>
   );
}
