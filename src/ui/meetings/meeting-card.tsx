import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { Meeting } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useOrg } from "../org/org-shell";
import { FaEye, FaEyeSlash } from "react-icons/fa";

dayjs.extend(relativeTime);

export const MeetingCard: React.FC<{ meeting: Meeting }> = ({ meeting }) => {
  const org = useOrg();

  return (
    <Link href={`/${org.slug}/${meeting.slug}`} passHref>
      <a>
        <Card className="flex items-center justify-between bg-background-secondary py-3">
          <div className="flex flex-col gap-2">
            <Heading level="h3">{meeting.name}</Heading>
            <p className="opacity-75">
              {dayjs(meeting.startTime).isSame(dayjs(meeting.endTime), "day")
                ? `${dayjs(meeting.startTime).format("HH:mm")} - ${dayjs(
                    meeting.endTime
                  ).format("HH:mm")}`
                : `${dayjs(meeting.startTime).format("DD/MM")} - ${dayjs(
                    meeting.endTime
                  ).format("DD/MM")}`}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border-[0.125rem] border-accent-stroke py-1 px-3 font-medium">
            {meeting.isPublic ? <FaEye /> : <FaEyeSlash />}
            <p>{meeting.isPublic ? "Public" : "Private"}</p>
          </div>
        </Card>
      </a>
    </Link>
  );
};
