import UserSelectModal from "./UserSelectModal";
import CalendarModal from "./CalendarModal";
import { useState } from "react";

export default function RightPanel() {
  const [showUsers, setShowUsers] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="wc-right">
      <button onClick={() => setShowUsers(true)}>➕ New Chat</button>
      <button onClick={() => setShowCalendar(true)}>📅 Meeting</button>

      {showUsers && <UserSelectModal onClose={() => setShowUsers(false)} />}
      {showCalendar && (
        <CalendarModal onClose={() => setShowCalendar(false)} />
      )}
    </div>
  );
}
