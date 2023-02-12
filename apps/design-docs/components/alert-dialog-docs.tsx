import { AlertDialog, Button, useAlertDialog } from "@meetxl/ui";
import { Trash } from "lucide-react";
import { useState } from "react";

export const AlertDialogDocs: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dialog = useAlertDialog({
    content: {
      header: "Are you sure?",
      description:
        "This action cannot be undone, and will remove all data from our servers. Please make sure that that is OK before proceeding.",
      actionText: "Delete",
    },
    onAction: async () => {
      setIsLoading(true);

      await new Promise((resolve) =>
        setTimeout(() => {
          resolve(setIsLoading(false));
        }, 500)
      );
    },
    actionButtonProps: {
      isLoading,
      prefixEl: <Trash size="1rem" />,
      variant: "danger",
    },
  });

  return (
    <>
      <Button onClick={dialog.open}>Open</Button>
      <AlertDialog config={dialog} />
    </>
  );
};
