import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectPortal,
  SelectSeparator,
  SelectTest,
  SelectTrigger,
  SelectValue,
} from "@meetxl/ui";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

export const SelectDocs: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-start gap-2">
      <SelectTest />
    </div>
  );
};
