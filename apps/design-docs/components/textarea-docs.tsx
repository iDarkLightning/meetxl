import { Textarea } from "@meetxl/ui";

export const TextareaDocs: React.FC = () => {
  return (
    <div className="flex w-1/2 flex-col gap-4">
      <Textarea />
      <Textarea variant="outline" />
    </div>
  );
};
