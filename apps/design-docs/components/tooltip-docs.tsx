import { Tooltip, TooltipTrigger, Button, TooltipContent } from "@meetxl/ui";
import { Plus } from "lucide-react";

export const TooltipDocs: React.FC = () => {
  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button prefixEl={<Plus className="h-4 w-4" />} />
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
