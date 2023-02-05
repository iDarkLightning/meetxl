import { ContentWrapper } from "@/shared-components/layout/content-wrapper";
import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Button } from "@/shared-components/system/button";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { useOrg } from "@/ui/org/org-shell";
import { trpc } from "@/utils/trpc";
import { AttendanceLink, AttendanceLinkAction } from "@prisma/client";
import { motion, useAnimationControls } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaChevronLeft, FaTrash } from "react-icons/fa";
import { useMeeting } from "../meeting-shell";
import { QRCode } from "../../../shared-components/util/qr-code";
import { CodeDisplay } from "./code-display";
import { LinkRedeemList } from "./link-redeem-list";

const AdminView: React.FC<{ link: AttendanceLink }> = (props) => {
  const org = useOrg();
  const meeting = useMeeting();
  const router = useRouter();
  const deleteLink = trpc.meeting.attendance.links.delete.useMutation();

  const heading = props.link.action === "CHECKIN" ? "Check In" : "Check Out";

  return (
    <>
      <div className="flex items-center justify-between">
        <SectionHeading
          heading={heading}
          sub={`${heading} Via Code: ${props.link.code}`}
        />
        <div className="flex items-center gap-4">
          <Button
            variant="danger"
            icon={<FaTrash />}
            onClick={() =>
              deleteLink
                .mutateAsync({
                  id: props.link.id,
                  orgId: org.id,
                  meetingId: meeting.id,
                })
                .then(() =>
                  router.push(`/${org.slug}/${meeting.slug}/participants`)
                )
                .catch(() => 0)
            }
          >
            Delete
          </Button>
          <QRCode />
        </div>
      </div>
      <LinkRedeemList id={props.link.id} />
    </>
  );
};

const MemberView: React.FC<{ link: AttendanceLink }> = (props) => {
  const org = useOrg();
  const meeting = useMeeting();
  const router = useRouter();
  const applyLink = trpc.meeting.attendance.links.apply.useMutation();
  const register = trpc.meeting.participant.register.useMutation();
  const ctx = trpc.useContext();
  const controls = useAnimationControls();

  const heading = props.link.action === "CHECKIN" ? "Check In" : "Check Out";

  return (
    <ContentWrapper className="h-screen">
      <div className="flex h-full flex-col items-center justify-center gap-16">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <SectionHeading
                heading={heading}
                sub={`${meeting.name} hosted by ${org.name}`}
              />
            </motion.div>
            {/* {!meeting.participant && (
              <div className="text-xl font-medium">
                Please{" "}
                <Link
                  href={`/${org.slug}/${meeting.slug}`}
                  className="text-purple-500"
                >
                  register
                </Link>{" "}
                to check in
              </div>
            )} */}
            <CodeDisplay code={props.link.code} />
            {((!meeting.participant?.checkedIn &&
              props.link.action === "CHECKIN") ||
              (!meeting.participant?.checkedOut &&
                props.link.action === "CHECKOUT")) && (
              <motion.div animate={controls}>
                <div className="flex gap-2">
                  <Button
                    size="md"
                    className="w-min"
                    variant="primary"
                    loading={register.isLoading || applyLink.isLoading}
                    onClick={async () => {
                      await register
                        .mutateAsync({
                          meetingId: meeting.id,
                          orgId: org.id,
                        })
                        .catch(() => 0);

                      applyLink
                        .mutateAsync({
                          code: router.query.code as string,
                          meetingId: meeting.id,
                          orgId: org.id,
                        })
                        .then(() => ctx.meeting.get.invalidate())
                        .then(() => controls.start({ opacity: 1 }))
                        .catch(() => 0);
                    }}
                  >
                    {meeting.participant ? "" : "Register and "}
                    {heading}
                  </Button>
                  <Button size="md" href={`/${org.slug}/${meeting.slug}`}>
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
          {((meeting.participant?.checkedIn &&
            props.link.action === "CHECKIN") ||
            (meeting.participant?.checkedOut &&
              props.link.action === "CHECKOUT")) && (
            <motion.div
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              className="flex flex-col gap-2"
            >
              <p className="text-green-300 lg:text-lg">
                {`You checked ${
                  props.link.action === "CHECKIN" ? "in to" : "out of"
                } this meeting at ${meeting.participant[
                  props.link.action === "CHECKIN"
                    ? "checkInTime"
                    : "checkOutTime"
                ]?.toLocaleString()}`}
              </p>
              <Button
                variant="ghost"
                className="w-min"
                icon={<FaChevronLeft size="0.75rem" />}
                href={`/${org.slug}/${meeting.slug}`}
              >
                Return to Meeting Overview
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export const LinkRedeemView: React.FC<{ action: AttendanceLinkAction }> = (
  props
) => {
  const org = useOrg();
  const meeting = useMeeting();
  const router = useRouter();
  const codeQuery = trpc.meeting.attendance.links.get.useQuery(
    {
      orgId: org.id,
      meetingId: meeting.id,
      code: router.query.code as string,
      type: props.action,
    },
    {
      refetchInterval: 15 * 1000,
    }
  );

  return (
    <SectionWrapper>
      <BaseQueryCell
        query={codeQuery}
        success={({ data }) => (
          <>
            {org.member.role === "ADMIN" && <AdminView link={data} />}
            {org.member.role === "MEMBER" && <MemberView link={data} />}
          </>
        )}
      />
    </SectionWrapper>
  );
};
