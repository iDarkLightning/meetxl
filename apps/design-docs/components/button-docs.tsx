import { Button, Checkbox } from "@meetxl/ui";
import { useState } from "react";
// import { FaGoogle, FaTrash } from "react-icons/fa";
import { Plus, Trash } from "lucide-react";

export const ButtonDocs: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        <div className="flex flex-row items-center gap-2">
          <p>Loading?</p>
          <Checkbox
            onCheckedChange={(state) => setLoading(state.valueOf() as boolean)}
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <p>Disabled?</p>
          <Checkbox
            onCheckedChange={(state) => setDisabled(state.valueOf() as boolean)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            isLoading={loading}
            disabled={disabled}
          >
            Create
          </Button>
          <Button
            variant="secondary"
            size="md"
            isLoading={loading}
            disabled={disabled}
          >
            Create
          </Button>
          <Button
            variant="secondary"
            size="lg"
            isLoading={loading}
            disabled={disabled}
          >
            Create
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" isLoading={loading} disabled={disabled}>
            Create it Now
          </Button>
          <Button variant="secondary" isLoading={loading} disabled={disabled}>
            Create
          </Button>
          <Button variant="ghost" isLoading={loading} disabled={disabled}>
            Create
          </Button>
          <Button variant="danger" isLoading={loading} disabled={disabled}>
            Create
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            isLoading={loading}
            disabled={disabled}
            prefixEl={<Plus size="1rem" />}
          >
            Create it Now
          </Button>
          <Button
            variant="secondary"
            isLoading={loading}
            disabled={disabled}
            suffixEl={<Plus size="1rem" />}
          >
            Create
          </Button>
          <Button
            variant="ghost"
            isLoading={loading}
            disabled={disabled}
            prefixEl={<Plus size="1rem" />}
            suffixEl={<Plus size="1rem" />}
          >
            Create
          </Button>
          <Button
            variant="danger"
            isLoading={loading}
            disabled={disabled}
            prefixEl={<Trash size="1rem" />}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
