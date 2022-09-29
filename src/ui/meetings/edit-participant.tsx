import { Button } from "@/shared-components/system/button";
import { DialogWrapper } from "@/shared-components/system/dialog";
import { Heading } from "@/shared-components/system/heading";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { trpc } from "@/utils/trpc";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useOrg } from "../org/org-shell";
import { useMeeting } from "./meeting-shell";

export const EditParticipantsModal: React.FC = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const org = useOrg();
  const meeting = useMeeting();
  const membersQuery = trpc.meeting.participant.getRoster.useQuery({
    orgId: org.id,
    meetingId: meeting.id,
  });
  const [buffer, updateBuffer] = useState<string[]>([]);
  const ctx = trpc.useContext();
  const saveList = trpc.meeting.participant.update.useMutation();

  return (
    <>
      <Button icon={<FaPlus size="0.75rem" />} onClick={() => setIsOpen(true)}>
        Edit Participants
      </Button>
      <DialogWrapper
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <Dialog.Title as={Heading} level="h3">
          Edit Participants
        </Dialog.Title>
        <div className="mt-3 w-96">
          <BaseQueryCell
            query={membersQuery}
            success={({ data }) => (
              <>
                {data.map((member) => (
                  <div
                    className="flex items-center gap-4 p-2"
                    key={member.userId}
                  >
                    <input
                      type="checkbox"
                      defaultChecked={member.meetings.length > 0}
                      onChange={(evt) => {
                        if (buffer.includes(member.userId))
                          return updateBuffer((buffer) =>
                            buffer.filter((id) => id !== member.userId)
                          );

                        return updateBuffer((buffer) => [
                          ...buffer,
                          member.userId,
                        ]);
                      }}
                    />
                    <div>
                      <p>{member.user.name}</p>
                      <p className="opacity-75">{member.user.email}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          />
          <Button
            className="mt-2"
            onClick={() =>
              saveList
                .mutateAsync({
                  meetingId: meeting.id,
                  members: buffer,
                  orgId: org.id,
                })
                .then(() => setIsOpen(false))
                .then(() => ctx.meeting.participant.list.invalidate())
                .then(() => ctx.meeting.participant.getRoster.invalidate())
                .then(() => updateBuffer([]))
            }
          >
            Save
          </Button>
        </div>
      </DialogWrapper>
    </>
  );
};
