/* eslint-disable @next/next/no-img-element */
import { SectionHeading } from "@/shared-components/layout/section-heading";
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { AnimateWrapper } from "@/shared-components/util/animate-wrapper";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { CustomNextPage } from "@/types/next-page";
import { OrgShell, useOrg } from "@/ui/org/org-shell";
import { trpc } from "@/utils/trpc";

const OrgMembers: CustomNextPage = () => {
  const org = useOrg();
  const membersQuery = trpc.organization.members.list.useQuery({
    orgId: org.id,
  });
  const kickMember = trpc.organization.members.kick.useMutation();

  return (
    <section className="flex flex-col gap-6">
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
                  <img
                    className="h-10 w-10 rounded-full"
                    src={member.user.image!}
                    alt={member.user.name!}
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
    </section>
  );
};

OrgMembers.auth = true;

OrgMembers.getLayout = (page) => <OrgShell>{page}</OrgShell>;

export default OrgMembers;
