import { Card } from "@meetxl/ui";
import React from "react";

export const CardDocs: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <Card variant="solid">Hi there</Card>
      <Card variant="outline">Hi there</Card>
      <Card variant="solid" isClickable href="/components/popover">
        Hi there
      </Card>
    </div>
  );
};
