import { Button } from "@/shared-components/system/button";
import { Heading } from "@/shared-components/system/heading";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { EmptyContent } from "@/shared-components/util/empty-content";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { FaTrash } from "react-icons/fa";
import { useOrg } from "../org/org-shell";

const ValueEditable: React.FC<{
  initialValue: string;
  handleSubmit: (text: string) => void | Promise<void>;
}> = (props) => {
  const text = useRef(props.initialValue);

  const handleChange = (evt: ContentEditableEvent) => {
    text.current = evt.target.value;
  };

  const handleBlur = () => {
    if (text.current !== props.initialValue) {
      props.handleSubmit(text.current);
    }
  };

  return (
    <ContentEditable
      html={text.current}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={(evt) => {
        if (evt.key === "Enter") {
          evt.preventDefault();
          props.handleSubmit(text.current);
        }
      }}
    />
  );
};

export const AttributeDetails: React.FC<{ name: string }> = (props) => {
  const org = useOrg();
  const attribute = trpc.organization.attribute.get.useQuery({
    name: props.name,
    orgId: org.id,
  });
  const deleteAttr = trpc.organization.attribute.delete.useMutation();
  const ctx = trpc.useContext();
  const editValue = trpc.organization.attribute.set.useMutation();
  const router = useRouter();

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
                  .then(() => router.push(`/${org.slug}/attributes`))
                  .catch(() => 0)
              }
            >
              Delete
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Heading level="h4">Referenced Meetings</Heading>
            {data.rewards.length === 0 && (
              <EmptyContent
                heading="No meetings reference this attribute"
                sub="Create a reward for this attribute in a meeting to see it here!"
              />
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
                    <td>
                      <ValueEditable
                        handleSubmit={(text) => {
                          editValue
                            .mutateAsync({
                              attributeName:
                                memberAttribute.organizationAttributeName,
                              orgId: org.id,
                              value: parseInt(text),
                              userId: memberAttribute.orgMember.user.id,
                            })
                            .then(() =>
                              ctx.organization.attribute.get.invalidate()
                            )
                            .catch(() => 0);
                        }}
                        initialValue={memberAttribute.value.toString()}
                      />
                    </td>
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
