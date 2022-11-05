import { AnimateWrapper } from "@/shared-components/util/animate-wrapper";
import { CustomNextPage } from "@/types/next-page";
import { AttributeDetails } from "@/ui/attributes/attribute-details";
import { AttributeShell } from "@/ui/attributes/attribute-shell";
import { OrgShell } from "@/ui/org/org-shell";
import { useRouter } from "next/router";

const AttributeDetailPage: CustomNextPage = () => {
  const router = useRouter();

  return <AttributeDetails name={router.query.name as string} />;
};

AttributeDetailPage.auth = true;

AttributeDetailPage.getLayout = (page) => (
  <OrgShell>
    <AttributeShell>{page}</AttributeShell>
  </OrgShell>
);

export default AttributeDetailPage;
