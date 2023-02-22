import { Divider } from "@meetxl/ui";

export const DividerDocs: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <h1>Hi there</h1>
      <Divider orientation="horizontal" />
      <div className="h-96 w-16">
        <p className="ml-2">Lorem</p>
        <Divider orientation="vertical" />
      </div>
    </div>
  );
};
