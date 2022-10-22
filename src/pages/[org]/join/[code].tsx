import { ContentWrapper } from "@/shared-components/layout/content-wrapper";
import { SectionHeading } from "@/shared-components/layout/section-heading";
import { Button } from "@/shared-components/system/button";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { CustomNextPage } from "@/types/next-page";
import { CodeDisplay } from "@/ui/meetings/attendance/code-display";
import { trpc } from "@/utils/trpc";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const OrgJoinPage: CustomNextPage = () => {
  const router = useRouter();
  const codeQuery = trpc.organization.joinCode.get.useQuery({
    code: router.query.code as string,
  });
  const join = trpc.organization.joinCode.accept.useMutation({
    onSuccess(data) {
      router.push(`/${data.slug}`);
    },
  });

  return (
    <ContentWrapper className="h-screen">
      <BaseQueryCell
        query={codeQuery}
        success={({ data }) => (
          <div className="flex h-full flex-col items-center justify-center gap-16">
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col gap-4">
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <SectionHeading
                    heading="Attendance Link"
                    sub={`Join ${data.organization.name} with code ${data.code}`}
                  />
                </motion.div>
                <CodeDisplay code={data.code} />
                <motion.div>
                  <div className="flex gap-2">
                    <Button
                      size="md"
                      className="w-min"
                      variant="primary"
                      onClick={() => {
                        join.mutateAsync({ code: data.code });
                      }}
                    >
                      Redeem
                    </Button>
                    <Button size="md" href={`/dashboard`}>
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      />
    </ContentWrapper>
  );
};

OrgJoinPage.auth = true;

export default OrgJoinPage;
