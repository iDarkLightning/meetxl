/* eslint-disable @next/next/no-img-element */
import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Avatar } from "@/shared-components/system/avatar";
import { Card } from "@/shared-components/system/card";
import { AnimateWrapper } from "@/shared-components/util/animate-wrapper";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { CustomNextPage } from "@/types/next-page";
import { OrgShell, useOrg } from "@/ui/org/org-shell";
import { getAvatarFallback } from "@/utils/get-avatar-fallback";
import { trpc } from "@/utils/trpc";
import Link from "next/link";

const OrgMembers: CustomNextPage = () => {
  const org = useOrg();
  const membersQuery = trpc.organization.members.list.useQuery({
    orgId: org.id,
  });

  return (
    <SectionWrapper>
      <SectionHeading
        heading="Organization Members"
        sub="Manage all the members of your organization"
      />
      <BaseQueryCell
        query={membersQuery}
        success={({ data }) => (
          <AnimateWrapper className="flex flex-col gap-6">
            {data.map((member) => (
              <Link
                key={member.userId}
                href={`/${org.slug}/members/${member.userId}`}
                passHref
              >
                <a>
                  <Card className="flex justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar
                        imageProps={{ src: member.user.image as string }}
                        fallbackProps={{
                          children: getAvatarFallback(member.user.name),
                        }}
                      />
                      <div>
                        <p>{member.user.name}</p>
                        <p>{member.user.email}</p>
                      </div>
                    </div>
                  </Card>
                </a>
              </Link>
            ))}
          </AnimateWrapper>
        )}
      />
    </SectionWrapper>
  );
};

OrgMembers.auth = true;

OrgMembers.getLayout = (page) => <OrgShell>{page}</OrgShell>;

export default OrgMembers;
