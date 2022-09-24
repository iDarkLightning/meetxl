import { Heading } from "@/shared-components/system/heading";
import { CustomNextPage } from "@/types/next-page";
import { JoinCodeInvite } from "@/ui/org/invites/join-code";
import { OrgShell, useOrg } from "@/ui/org/org-shell";

const OrgInvites: CustomNextPage = () => {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <Heading level="h4">Invite Members</Heading>
        <p className="opacity-75">Manage invites for your oganization</p>
      </div>
      <JoinCodeInvite />
    </section>
  );
};

OrgInvites.auth = true;

OrgInvites.getLayout = (page) => <OrgShell>{page}</OrgShell>;

export default OrgInvites;
