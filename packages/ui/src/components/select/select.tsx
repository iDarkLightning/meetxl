import { useRef, useState } from "react";
import {
  Select as SelectWrapper,
  SelectTrigger,
  SelectValue,
  // SelectOverlay,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectOverlay,
} from "./select-impl";
import { AnimatePresence } from "framer-motion";
import useWindowSize from "../../hooks/use-window-size";

export interface SelectItem {
  value: string;
  display: string;
}

export interface SelectItemGroup {
  label: string;
  items: SelectItem[];
}

export interface SelectProps {
  placeholder?: React.ComponentProps<typeof SelectValue>["placeholder"];
  items: SelectItemGroup[];
}

export const Select: React.FC<SelectProps> = (props) => {
  const { isMobile } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <SelectWrapper open={isOpen} onOpenChange={setIsOpen}>
      <SelectTrigger ref={triggerRef}>
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <AnimatePresence>
        {isOpen && (
          <>
            {isMobile && <SelectOverlay />}
            <SelectContent
              width={
                triggerRef.current?.clientWidth
                  ? triggerRef.current.clientWidth + 3 + "px"
                  : null
              }
            >
              {props.items.map((group, index) => (
                <SelectGroup key={index}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.items.map((item, index) => (
                    <SelectItem value={item.value} key={index}>
                      {item.display}
                    </SelectItem>
                  ))}
                  {index !== props.items.length - 1 && <SelectSeparator />}
                </SelectGroup>
              ))}
            </SelectContent>
          </>
        )}
      </AnimatePresence>
    </SelectWrapper>
  );
};
