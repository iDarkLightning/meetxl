import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Button } from "@/shared-components/system/button";
import { Heading } from "@/shared-components/system/heading";
import { AnimateWrapper } from "@/shared-components/util/animate-wrapper";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { CustomNextPage } from "@/types/next-page";
import { MeetingCard } from "@/ui/meetings/meeting-card";
import { NewMeetingsModal } from "@/ui/meetings/new-meetings";
import { OrgShell, useOrg } from "@/ui/org/org-shell";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const MemberListing: React.FC = () => {
  const org = useOrg();
  const meetingsQuery = trpc.meeting.list.useQuery({ orgId: org.id });

  return (
    <BaseQueryCell
      query={meetingsQuery}
      success={({ data }) => {
        const publicMeetings = data.filter((meeting) => meeting.isPublic);
        const privateMeetings = data.filter((meeting) => !meeting.isPublic);

        return (
          <div className="flex flex-col gap-4">
            {privateMeetings.length > 0 && (
              <div className="flex flex-col gap-2">
                <Heading level="h4">Registered Meetings</Heading>
                <AnimateWrapper className="flex flex-col gap-3">
                  {privateMeetings.map((meeting) => (
                    <MeetingCard meeting={meeting} key={meeting.id} />
                  ))}
                </AnimateWrapper>
              </div>
            )}
            {publicMeetings.length > 0 && (
              <div className="flex flex-col gap-2">
                <Heading level="h4">Public Meetings</Heading>
                <AnimateWrapper className="flex flex-col gap-3">
                  {publicMeetings.map((meeting) => (
                    <MeetingCard meeting={meeting} key={meeting.id} />
                  ))}
                </AnimateWrapper>
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

const AdminListing: React.FC = () => {
  const org = useOrg();
  const meetingsQuery = trpc.meeting.list.useQuery({ orgId: org.id });

  return (
    <BaseQueryCell
      query={meetingsQuery}
      success={({ data }) => (
        <AnimateWrapper className="flex flex-col gap-3">
          {data.map((meeting) => (
            <MeetingCard meeting={meeting} key={meeting.id} />
          ))}
        </AnimateWrapper>
      )}
    />
  );
};

const OrgHome: CustomNextPage = () => {
  const org = useOrg();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <SectionWrapper>
      <div className="flex items-center justify-between">
        <SectionHeading
          heading="Meetings"
          sub={`All of the available meetings for the ${org.name} organization`}
        />
        <Button
          variant="primary"
          icon={<FaPlus size="0.75rem" />}
          onClick={() => setIsOpen(true)}
        >
          New
        </Button>
      </div>
      {org.member.role === "ADMIN" ? <AdminListing /> : <MemberListing />}
      <NewMeetingsModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </SectionWrapper>
  );
};

OrgHome.auth = true;

OrgHome.getLayout = (page) => <OrgShell>{page}</OrgShell>;

export default OrgHome;
