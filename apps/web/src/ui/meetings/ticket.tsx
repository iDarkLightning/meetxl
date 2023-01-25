/* eslint-disable @next/next/no-img-element */
import { Avatar } from "@/shared-components/system/avatar";
import { Heading } from "@/shared-components/system/heading";
import { getAvatarFallback } from "@/utils/get-avatar-fallback";
import { useSession } from "next-auth/react";

interface Props {
  ticketNumber: number | string;
  eventName: string;
  eventHost: string;
  confirmationCode: string;
}

export const MeetingTicket: React.FC<Props> = (props) => {
  const session = useSession();

  return (
    <div className="m-10">
      <div className="rounded-3xl bg-gradient-to-b from-red-400 to-accent-primary p-1">
        <div className="flex-flex-col h-full w-full rounded-3xl bg-black px-12 md:px-16">
          <div className="relative flex h-[6rem] flex-1 items-center justify-center">
            <Heading className="font-mono text-4xl">
              #{props.ticketNumber}
            </Heading>
            <hr className="absolute bottom-0 w-[calc(100%+6rem)] border-b-2 border-dotted" />
            <div className="absolute bottom-[-1.5rem] left-[-5rem] h-12 w-12 rounded-full border-r-[0.25rem] border-red-400 bg-background-primary md:left-[-6rem]" />
            <div className="absolute bottom-[-1.5rem] right-[-5rem] h-12 w-12 rounded-full border-l-[0.25rem] border-red-400 bg-background-primary md:right-[-6rem]" />
          </div>
          <div className="flex h-[24rem] flex-[4] flex-col items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <Avatar
                imageProps={{ src: session.data?.user?.image as string }}
                fallbackProps={{
                  children: getAvatarFallback(
                    session.data?.user?.name as string
                  ),
                }}
              />
              <Heading className="mt-2 text-4xl font-bold">
                {session.data?.user?.name}
              </Heading>
              <Heading className="font-mono text-lg">
                {session.data?.user?.email}
              </Heading>
            </div>
            <div className="text-center">
              <Heading className="text-2xl">{props.eventName}</Heading>
              <Heading className="font-mono">
                Hosted by: {props.eventHost}
              </Heading>
            </div>
          </div>
          <div className="relative flex h-[6rem] flex-1 items-center justify-center">
            <Heading className="mt-[-1rem] opacity-80">
              Code: {props.confirmationCode}
            </Heading>
            <hr className="absolute top-0 w-[calc(100%+6rem)] border-b-2 border-dotted" />
            <div className="absolute top-[-1.5rem] left-[-5rem] h-12 w-12 rounded-full border-r-[0.25rem] border-accent-primary bg-background-primary md:left-[-6rem]" />
            <div className="absolute top-[-1.5rem] right-[-5rem] h-12 w-12 rounded-full border-l-[0.25rem] border-accent-primary bg-background-primary md:right-[-6rem]" />
          </div>
        </div>
      </div>
    </div>
  );
};
