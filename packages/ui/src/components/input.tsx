import { Button } from "./button";

export const Input: React.FC = () => {
  return (
    <div className="flex gap-1 p-4">
      <input
        type="text"
        placeholder="Enter your name..."
        className="rounded-md border-[0.025rem] border-neutral-stroke bg-neutral px-3 focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-disco focus-visible:ring-opacity-40"
        // className="bg-neutral border-neutral-stroke rounded-md  px-3 placeholder:text-sm"
      />
      <Button variant="ghost">Upload</Button>
    </div>
  );
};
