import { Avatar } from "@/shared-components/system/avatar";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { getAvatarFallback } from "@/utils/get-avatar-fallback";
import { User } from "@prisma/client";

export const RedeemCard: React.FC<{ user: User; redeemedAt: Date }> = (
  props
) => {
  return (
    <Card
      key={props.user.id}
      className="flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <Avatar
          imageProps={{
            src: props.user.image as string,
          }}
          fallbackProps={{
            children: getAvatarFallback(props.user.name),
          }}
        />
        <div>
          <Heading level="h4">{props.user.name}</Heading>
          <p className="text-sm opacity-80">{props.user.email}</p>
        </div>
      </div>
      <p className="opacity-80">{props.redeemedAt.toLocaleString()}</p>
    </Card>
  );
};
