import { Checkbox, Label, Switch } from "@meetxl/ui";
import { useState } from "react";

export const SwitchDocs: React.FC = () => {
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="flex flex-row items-center gap-2">
          <Label htmlFor="disabled">Disabled</Label>
          <Checkbox
            name="disabled"
            onCheckedChange={(state) => setDisabled(state.valueOf() as boolean)}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Switch variant="primary" disabled={disabled} />
        <Switch variant="secondary" disabled={disabled} />
      </div>
    </div>
  );
};
