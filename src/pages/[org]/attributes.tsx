import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { CustomNextPage } from "@/types/next-page";
import { OrgShell } from "@/ui/org/org-shell";

const OrgAttributes: CustomNextPage = () => {
  return (
    <SectionWrapper>
      <SectionHeading
        heading="Attributes"
        sub="Manage organization level attributes"
      />
    </SectionWrapper>
  );
};

OrgAttributes.auth = true;

OrgAttributes.getLayout = (page) => <OrgShell>{page}</OrgShell>;

export default OrgAttributes;
