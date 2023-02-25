import { Button, Dialog, Input, Label, Select, useDialog } from "@meetxl/ui";
import { DialogAction } from "@meetxl/ui/src/components/dialog/dialog";
import { useState } from "react";

export const DialogDocs: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const config = useDialog({
    content: {
      header: "New Meeting",
      description:
        "Please fill out the required information to create a new meeting",
      cancelText: "Cancel",
    },
    actionElement: (
      <DialogAction
        isLoading={isLoading}
        onClick={async () => {
          setIsLoading(true);

          await new Promise((resolve) =>
            setTimeout(() => {
              resolve(setIsLoading(false));
            }, 500)
          );

          config.close();
        }}
      >
        Create
      </DialogAction>
    ),
    cancelButtonProps: {
      variant: "secondary",
    },
  });

  return (
    <>
      <Button onClick={config.open}>Open Dialog</Button>
      <Dialog config={config}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              placeholder="Meeting Name"
              fullWidth
              autoFocus={false}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              name="startTime"
              type="datetime-local"
              fullWidth
              autoFocus={false}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              name="endTime"
              type="datetime-local"
              fullWidth
              autoFocus={false}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Attribute</Label>
            <Select
              placeholder="Attributes"
              items={[
                {
                  label: "Fruits",
                  items: [
                    { display: "Apple", value: "apple" },
                    { display: "Banana", value: "banana" },
                    { display: "Blueberry", value: "blueberry" },
                  ],
                },
                // {
                //   label: "Vegetables",
                //   items: [
                //     { display: "Broccoli", value: "broccoli" },
                //     { display: "Cabbage", value: "cabbage" },
                //     { display: "Carrot", value: "carrot" },
                //   ],
                // },
                // {
                //   label: "Meat",
                //   items: [
                //     { display: "Beef", value: "beef" },
                //     { display: "Chicken", value: "chicken" },
                //     { display: "Lamb", value: "lamb" },
                //   ],
                // },
              ]}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};
