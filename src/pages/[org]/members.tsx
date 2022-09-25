/* eslint-disable @next/next/no-img-element */
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { CustomNextPage } from "@/types/next-page";
import { OrgShell, useOrg } from "@/ui/org/org-shell";
import { trpc } from "@/utils/trpc";

const OrgMembers: CustomNextPage = () => {
  const org = useOrg();
  const membersQuery = trpc.organization.members.list.useQuery({
    orgId: org.id,
  });

  return (
    <section className="flex flex-col gap-6">
      <div>
        <Heading level="h4">Organization Members</Heading>
        <p className="opacity-75">
          Manage all of the members of your organization
        </p>
      </div>
      <BaseQueryCell
        query={membersQuery}
        success={({ data }) => (
          <>
            {data.map((member) => (
              <Card key={member.userId} className="flex items-center gap-4">
                <img
                  className="h-10 w-10 rounded-full"
                  src={member.user.image!}
                  alt={member.user.name!}
                />
                <div>
                  <p>{member.user.name}</p>
                  <p>{member.user.email}</p>
                </div>
              </Card>
            ))}
          </>
        )}
      />
    </section>
  );
};

OrgMembers.auth = true;

OrgMembers.getLayout = (page) => <OrgShell>{page}</OrgShell>;

export default OrgMembers;
