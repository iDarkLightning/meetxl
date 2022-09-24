import { ContentWrapper } from "@/shared-components/layout/content-wrapper";
import { CustomNextPage } from "@/types/next-page";

const Dashboard: CustomNextPage = () => {
  return <ContentWrapper>you logged in!</ContentWrapper>;
};

Dashboard.auth = true;

export default Dashboard;
