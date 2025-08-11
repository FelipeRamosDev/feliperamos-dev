import PageBase from "../PageBase/PageBase";
import { PageBaseProps } from "../PageBase/PageBase.types";

export default function CVPDFTemplate({ language, children }: PageBaseProps): React.ReactElement {
   return (
      <PageBase
         language={language}
         fullwidth
         hideFooter
         hideHeader
         data-language={String(language)}
      >
         {children}
      </PageBase>
   );
}
