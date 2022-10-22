import { Avatar } from "@/shared-components/system/avatar";
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { Select } from "@/shared-components/system/select";
import { AnimateWrapper } from "@/shared-components/util/animate-wrapper";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { getAvatarFallback } from "@/utils/get-avatar-fallback";
import { trpc } from "@/utils/trpc";
import { MemberRole } from "@prisma/client";
import { FaCopy, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useOrg } from "../org-shell";

export const JoinCodeInvite = () => {
  const org = useOrg();
  const createCode = trpc.organization.joinCode.create.useMutation();
  const joinCodesQuery = trpc.organization.joinCode.list.useQuery({
    orgId: org.id,
  });
  const changeCodeRole = trpc.organization.joinCode.changeRole.useMutation();
  const revokeCode = trpc.organization.joinCode.revoke.useMutation();

  return (
    <Card>
      <div className="flex items-center justify-between">
        <Heading level="h4">Join Code</Heading>
        <Button
          loading={createCode.isLoading}
          className="h-10"
          icon={<FaPlus />}
          onClick={() => {
            createCode
              .mutateAsync({ orgId: org.id })
              .then(() => joinCodesQuery.refetch())
              .catch(() => 0);
          }}
        >
          New
        </Button>
      </div>
      <BaseQueryCell
        query={joinCodesQuery}
        success={({ data }) => (
          <div className="mt-4 flex flex-col gap-4">
            {data.length === 0 && (
              <div className="py-4 text-center opacity-75">
                <Heading level="h4">
                  This organization currently has no join codes
                </Heading>
                <p>Create a join code using the button above</p>
              </div>
            )}
            <AnimateWrapper className="flex flex-col gap-4">
              {data.length > 0 &&
                data.map((code) => (
                  <div
                    key={code.id}
                    className="flex items-center justify-between gap-4 border-b-[0.025rem] border-accent-stroke pb-2"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar
                        imageProps={{ src: code.issuer.user.image as string }}
                        fallbackProps={{
                          children: getAvatarFallback(code.issuer.user.name),
                        }}
                      />
                      <div>
                        <p
                          onClick={() => {
                            navigator.clipboard.writeText(code.code);

                            toast.success("Copied to clipboard");
                          }}
                          className="cursor-pointer"
                        >
                          {code.code}
                        </p>
                        <p className="opacity-80">
                          {code.uses} Use{code.uses === 0 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Select
                        defaultValue={code.role}
                        onChange={(evt) => {
                          changeCodeRole
                            .mutateAsync({
                              id: code.id,
                              role: evt.target.value as MemberRole,
                              orgId: org.id,
                            })
                            .catch(() => 0);
                        }}
                      >
                        <option value={MemberRole.ADMIN}>Admin</option>
                        <option value={MemberRole.MEMBER}>Member</option>
                      </Select>
                      <Button
                        icon={<FaCopy />}
                        onClick={() => {
                          navigator.clipboard.writeText(
                            window.location
                              .toString()
                              .replace(`/${org.slug}/invite`, "") +
                              `/${org.slug}/join/${code.code}`
                          );

                          toast.success("Copied to clipboard");
                        }}
                      >
                        Copy Link
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          revokeCode
                            .mutateAsync({ id: code.id, orgId: org.id })
                            .then(() => joinCodesQuery.refetch())
                            .catch(() => 0)
                        }
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                ))}
            </AnimateWrapper>
          </div>
        )}
      />
    </Card>
  );
};
