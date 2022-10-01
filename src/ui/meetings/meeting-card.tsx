import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { Meeting } from "@prisma/client";
import Link from "next/link";
import { useOrg } from "../org/org-shell";

export const MeetingCard: React.FC<{ meeting: Meeting }> = ({ meeting }) => {
  const org = useOrg();

  return (
    <Link href={`/${org.slug}/${meeting.slug}`} passHref>
      <a>
        <Card className="bg-background-secondary py-3">
          <Heading level="h3">{meeting.name}</Heading>
          <div className="flex gap-4 opacity-80">
            <p>Public: {!!meeting.isPublic ? "Yes" : "No"}</p>
          </div>
        </Card>
      </a>
    </Link>
  );
};
