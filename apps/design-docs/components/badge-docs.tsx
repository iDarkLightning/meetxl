import { Badge } from "@meetxl/ui";

export const BadgeDocs = () => {
  return (
    <div className="flex gap-2">
      <Badge>Hello</Badge>
      <Badge variant="secondary">Hello</Badge>
      <Badge variant="outline">Hello</Badge>
      <Badge variant="danger">Hello</Badge>
      <Badge variant="custom" color="#05998c">
        Hello
      </Badge>
    </div>
  );
};
