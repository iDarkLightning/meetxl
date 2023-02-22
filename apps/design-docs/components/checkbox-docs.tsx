import { Checkbox, Label } from "@meetxl/ui";
import { useState } from "react";

export const CheckboxDocs: React.FC = () => {
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2 ">
        <div className="flex flex-row items-center gap-2">
          <Label htmlFor="disabled">Disabled?</Label>
          <Checkbox
            name="disabled"
            onCheckedChange={(state) => setDisabled(state.valueOf() as boolean)}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Checkbox disabled={disabled} variant="primary" />
        <Checkbox disabled={disabled} variant="secondary" />
      </div>
    </div>
  );
};
