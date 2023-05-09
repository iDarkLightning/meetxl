import { Accordion } from "@meetxl/ui";
import React from "react";

export const AccordionDocs: React.FC = () => {
  return (
    <div>
      <Accordion
        type="single"
        collapsible
        items={[
          {
            header: "Header 1",
            content: "Content 1",
            value: "1",
          },
          {
            header: "Header 2",
            content: "Content 2",
            value: "2",
          },
        ]}
      />
    </div>
  );
};
