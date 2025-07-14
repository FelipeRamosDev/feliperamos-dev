import { CreateSkillContent } from "@/components/content/admin/skill";
import { AdminPageBase } from "@/components/layout";

export default async function CreateSkillPage() {
   return (
      <AdminPageBase>
         <CreateSkillContent />
      </AdminPageBase>
   );
}
