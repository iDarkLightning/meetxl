import { Input } from "@meetxl/ui";
import { Trash } from "lucide-react";
import { useState } from "react";

export const InputDocs: React.FC = () => {
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        <div>
          <p>Disabled?</p>
          <input
            type="checkbox"
            onChange={(e) => setDisabled(e.target.checked)}
          />
        </div>
      </div>
      <p>Sizes</p>
      <div className="flex flex-col gap-2">
        <Input
          size="sm"
          type="text"
          placeholder="hi there"
          disabled={disabled}
        />
        <Input
          size="md"
          type="text"
          placeholder="hi there"
          disabled={disabled}
        />
      </div>
      <p>Elements</p>
      <div className="flex flex-col gap-2">
        <Input
          leftElement={<Trash size="1rem" />}
          type="text"
          placeholder="hi there"
          disabled={disabled}
        />
        <Input
          rightElement={<Trash size="1rem" />}
          type="text"
          placeholder="hi there"
          disabled={disabled}
        />
        <Input
          leftElement={<Trash size="1rem" />}
          rightElement={<Trash size="1rem" />}
          type="text"
          placeholder="hi there"
          disabled={disabled}
        />
      </div>
    </div>
  );
};
