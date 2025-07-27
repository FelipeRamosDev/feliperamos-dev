import { Card } from "@/components/common";
import { CVDetailsSubcomponentProps } from "../CVDetailsContent.types";
import WidgetHeader from "@/components/headers/WidgetHeader/WidgetHeader";
import DataContainer from "@/components/layout/DataContainer/DataContainer";
import { useCVDetails } from "../CVDetailsContext";
import { useState } from "react";

export default function CVDetailsInfos({ cardProps }: CVDetailsSubcomponentProps): React.ReactElement {
   const [ editMode, setEditMode ] = useState<boolean>(false);
   const cv = useCVDetails();

   return (
      <Card className="CVDetailsInfos" {...cardProps}>
         <WidgetHeader title="Curriculum Infos" />

         <DataContainer>
            <label>Title:</label>
            <p>{cv.title}</p>
         </DataContainer>
         <DataContainer>
            <label>Ref Note:</label>
            <p>{cv.notes}</p>
         </DataContainer>
      </Card>
   );
}
