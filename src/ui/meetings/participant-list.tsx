import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { trpc } from "@/utils/trpc";
import { useMeeting } from "./meeting-shell";

export const ParticipantList: React.FC<{
  showCheckIn?: boolean;
  showCheckOut?: boolean;
}> = ({ showCheckIn = false, showCheckOut = false }) => {
  const meeting = useMeeting();
  const participantsQuery = trpc.meeting.participant.list.useQuery({
    meetingId: meeting.id,
    orgId: meeting.organizationSlug,
  });

  return (
    <div className="overflow-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="rounded-md border-[0.025rem] border-accent-stroke bg-background-secondary">
            <th>Name</th>
            <th>Email</th>
            <th>Confirmation Code</th>
            <th>Status</th>
            {meeting.requireCheckIn && showCheckIn && <th>Checked In Time</th>}
            {meeting.requireCheckOut && showCheckOut && (
              <th>Checked Out Time</th>
            )}
          </tr>
        </thead>
        <tbody>
          <BaseQueryCell
            query={participantsQuery}
            success={({ data }) => (
              <>
                {data.map((p) => (
                  <tr
                    key={p.memberUserId}
                    className="whitespace-nowrap transition-colors hover:bg-accent-secondary"
                  >
                    <td>{p.member.user.name}</td>
                    <td>{p.member.user.email}</td>
                    <td>{p.code}</td>
                    <td>{p.status}</td>
                    {meeting.requireCheckIn && showCheckIn && (
                      <td>
                        {p.checkedIn
                          ? p.checkInTime?.toLocaleDateString()
                          : "Not Checked In"}
                      </td>
                    )}
                    {meeting.requireCheckOut && showCheckOut && (
                      <td>
                        {p.checkedOut
                          ? p.checkOutTime?.toLocaleDateString()
                          : "Not Checked Out"}
                      </td>
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
