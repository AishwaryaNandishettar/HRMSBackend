import { useEffect, useState } from "react";
import { fetchChatUsers } from "../../../api/chatUsersApi";
import { createMeeting } from "../../../api/meetingApi";

export default function CalendarModal({ token, loggedInEmail, onClose }) {
  const [title, setTitle] = useState("");
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    fetchChatUsers(token).then(setUsers);
  }, [token]);

  const toggleMember = (email) => {
    setMembers((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  const create = async () => {
    if (!title || !start || !end || members.length === 0) {
      alert("Fill all fields");
      return;
    }

    await createMeeting(
      {
        title,
        participantEmails: [...members, loggedInEmail],
        createdByEmail: loggedInEmail,
        startTime: start,
        endTime: end,
      },
      token
    );

    onClose();
  };

  return (
    <div className="wc-modal-backdrop">
      <div className="wc-modal">
        <h3>Schedule Meeting</h3>

        <input
          placeholder="Meeting title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Start time</label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        <label>End time</label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />

        <div className="wc-modal-users">
          {users.map((u) => (
            <label key={u.email}>
              <input
                type="checkbox"
                onChange={() => toggleMember(u.email)}
              />
              {u.name}
            </label>
          ))}
        </div>

        <div className="wc-modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={create}>Create</button>
        </div>
      </div>
    </div>
  );
}