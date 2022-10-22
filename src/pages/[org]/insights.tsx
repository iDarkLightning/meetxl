import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { CustomNextPage } from "@/types/next-page";
import { OrgShell, useOrg } from "@/ui/org/org-shell";
import { trpc } from "@/utils/trpc";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const OrgInsights: CustomNextPage = () => {
  const org = useOrg();
  const insights = trpc.organization.getInsights.useQuery({
    orgId: org.id,
  });

  return (
    <SectionWrapper>
      <SectionHeading
        heading="Insights"
        sub="View insights for your meetings"
      />
      <BaseQueryCell
        query={insights}
        success={({ data }) => (
          <>
            <Card className="hover:bg-opacity-100">
              <Heading level="h4">Information</Heading>
              <div className="flex justify-evenly">
                <p className="flex flex-col items-center">
                  <span className="text-4xl font-bold text-green-400">
                    {data.counts._count.members}
                  </span>{" "}
                  <span className="text-sm opacity-75">
                    Member
                    {data.counts._count.members === 1 ? "" : "s"}
                  </span>
                </p>
                <p className="flex flex-col items-center">
                  <span className="text-4xl font-bold text-pink-400">
                    {data.counts._count.joinCodes}
                  </span>{" "}
                  <span className="text-sm opacity-75">
                    Join Code
                    {data.counts._count.joinCodes === 1 ? "" : "s"}
                  </span>
                </p>
                <p className="flex flex-col items-center">
                  <span className="text-4xl font-bold text-amber-400">
                    {data.counts._count.attributes}
                  </span>{" "}
                  <span className="text-sm opacity-75">
                    Attribute
                    {data.counts._count.attributes === 1 ? "" : "s"}
                  </span>
                </p>
              </div>
            </Card>
            <Card className="hover:bg-opacity-100">
              <Heading level="h4">Meeting Attendance</Heading>
              <p className="text-sm opacity-75">
                Attendance for your last 5 meetings
              </p>
              <div>
                <Bar
                  options={{
                    indexAxis: "y",
                    maintainAspectRatio: false,
                    responsive: true,
                  }}
                  data={{
                    labels: data.meetings.map((item) => item.name),
                    datasets: [
                      {
                        data: data.meetings.map(
                          (item) => item.participants.length
                        ),
                        backgroundColor: "rgba(187, 113, 238, 0.5)",
                      },
                    ],
                  }}
                />
              </div>
            </Card>
          </>
        )}
      />
    </SectionWrapper>
  );
};

OrgInsights.auth = true;

OrgInsights.getLayout = (page) => <OrgShell>{page}</OrgShell>;

export default OrgInsights;
