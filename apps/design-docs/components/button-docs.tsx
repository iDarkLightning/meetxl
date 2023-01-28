import { Button } from "@meetxl/ui";
import { useState } from "react";
// import { FaGoogle, FaTrash } from "react-icons/fa";
import { Plus, Trash } from "lucide-react";

export const ButtonDocs: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        <div>
          <p>Loading?</p>
          <input
            type="checkbox"
            onChange={(e) => setLoading(e.target.checked)}
          />
        </div>
        <div>
          <p>Disabled?</p>
          <input
            type="checkbox"
            onChange={(e) => setDisabled(e.target.checked)}
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
            prefixEl={<Plus />}
          >
            Create it Now
          </Button>
          <Button
            variant="secondary"
            isLoading={loading}
            disabled={disabled}
            suffixEl={<Plus />}
          >
            Create
          </Button>
          <Button
            variant="ghost"
            isLoading={loading}
            disabled={disabled}
            prefixEl={<Plus />}
            suffixEl={<Plus />}
          >
            Create
          </Button>
          <Button
            variant="danger"
            isLoading={loading}
            disabled={disabled}
            prefixEl={<Trash />}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
