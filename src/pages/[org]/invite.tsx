import { SectionHeading } from "@/shared-components/layout/section-heading";
import { CustomNextPage } from "@/types/next-page";
import { JoinCodeInvite } from "@/ui/org/invites/join-code";
import { OrgShell } from "@/ui/org/org-shell";

const OrgInvites: CustomNextPage = () => {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        heading="Invite Members"
        sub="Manage invites for your organization"
      />
      <JoinCodeInvite />
    </section>
  );
};

OrgInvites.auth = true;

OrgInvites.getLayout = (page) => <OrgShell>{page}</OrgShell>;

export default OrgInvites;
