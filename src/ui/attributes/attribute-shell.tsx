import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Button } from "@/shared-components/system/button";
import { transitionClasses } from "@/shared-components/system/transition";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { trpc } from "@/utils/trpc";
import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { FaCheck, FaChevronDown, FaPlus } from "react-icons/fa";
import { useOrg } from "../org/org-shell";
import { NewAttributeModal } from "./new-attribute";

const AdminView: React.FC<React.PropsWithChildren> = (props) => {
  const org = useOrg();
  const attributes = trpc.organization.attribute.list.useQuery({
    orgId: org.id,
  });
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SectionWrapper>
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <SectionHeading
          heading="Attributes"
          sub="Manage organization level attributes"
        />
        <BaseQueryCell
          query={attributes}
          success={({ data }) => (
            <>
              {data.length > 0 && (
                <>
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button
                      as={Button}
                      size="sm"
                      icon={<FaChevronDown size="0.75rem" />}
                      className="w-full flex-row-reverse gap-3 md:w-min"
                    >
                      {data.find((a) => a.name === router.query.name)?.name}
                    </Menu.Button>
                    <Transition as={Fragment} {...transitionClasses}>
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-64 divide-y divide-red-400 rounded-md border-[0.0125rem] border-accent-stroke bg-background-secondary">
                        <div className="flex flex-col gap-2 p-2">
                          {data.map((attribute) => (
                            <Menu.Item key={attribute.name}>
                              {({ active }) => (
                                <Button
                                  icon={
                                    attribute.name === router.query.name ? (
                                      <FaCheck />
                                    ) : (
                                      <Fragment />
                                    )
                                  }
                                  href={`/${org.slug}/attributes/${attribute.name}`}
                                  variant="unstyled"
                                  className={clsx(
                                    "w-full flex-row-reverse justify-between",
                                    active ||
                                      (attribute.name === router.query.name &&
                                        "group bg-accent-secondary")
                                  )}
                                >
                                  {attribute.name}
                                </Button>
                              )}
                            </Menu.Item>
                          ))}
                          <hr className="mx-4 border-accent-stroke" />
                          <Menu.Item>
                            {({ active }) => (
                              <Button
                                icon={<FaPlus size="0.75rem" />}
                                variant="unstyled"
                                onClick={() => setIsOpen(true)}
                                className={clsx(
                                  "mt-2 w-full",
                                  active && "group bg-accent-secondary"
                                )}
                              >
                                New Attribute
                              </Button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                  <NewAttributeModal isOpen={isOpen} setIsOpen={setIsOpen} />
                </>
              )}
            </>
          )}
        />
      </div>
      {props.children}
    </SectionWrapper>
  );
};

export const AttributeShell: React.FC<React.PropsWithChildren> = (props) => {
  const org = useOrg();

  if (org.member.role === "MEMBER") return <>{props.children}</>;

  return <AdminView {...props} />;
};
