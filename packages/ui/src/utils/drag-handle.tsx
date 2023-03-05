export const DragHandle: React.FC = () => (
  <div className="rounded-t-4xl flex w-full items-center justify-center">
    <div className="-mr-1 h-1 w-6 rounded-full bg-neutral-500 transition-all group-active:rotate-12" />
    <div className="h-1 w-6 rounded-full bg-neutral-500 transition-all group-active:-rotate-12" />
  </div>
);
