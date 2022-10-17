import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Button } from "@/shared-components/system/button";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { EmptyContent } from "@/shared-components/util/empty-content";
import { CustomNextPage } from "@/types/next-page";
import { AttributeShell } from "@/ui/attributes/attribute-shell";
import { NewAttributeModal } from "@/ui/attributes/new-attribute";
import { OrgShell, useOrg } from "@/ui/org/org-shell";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

const AdminView: React.FC = () => {
  const org = useOrg();
  const attributes = trpc.organization.attribute.list.useQuery({
    orgId: org.id,
  });
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (attributes.isSuccess && attributes.data[0]) {
      router.push(`/${org.slug}/attributes/${attributes.data[0].name}`);
    }
  }, [attributes, org, router]);

  return (
    <BaseQueryCell
      query={attributes}
      success={({ data }) => (
        <>
          {data.length === 0 && (
            <EmptyContent
              heading="This organization has no attributes"
              sub="Create a new attribute for this organization"
            >
              <Button
                icon={<FaPlus size="0.7rem" />}
                variant="primary"
                onClick={() => setIsOpen(true)}
              >
                New Attribute
              </Button>
            </EmptyContent>
          )}
          <NewAttributeModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
      )}
    />
  );
};

const MemberView: React.FC = () => {
  const org = useOrg();
  const statistics = trpc.organization.attribute.mine.useQuery({
    orgId: org.id,
  });

  return (
    <SectionWrapper>
      <SectionHeading
        heading="Attributes"
        sub="View your statistics for this organization"
      />
      <BaseQueryCell
        query={statistics}
        success={({ data }) => (
          <table className="w-full text-left">
            <thead>
              <tr className="rounded-md border-[0.025rem] border-accent-stroke bg-background-secondary">
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {data.map((attribute) => (
                <tr key={attribute.id}>
                  <td>{attribute.organizationAttributeName}</td>
                  <td>{attribute.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      />
    </SectionWrapper>
  );
};

const OrgAttributes: CustomNextPage = () => {
  const org = useOrg();

  if (org.member.role === "ADMIN") return <AdminView />;

  return <MemberView />;
};

OrgAttributes.auth = true;

OrgAttributes.getLayout = (page) => (
  <OrgShell>
    <AttributeShell>{page}</AttributeShell>
  </OrgShell>
);

export default OrgAttributes;
