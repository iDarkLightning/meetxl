import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { useOrg } from "@/ui/org/org-shell";
import { trpc } from "@/utils/trpc";
import { AttendanceLinkAction } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FaTrash } from "react-icons/fa";
import { useMeeting } from "../meeting-shell";
import { CheckingQRCode } from "./checking-qr-code";
import { LinkRedeemList } from "./link-redeem-list";

export const LinkRedeemView: React.FC<{ action: AttendanceLinkAction }> = (
  props
) => {
  const org = useOrg();
  const meeting = useMeeting();
  const router = useRouter();
  const ctx = trpc.useContext();
  const applyLink = trpc.meeting.attendance.links.apply.useMutation();
  const codeQuery = trpc.meeting.attendance.links.get.useQuery({
    orgId: org.id,
    meetingId: meeting.id,
    code: router.query.code as string,
    type: props.action,
  });
  const deleteLink = trpc.meeting.attendance.links.delete.useMutation();
  const session = useSession();

  const heading = props.action === "CHECKIN" ? "Check In" : "Check Out";

  return (
    <SectionWrapper>
      <BaseQueryCell
        query={codeQuery}
        success={({ data }) => (
          <>
            <div className="flex items-center justify-between">
              <SectionHeading
                heading={heading}
                sub={`${heading} Via Code: ${router.query.code}`}
              />
              {org.member.role === "ADMIN" && (
                <div className="flex items-center gap-4">
                  <Button
                    variant="danger"
                    icon={<FaTrash />}
                    onClick={() =>
                      deleteLink
                        .mutateAsync({
                          id: data.id,
                          orgId: org.id,
                          meetingId: meeting.id,
                        })
                        .then(() =>
                          router.push(`/${org.slug}/${meeting.slug}/attendance`)
                        )
                    }
                  >
                    Delete
                  </Button>
                  <CheckingQRCode />
                </div>
              )}
            </div>
            {org.member.role === "ADMIN" && <LinkRedeemList id={data.id} />}
            {org.member.role === "MEMBER" && !meeting.participant && (
              <p>Please go register for this meeting</p>
            )}
            {org.member.role === "MEMBER" && meeting.participant && (
              <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  <div className="flex flex-col gap-2">
                    <Heading className="text-4xl">Code: {data.code}</Heading>
                    <p className="text-lg opacity-80">
                      {heading} as {session.data?.user?.email}
                    </p>
                  </div>
                  {((!meeting.participant?.checkedIn &&
                    props.action === "CHECKIN") ||
                    (!meeting.participant?.checkedOut &&
                      props.action === "CHECKOUT")) && (
                    <Button
                      size="lg"
                      variant="primary"
                      onClick={() =>
                        applyLink
                          .mutateAsync({
                            code: router.query.code as string,
                            meetingId: meeting.id,
                            orgId: org.id,
                          })
                          .then(() => ctx.meeting.get.invalidate())
                      }
                    >
                      {heading}
                    </Button>
                  )}
                  {((meeting.participant?.checkedIn &&
                    props.action === "CHECKIN") ||
                    (meeting.participant?.checkedOut &&
                      props.action === "CHECKOUT")) && (
                    <p>
                      {`You checked ${
                        props.action === "CHECKIN" ? "in to" : "out of"
                      } this meeting at ${meeting.participant[
                        props.action === "CHECKIN"
                          ? "checkInTime"
                          : "checkOutTime"
                      ]?.toLocaleDateString()}`}
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      />
    </SectionWrapper>
  );
};
