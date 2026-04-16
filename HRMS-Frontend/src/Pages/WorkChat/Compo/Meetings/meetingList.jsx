export default function MeetingList({ meetings, onEdit }) {

  const link = (id) =>
    `${window.location.origin}/join-meeting/${id}`;

  return (
    <div className="wc-meeting-list">
      {meetings.map((m) => (
        <div key={m.id} className="wc-meeting-row">

          <div>
            <strong>{m.title}</strong>

            <div className="muted">
              {new Date(m.startTime).toLocaleString()} - {new Date(m.endTime).toLocaleString()}
            </div>

            {/* 👤 AVATARS */}
            <div className="avatars">
              {m.participantEmails?.slice(0, 3).map((e) => (
                <div key={e} className="avatar">
                  {e[0].toUpperCase()}
                </div>
              ))}
            </div>

            {/* LINK */}
            <div className="meeting-link">
              <input value={link(m.id)} readOnly />
              <button
                onClick={() => navigator.clipboard.writeText(link(m.id))}
              >
                Copy
              </button>
            </div>
          </div>

          <button className="btn primary" onClick={() => onEdit(m)}>
            Edit
          </button>
        </div>
      ))}
    </div>
  );
}