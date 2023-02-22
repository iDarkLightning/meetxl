import { Checkbox, Input, Label } from "@meetxl/ui";

export const LabelDocs: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" name="name" placeholder="Participant Name" />
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="name">Is the meeting Private?</Label>
        <Checkbox name="name" />
      </div>
    </div>
  );
};
