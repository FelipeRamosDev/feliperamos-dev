import { Card } from "@/components/common";

export interface ErrorTileProps {
   error?: { message?: string } | null;
}

export default function ErrorTile({ error }: ErrorTileProps) {
   if (!error || !error.message) {
      return null;
   }

   return (
      <Card className="ErrorTile" elevation="m" radius="s" padding="s">
         <p className="error-message">{error.message}</p>
      </Card>
   );
}
