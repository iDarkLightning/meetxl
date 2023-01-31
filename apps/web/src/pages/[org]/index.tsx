import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Heading } from "@/shared-components/system/heading";
import { AnimateWrapper } from "@/shared-components/util/animate-wrapper";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { EmptyContent } from "@/shared-components/util/empty-content";
import { CustomNextPage } from "@/types/next-page";
import { MeetingCard } from "@/ui/meetings/meeting-card";
import { NewMeetingsModal } from "@/ui/meetings/new-meetings";
import { OrgShell, useOrg } from "@/ui/org/org-shell";
import { trpc } from "@/utils/trpc";
import { Input } from "@meetxl/ui";

const MemberListing: React.FC = () => {
  const org = useOrg();
  const meetingsQuery = trpc.meeting.list.useQuery({ orgId: org.id });

  return (
    <BaseQueryCell
      query={meetingsQuery}
      success={({ data }) => {
        const publicMeetings = data.filter((meeting) => meeting.isPublic);
        const privateMeetings = data.filter((meeting) => !meeting.isPublic);

        if (publicMeetings.length === 0 && privateMeetings.length === 0) {
          return (
            <EmptyContent
              heading="No meetings"
              sub="This organization currently has no meetings"
            />
          );
        }

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
          {data.length === 0 && (
            <EmptyContent
              heading="No Meetings"
              sub="This organization currently has no meetings. You can create one above to get started."
            />
          )}
          {data.length > 0 &&
            data.map((meeting) => (
              <MeetingCard meeting={meeting} key={meeting.id} />
            ))}
        </AnimateWrapper>
      )}
    />
  );
};

const OrgHome: CustomNextPage = () => {
  const org = useOrg();

  return (
    <SectionWrapper>
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <SectionHeading
          heading="Meetings"
          sub={`All of the available meetings for the ${org.name} organization`}
        />
        {org.member.role === "ADMIN" && <NewMeetingsModal />}
      </div>
      {org.member.role === "ADMIN" ? <AdminListing /> : <MemberListing />}
      <Input />
    </SectionWrapper>
  );
};

OrgHome.auth = true;

OrgHome.getLayout = (page) => <OrgShell>{page}</OrgShell>;

export default OrgHome;
