export interface CustomCVWidgetProps {
   className?: string | string[];
}

export interface GenerateSummaryParams {
   jobURL?: string;
   jobTitle?: string;
   jobCompany?: string;
   jobDescription?: string;
   customPrompt?: string;
   currentInput?: string;
}
