import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { AnimateWrapper } from "@/shared-components/util/animate-wrapper";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { CustomNextPage } from "@/types/next-page";
import { NewMeetingsModal } from "@/ui/meetings/new-meetings";
import { OrgShell, useOrg } from "@/ui/org/org-shell";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const OrgHome: CustomNextPage = () => {
  const org = useOrg();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const meetingsQuery = trpc.meeting.list.useQuery({ orgId: org.id });

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h4">Meetings</Heading>
          <p className="opacity-75">Manage your organization&apos;s meetings</p>
        </div>
        <Button
          variant="primary"
          icon={<FaPlus size="0.75rem" />}
          onClick={() => setIsOpen(true)}
        >
          New
        </Button>
      </div>
      <BaseQueryCell
        query={meetingsQuery}
        success={({ data }) => (
          <AnimateWrapper className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((meeting) => (
              <Card key={meeting.id}>
                <Heading level="h3">{meeting.name}</Heading>
              </Card>
            ))}
          </AnimateWrapper>
        )}
      />
      <NewMeetingsModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </section>
  );
};

OrgHome.auth = true;

OrgHome.getLayout = (page) => <OrgShell>{page}</OrgShell>;

export default OrgHome;
