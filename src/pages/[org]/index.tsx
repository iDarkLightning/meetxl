import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { AnimateWrapper } from "@/shared-components/util/animate-wrapper";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { CustomNextPage } from "@/types/next-page";
import { NewMeetingsModal } from "@/ui/meetings/new-meetings";
import { OrgShell, useOrg } from "@/ui/org/org-shell";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const OrgHome: CustomNextPage = () => {
  const org = useOrg();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const meetingsQuery = trpc.meeting.list.useQuery({ orgId: org.id });

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
      <BaseQueryCell
        query={meetingsQuery}
        success={({ data }) => (
          <AnimateWrapper className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.map((meeting) => (
              <Link
                key={meeting.id}
                href={`/${org.slug}/${meeting.slug}`}
                passHref
              >
                <a>
                  <Card>
                    <Heading level="h3">{meeting.name}</Heading>
                  </Card>
                </a>
              </Link>
            ))}
          </AnimateWrapper>
        )}
      />
      <NewMeetingsModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </SectionWrapper>
  );
};

OrgHome.auth = true;

OrgHome.getLayout = (page) => <OrgShell>{page}</OrgShell>;

export default OrgHome;
