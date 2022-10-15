import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { CustomNextPage } from "@/types/next-page";
import { NewAttributeModal } from "@/ui/attributes/new-attribute";
import { OrgShell, useOrg } from "@/ui/org/org-shell";
import { trpc } from "@/utils/trpc";

const OrgAttributes: CustomNextPage = () => {
  const org = useOrg();
  const attributes = trpc.organization.attribute.list.useQuery({
    orgId: org.id,
  });

  return (
    <SectionWrapper>
      <div className="flex items-center justify-between">
        <SectionHeading
          heading="Attributes"
          sub="Manage organization level attributes"
        />
        <NewAttributeModal />
      </div>

      <BaseQueryCell
        query={attributes}
        success={({ data }) => (
          <div>
            {data.map((item) => (
              <p key={`${item.name}-${item.organizationId}`}>{item.name}</p>
            ))}
          </div>
        )}
      />
    </SectionWrapper>
  );
};

OrgAttributes.auth = true;

OrgAttributes.getLayout = (page) => <OrgShell>{page}</OrgShell>;

export default OrgAttributes;
