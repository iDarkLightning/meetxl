import { ContentWrapper } from "@/shared-components/layout/content-wrapper";
import { SectionHeading } from "@/shared-components/layout/section-heading";
import { Button } from "@/shared-components/system/button";
import { AnimateWrapper } from "@/shared-components/util/animate-wrapper";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { EmptyContent } from "@/shared-components/util/empty-content";
import { QRCode } from "@/shared-components/util/qr-code";
import { CustomNextPage } from "@/types/next-page";
import { CodeDisplay } from "@/ui/meetings/attendance/code-display";
import { RedeemLayout } from "@/ui/meetings/attendance/redeem-layout";
import { orgTabs, useOrg } from "@/ui/org/org-shell";
import { RedeemCard } from "@/ui/org/redeem-card";
import { trpc } from "@/utils/trpc";
import { motion, useAnimationControls } from "framer-motion";
import { useRouter } from "next/router";
import { FaChevronLeft, FaTrash } from "react-icons/fa";

const MemberView: React.FC = () => {
  const org = useOrg();
  const router = useRouter();
  const link = trpc.organization.attribute.links.getPersonal.useQuery({
    attributeName: router.query.name as string,
    code: router.query.code as string,
    orgId: org.id,
  });
  const apply = trpc.organization.attribute.links.apply.useMutation();
  const ctx = trpc.useContext();
  const controls = useAnimationControls();

  return (
    <ContentWrapper className="h-screen">
      <BaseQueryCell
        query={link}
        success={({ data }) => {
          const redeemed = data.redeemedBy.length > 0;

          return (
            <div className="flex h-full flex-col items-center justify-center gap-16">
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col gap-4">
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <SectionHeading
                      heading="Attendance Link"
                      sub={`Code: ${data.code} Action: ${data.action} Value: ${data.value}`}
                    />
                  </motion.div>
                  <CodeDisplay code={data.code} />
                  {!redeemed && (
                    <motion.div animate={controls}>
                      <div className="flex gap-2">
                        <Button
                          size="md"
                          className="w-min"
                          variant="primary"
                          onClick={() =>
                            apply
                              .mutateAsync({
                                orgId: org.id,
                                code: data.code,
                                attributeName: data.organizationAttributeName,
                              })
                              .then(() =>
                                ctx.organization.attribute.links.getPersonal.invalidate()
                              )
                              .catch(() => 0)
                          }
                        >
                          Redeem
                        </Button>
                        <Button size="md" href={`/${org.slug}/attributes`}>
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
                {redeemed && (
                  <motion.div
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    className="flex flex-col gap-2"
                  >
                    <p className="text-green-300 lg:text-lg">{`You redeemed this link on ${data.redeemedBy[0]?.redeemedAt.toLocaleString()}`}</p>
                    <Button
                      variant="ghost"
                      className="w-min"
                      icon={<FaChevronLeft size="0.75rem" />}
                      href={`/${org.slug}/attributes`}
                    >
                      Return to Overview
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          );
        }}
      />
    </ContentWrapper>
  );
};

const AdminView: React.FC = () => {
  const router = useRouter();
  const org = useOrg();
  const link = trpc.organization.attribute.links.getDetailed.useQuery(
    {
      attributeName: router.query.name as string,
      code: router.query.code as string,
      orgId: org.id,
    },
    {
      refetchInterval: 15 * 1000,
    }
  );
  const deleteLink = trpc.organization.attribute.links.delete.useMutation();

  return (
    <div className="flex flex-col gap-4">
      <BaseQueryCell
        query={link}
        success={({ data }) => (
          <>
            <div className="flex items-center justify-between gap-4">
              <SectionHeading
                heading="Attribute Link"
                sub={`Code: ${data.code} Action: ${data.action} Value: ${data.value}`}
              />
              <div className="flex items-center gap-4">
                <Button
                  variant="danger"
                  icon={<FaTrash />}
                  onClick={() =>
                    deleteLink
                      .mutateAsync({ linkId: data.id, orgId: org.id })
                      .then(() =>
                        router.push(
                          `/${org.slug}/attributes/${router.query.name}`
                        )
                      )
                      .catch(() => 0)
                  }
                >
                  Delete
                </Button>
                <QRCode />
              </div>
            </div>
            {data.redeemedBy.length === 0 && (
              <EmptyContent
                heading="No one has redeemed this link"
                sub="Share this link with others and monitor uses here"
              />
            )}
            {data.redeemedBy.length > 0 && (
              <AnimateWrapper>
                {data.redeemedBy.map((redeemed) => (
                  <RedeemCard
                    key={redeemed.memberUserId}
                    redeemedAt={redeemed.redeemedAt}
                    user={redeemed.member.user}
                  />
                ))}
              </AnimateWrapper>
            )}
          </>
        )}
      />
    </div>
  );
};

const AttributeLinkRedeem: CustomNextPage = () => {
  const org = useOrg();

  if (org.member.role === "ADMIN") return <AdminView />;

  return <MemberView />;
};

AttributeLinkRedeem.auth = true;

AttributeLinkRedeem.getLayout = (page) => (
  <RedeemLayout tabs={orgTabs}>{page}</RedeemLayout>
);

export default AttributeLinkRedeem;
