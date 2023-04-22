import { Button, Toaster, toast } from "@meetxl/ui";

export const ToastDocs: React.FC = () => {
  return (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => toast("Hello, world!")}>Default Toast</Button>
        <Button
          onClick={() =>
            toast("Hello, world!", {
              description: "Good morning, the world is doing well",
            })
          }
        >
          Description Toast
        </Button>
        <Button
          onClick={() =>
            toast.success("Hello, world!", {
              description: "Good morning, the world is doing well",
            })
          }
        >
          Success Toast
        </Button>
        <Button
          onClick={() =>
            toast.error("Hello, world!", {
              description: "Good morning, the world is on fire",
            })
          }
        >
          Error Toast
        </Button>
        <Button
          onClick={() =>
            toast.error("Hello, world!", {
              description: "Good morning, the world is on fire",
              action: {
                label: "Fix it",
                onClick: () => console.log("fixed it"),
              },
            })
          }
        >
          Action Toast
        </Button>
        <Button
          onClick={() => {
            const promise = new Promise((resolve, reject) => {
              setTimeout(() => {
                if (Math.random() > 0.5) return resolve("Success");
                return reject("Error");
              }, 500);
            });

            toast.promise(promise, {
              loading: "Loading",
              success: "Success",
              error: "Error",
            });
          }}
        >
          Promise Toast
        </Button>
      </div>
    </>
  );
};
