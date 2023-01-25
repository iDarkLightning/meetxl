import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { CustomNextPage } from "@/types/next-page";
import { JoinCodeInvite } from "@/ui/org/invites/join-code";
import { OrgShell } from "@/ui/org/org-shell";

const OrgInvites: CustomNextPage = () => {
  return (
    <SectionWrapper>
      <SectionHeading
        heading="Invite Members"
        sub="Manage invites for your organization"
      />
      <JoinCodeInvite />
    </SectionWrapper>
  );
};

OrgInvites.auth = true;

OrgInvites.getLayout = (page) => <OrgShell>{page}</OrgShell>;

export default OrgInvites;
