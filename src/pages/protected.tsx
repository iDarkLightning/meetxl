import { CustomNextPage } from "@/types/next-page";

const Protected: CustomNextPage = () => {
  return <>you logged in!</>;
};

Protected.auth = true;

export default Protected;
