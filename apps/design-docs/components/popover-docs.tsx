import { Avatar, Popover, usePopover } from "@meetxl/ui";

export const PopoverDocs: React.FC = () => {
  const popover = usePopover({
    trigger: <Avatar size="lg" src="https://i.pravatar.cc/300" name="NN" />,
  });

  return (
    <div>
      <Popover config={popover}>
        <div className="flex max-w-lg flex-col gap-1">
          <h1 className="text-xl font-medium">Nirjhor Nath</h1>
          <p className="text-neutral-300">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure ab
            quo fuga nesciunt repellat, nostrum tempora pariatur, perspiciatis
            fugit dolorem consequatur enim accusantium eaque ipsum molestias
            architecto ipsa nam ullam. Totam magnam porro quas quidem aut odit
            quae atque autem.
          </p>
        </div>
      </Popover>
    </div>
  );
};
