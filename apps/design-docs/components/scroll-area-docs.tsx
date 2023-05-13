import { Divider, ScrollArea } from "@meetxl/ui";
import React from "react";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

export const ScrollAreaDocs: React.FC = () => {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border border-neutral-stroke">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag, i) => (
          <React.Fragment key={i}>
            <div className="text-sm" key={tag}>
              {tag}
            </div>
            <Divider className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  );
};
