import { Input } from "@meetxl/ui";
import { Trash } from "lucide-react";

export const InputDocs: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <p>Sizes</p>
      <div className="flex flex-col gap-2">
        <Input size="sm" type="text" placeholder="hi there" />
        <Input size="md" type="text" placeholder="hi there" />
      </div>
      <p>Elements</p>
      <div className="flex flex-col gap-2">
        <Input
          leftElement={<Trash size="1rem" />}
          type="text"
          placeholder="hi there"
        />
        <Input
          rightElement={<Trash size="1rem" />}
          type="text"
          placeholder="hi there"
        />
        <Input
          leftElement={<Trash size="1rem" />}
          rightElement={<Trash size="1rem" />}
          type="text"
          placeholder="hi there"
        />
      </div>
    </div>
  );
};
