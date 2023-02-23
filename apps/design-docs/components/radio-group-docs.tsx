import { Label, RadioGroup } from "@meetxl/ui";

export const RadioGroupDocs: React.FC = () => {
  return (
    <div className="flex items-end gap-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="number">Link Action</Label>
        <RadioGroup
          name="number"
          options={[
            { value: "INCREMENT", display: "Increment" },
            { value: "SET", display: "Set" },
            { value: "DECREMENT", display: "Decrement" },
          ]}
        />
      </div>
    </div>
  );
};
