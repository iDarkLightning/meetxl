import { Skeleton } from "@meetxl/ui";
import React from "react";

export const SkeletonDocs: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-32 w-32" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
};
