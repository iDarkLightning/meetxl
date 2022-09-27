/* eslint-disable @next/next/no-img-element */
import { Heading } from "@/shared-components/system/heading";
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
      <div className="rounded-3xl bg-gradient-to-b from-teal-300 to-pink-700 p-1">
        <div className="flex-flex-col h-full w-full rounded-3xl bg-black px-12">
          <div className="relative flex h-[6rem] flex-1 items-center justify-center">
            <Heading className="font-mono text-4xl">
              #{props.ticketNumber}
            </Heading>
            <hr className="absolute bottom-0 w-[calc(100%+6rem)] border-b-2 border-dotted" />
            <div className="absolute bottom-[-1.5rem] left-[-5rem] h-12 w-12 rounded-full border-r-[0.25rem] border-teal-300 bg-background-primary" />
            <div className="absolute bottom-[-1.5rem] right-[-5rem] h-12 w-12 rounded-full border-l-[0.25rem] border-teal-300 bg-background-primary" />
          </div>
          <div className="flex h-[24rem] flex-[4] flex-col items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <img
                src={session.data?.user?.image as string}
                alt={session.data?.user?.name as string}
                className="rounded-full"
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
            <div className="absolute top-[-1.5rem] left-[-5rem] h-12 w-12 rounded-full border-r-[0.25rem] border-pink-700 bg-background-primary" />
            <div className="absolute top-[-1.5rem] right-[-5rem] h-12 w-12 rounded-full border-l-[0.25rem] border-pink-700 bg-background-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};
