import { CustomNextPage } from "@/types/next-page";
import { OrgShell, useOrg } from "@/ui/org/org-shell";

const OrgHome: CustomNextPage = () => {
  const org = useOrg();

  return <div>Org Home: {org.name}</div>;
};

OrgHome.auth = true;

OrgHome.getLayout = (page) => <OrgShell>{page}</OrgShell>;

export default OrgHome;
