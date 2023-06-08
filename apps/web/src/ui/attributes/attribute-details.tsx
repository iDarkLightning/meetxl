import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
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
import { NewAttributeLink } from "./new-attribute-link";
import { FaExternalLinkAlt } from "react-icons/fa";
import { AnimateWrapper } from "@/shared-components/util/animate-wrapper";
import { DeleteButton } from "@/shared-components/util/delete-button";

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

const AttributeLinks: React.FC = () => {
  const org = useOrg();
  const router = useRouter();
  const links = trpc.organization.attribute.links.list.useQuery({
    orgId: org.id,
    name: router.query.name as string,
  });

  return (
    <div className="flex flex-col gap-4">
      <Card className="hover:bg-opacity-100">
        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
          <div>
            <Heading level="h4">Links</Heading>
            <p className="text-sm opacity-75">
              Create links that can be shared to directly modify this attribute
              for members.
            </p>
          </div>
          <NewAttributeLink />
        </div>
      </Card>
      <BaseQueryCell
        query={links}
        success={({ data }) => (
          <AnimateWrapper className="flex flex-col gap-4">
            {data.length === 0 && (
              <EmptyContent
                className="bg-opacity-100 hover:bg-opacity-100"
                heading="This attribute has no links"
                sub="Create a new link to share with members"
              />
            )}
            {data.length > 0 &&
              data.map((link) => (
                <Link
                  key={link.id}
                  href={`/${org.slug}/attributes/${router.query.name}/redeem/${link.code}`}
                >
                  <Card className="flex cursor-pointer items-center justify-between gap-4 py-2 transition-colors hover:bg-opacity-80">
                    <div>
                      <p className="font-medium">{link.name}</p>
                      <p className="font-mono text-green-400">{link.code}</p>
                    </div>
                    <FaExternalLinkAlt size="0.75rem" />
                  </Card>
                </Link>
              ))}
          </AnimateWrapper>
        )}
      />
    </div>
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
  const toggleAllLinks =
    trpc.organization.attribute.toggleAllLinks.useMutation();

  return (
    <BaseQueryCell
      query={attribute}
      success={({ data }) => (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex flex-1 flex-col gap-6">
              <Card className="flex items-center justify-between hover:bg-opacity-100">
                <Heading level="h3">{data.name}</Heading>
                <div className="flex gap-3">
                  <Button
                    onClick={() =>
                      toggleAllLinks.mutateAsync({
                        name: data.name,
                        orgId: org.id,
                        enabled: true,
                      })
                    }
                  >
                    Enable All
                  </Button>
                  <Button
                    onClick={() =>
                      toggleAllLinks.mutateAsync({
                        name: data.name,
                        orgId: org.id,
                        enabled: false,
                      })
                    }
                  >
                    Disable All
                  </Button>
                  <DeleteButton
                    confirmationText={data.name}
                    loading={deleteAttr.isLoading}
                    onConfirm={() =>
                      deleteAttr
                        .mutateAsync({ name: data.name, orgId: org.id })
                        .then(() =>
                          ctx.organization.attribute.list.invalidate()
                        )
                        .then(() => router.push(`/${org.slug}/attributes`))
                        .then(() => ctx.organization.attribute.get.invalidate())
                        .catch(() => 0)
                    }
                  />
                </div>
              </Card>
              <AttributeLinks />
            </div>
            <div className="flex flex-1 flex-col gap-6">
              {data.rewards.length > 0 && (
                <>
                  <div className="flex flex-col gap-6">
                    <Card className="p-0">
                      <div className="p-4 pb-0">
                        <Heading level="h4">Referenced Meetings</Heading>
                      </div>

                      <table className="w-full text-left">
                        <thead>
                          <tr className="child:border-accent-stroke child:border-b-[0.0125rem] child:p-4">
                            <th>Meeting</th>
                            <th>Action</th>
                            <th>Value</th>
                          </tr>
                        </thead>
                        <tbody className="w-full">
                          {data.rewards.map((reward) => (
                            <tr
                              className="cursor-pointer child:p-4"
                              key={reward.id}
                            >
                              <td>
                                <Link
                                  href={`/${org.slug}/${reward.meeting.slug}/rewards`}
                                  passHref
                                  className="block h-full cursor-pointer"
                                >
                                  {reward.meeting.name}
                                </Link>
                              </td>
                              <td>
                                <Link
                                  href={`/${org.slug}/${reward.meeting.slug}/rewards`}
                                  passHref
                                  className="block cursor-pointer"
                                >
                                  {reward.action}
                                </Link>
                              </td>
                              <td>
                                <Link
                                  href={`/${org.slug}/${reward.meeting.slug}/rewards`}
                                  passHref
                                  className="block cursor-pointer"
                                >
                                  {reward.value}
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Card>
                  </div>
                </>
              )}
              <div className="flex flex-col">
                <Card className="p-0 hover:bg-opacity-100">
                  <div className="p-4 pb-0">
                    <Heading level="h4">Statistics</Heading>
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="child:border-accent-stroke child:border-b-[0.0125rem] child:p-4">
                        <th>Name</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.memberAttributes.map((memberAttribute) => (
                        <tr key={memberAttribute.id} className="child:p-4">
                          <td>
                            <p>{memberAttribute.orgMember.user.name}</p>
                            <p className="font-normal opacity-75">
                              {memberAttribute.orgMember.user.email}
                            </p>
                          </td>
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
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
};
