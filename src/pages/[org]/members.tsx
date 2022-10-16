/* eslint-disable @next/next/no-img-element */
import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Avatar } from "@/shared-components/system/avatar";
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { AnimateWrapper } from "@/shared-components/util/animate-wrapper";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { CustomNextPage } from "@/types/next-page";
import { OrgShell, useOrg } from "@/ui/org/org-shell";
import { getAvatarFallback } from "@/utils/get-avatar-fallback";
import { trpc } from "@/utils/trpc";

const OrgMembers: CustomNextPage = () => {
  const org = useOrg();
  const membersQuery = trpc.organization.members.list.useQuery({
    orgId: org.id,
  });
  const kickMember = trpc.organization.members.kick.useMutation();

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
              <Card key={member.userId} className="flex justify-between">
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
                {member.role === "MEMBER" && (
                  <Button
                    size="sm"
                    className="text-red-600"
                    onClick={() =>
                      kickMember
                        .mutateAsync({
                          memberId: member.user.id,
                          orgId: org.id,
                        })
                        .then(() => membersQuery.refetch())
                        .catch(() => 0)
                    }
                  >
                    Kick
                  </Button>
                )}
              </Card>
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
