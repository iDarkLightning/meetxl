import { Checkbox, Input, Label, RadioGroup } from "@meetxl/ui";

export const LabelDocs: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" name="name" placeholder="Participant Name" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="action">Link Action</Label>
        <RadioGroup
          name="action"
          options={[
            { value: "INCREMENT", display: "Increment" },
            { value: "SET", display: "Set" },
            { value: "DECREMENT", display: "Decrement" },
          ]}
        />
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="private">Is the meeting Private?</Label>
        <Checkbox name="private" />
      </div>
    </div>
  );
};
