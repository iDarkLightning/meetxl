import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import { useOrg } from "../org/org-shell";

export const AttributeDetails: React.FC<{ name: string }> = (props) => {
  const org = useOrg();
  const attribute = trpc.organization.attribute.get.useQuery({
    name: props.name,
    orgId: org.id,
  });
  const deleteAttr = trpc.organization.attribute.delete.useMutation();
  const ctx = trpc.useContext();

  return (
    <BaseQueryCell
      query={attribute}
      success={({ data }) => (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Heading>{data.name}</Heading>
            <Button
              variant="danger"
              icon={<FaTrash />}
              loading={deleteAttr.isLoading}
              onClick={() =>
                deleteAttr
                  .mutateAsync({ name: data.name, orgId: org.id })
                  .then(() => ctx.organization.attribute.get.invalidate())
                  .then(() => ctx.organization.attribute.list.invalidate())
              }
            >
              Delete
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Heading level="h4">Referenced Meetings</Heading>
            {data.rewards.length === 0 && (
              <Card className="flex min-h-[15rem] flex-col items-center justify-center border-dotted bg-opacity-0 hover:bg-opacity-0">
                <Heading level="h4">
                  No meetings reference this attribute
                </Heading>
                <p className="text-sm opacity-75">
                  Create a reward for this attribute in a meeting to see it
                  here!
                </p>
              </Card>
            )}
            {data.rewards.length > 0 && (
              <table className="w-full text-left">
                <thead>
                  <tr className="rounded-md border-[0.025rem] border-accent-stroke bg-background-secondary">
                    <th>Meeting Name</th>
                    <th>Action</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rewards.map((reward) => (
                    <Link
                      key={reward.id}
                      href={`/${org.slug}/${reward.meeting.slug}/rewards`}
                      passHref
                      className="cursor-pointer"
                    >
                      <tr>
                        <td>{reward.meeting.name}</td>
                        <td>{reward.action}</td>
                        <td>{reward.value}</td>
                      </tr>
                    </Link>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <hr className="border-accent-stroke" />
          <div className="flex flex-col gap-2">
            <Heading level="h4">Statistics</Heading>
            <table className="w-full text-left">
              <thead>
                <tr className="rounded-md border-[0.025rem] border-accent-stroke bg-background-secondary">
                  <th>Name</th>
                  <th>Email</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {data.memberAttributes.map((memberAttribute) => (
                  <tr key={memberAttribute.id}>
                    <td>{memberAttribute.orgMember.user.name}</td>
                    <td>{memberAttribute.orgMember.user.email}</td>
                    <td>{memberAttribute.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    />
  );
};