import { AlertDialog, Button } from "@meetxl/ui";
import { useState } from "react";

export const AlertDialogDocs: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <AlertDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};
