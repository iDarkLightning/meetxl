import { Toggle } from "@meetxl/ui";
import { Bold } from "lucide-react";
import React from "react";

export const ToggleDocs: React.FC = () => {
  return (
    <div className="flex gap-2">
      <Toggle size="sm" variant="outline">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle variant="outline">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle size="lg" variant="outline">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle>
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle size="lg">
        <Bold className="h-4 w-4" />
      </Toggle>
    </div>
  );
};
