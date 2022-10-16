import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { CustomNextPage } from "@/types/next-page";
import { AttributeDetails } from "@/ui/attributes/attribute-details";
import { NewAttributeModal } from "@/ui/attributes/new-attribute";
import { OrgShell, useOrg } from "@/ui/org/org-shell";
import { trpc } from "@/utils/trpc";
import { Tab } from "@headlessui/react";
import clsx from "clsx";

const OrgAttributes: CustomNextPage = () => {
  const org = useOrg();
  const attributes = trpc.organization.attribute.list.useQuery({
    orgId: org.id,
  });

  return (
    <SectionWrapper>
      <div className="flex items-center justify-between">
        <SectionHeading
          heading="Attributes"
          sub="Manage organization level attributes"
        />
        <NewAttributeModal />
      </div>
      <BaseQueryCell
        query={attributes}
        success={({ data }) => (
          <Tab.Group>
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
              <Tab.List className="flex flex-1 flex-col items-start gap-4">
                {data.map((attribute) => (
                  <Tab
                    key={attribute.name}
                    className={({ selected }) =>
                      clsx(
                        "w-full rounded-md p-3 font-medium transition-colors",
                        selected &&
                          "border-[0.0125rem] border-accent-stroke bg-accent-secondary",
                        !selected && "border-2 border-accent-secondary"
                      )
                    }
                  >
                    {attribute.name}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="flex-[6]">
                {data.map((item) => (
                  <Tab.Panel key={item.name}>
                    <AttributeDetails name={item.name} key={item.name} />
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </div>
          </Tab.Group>
        )}
      />
    </SectionWrapper>
  );
};

OrgAttributes.auth = true;

OrgAttributes.getLayout = (page) => <OrgShell>{page}</OrgShell>;

export default OrgAttributes;
