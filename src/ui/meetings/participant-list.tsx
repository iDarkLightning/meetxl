import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { trpc } from "@/utils/trpc";
import dayjs from "dayjs";
import { useMeeting } from "./meeting-shell";

const formatDate = (data: Date | null) => {
  const date = dayjs(data);
  const now = dayjs();

  if (date.isSame(now, "day")) {
    return date.format("h:mm A");
  }

  return date.format("DD/MM/YYYY");
};

export const ParticipantList: React.FC = () => {
  const meeting = useMeeting();
  const participantsQuery = trpc.meeting.participant.list.useQuery({
    meetingId: meeting.id,
    orgId: meeting.organizationSlug,
  });

  return (
    <div className="overflow-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bordered whitespace-nowrap bg-background-secondary">
            <th>Name</th>
            <th>Code</th>
            <th>Status</th>
            {meeting.requireCheckIn && <th>Check In</th>}
            {meeting.requireCheckOut && <th>Check Out</th>}
          </tr>
        </thead>
        <tbody className="">
          <BaseQueryCell
            query={participantsQuery}
            success={({ data }) => (
              <>
                {data.map((p) => (
                  <tr key={p.memberUserId} className="whitespace-nowrap">
                    <td>
                      <p>{p.member.user.name}</p>
                      <p className="font-normal opacity-75">
                        {p.member.user.email}
                      </p>
                    </td>
                    <td className="font-mono">{p.code}</td>
                    <td>{p.status}</td>
                    {meeting.requireCheckIn && (
                      <td>{p.checkedIn ? formatDate(p.checkInTime) : "-"}</td>
                    )}
                    {meeting.requireCheckOut && (
                      <td>{p.checkedOut ? formatDate(p.checkOutTime) : "-"}</td>
                    )}
                  </tr>
                ))}
              </>
            )}
          />
        </tbody>
      </table>
    </div>
  );
};
