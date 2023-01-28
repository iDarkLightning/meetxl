import { Button, ButtonProps } from "@meetxl/ui";
import { useState } from "react";

type Variant = ButtonProps["variant"];

export const ButtonDocs: React.FC = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-2 p-4">
        <input type="checkbox" onChange={(e) => setLoading(e.target.checked)} />
        <Button variant="secondary" size="sm" isLoading={loading}>
          Create
        </Button>
        <Button variant="secondary" size="md" isLoading={loading}>
          Create
        </Button>
        <Button variant="secondary" size="lg" isLoading={loading}>
          Create
        </Button>
      </div>
      <div className="flex gap-2 p-4">
        <Button variant="primary" isLoading={loading}>
          Create
        </Button>
        <Button variant="secondary" isLoading={loading}>
          Create
        </Button>
        <Button variant="ghost" isLoading={loading}>
          Create
        </Button>
        <Button variant="danger" isLoading={loading}>
          Create
        </Button>
      </div>
    </div>
  );
};
