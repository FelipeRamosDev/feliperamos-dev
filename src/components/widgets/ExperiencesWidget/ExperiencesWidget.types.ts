import WidgetCompany from "../CompaniesWidget/CompaniesWidget.types";

export interface WidgetExperienceObject {
   id: string;
   title: string;
   position: string;
   type: 'internship' | 'freelance' | 'contract' | 'temporary' | 'full_time' | 'part_time' | 'other';
   start_date: string;
   end_date: string;
   summary: string;
   company?: WidgetCompany
}
