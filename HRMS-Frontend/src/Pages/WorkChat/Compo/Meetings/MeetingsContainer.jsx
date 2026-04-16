import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Context/Authcontext";

import MeetingForm from "./MeetingForm";
import MeetingCalendar from "./MeetingCalendar";

import { fetchMyMeetings } from "../../../../api/meetingApi";
import { fetchChatUsers } from "../../../../api/chatUsersApi";

export default function MeetingsContainer({ onClose }) {
  const { user } = useContext(AuthContext);

  const [meetings, setMeetings] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  /* -----------------------------
     LOAD MEETINGS
  ------------------------------ */
  useEffect(() => {
    if (!user?.email || !user?.token) return;

    fetchMyMeetings(user.email, user.token)
      .then((data) => {
        console.log('📅 Meetings loaded:', data);
        setMeetings(data);
      })
      .catch((err) => {
        console.error("Fetch meetings failed", err);
        setMeetings([]);
      });
  }, [user]);

  /* -----------------------------
     LOAD USERS (FOR AUTOSUGGEST)
  ------------------------------ */
  useEffect(() => {
    if (!user?.token) return;

    fetchChatUsers(user.token)
      .then(setUsers)
      .catch((err) => {
        console.error("Fetch users failed", err);
        setUsers([]);
      });
  }, [user]);

  /* -----------------------------
     15 MIN NOTIFICATION
  ------------------------------ */
  useEffect(() => {
    const timer = setInterval(() => {
      meetings.forEach((m) => {
        const diff = new Date(m.startTime) - new Date();
        if (diff < 15 * 60 * 1000 && diff > 14 * 60 * 1000) {
          alert(`Meeting "${m.title}" starts in 15 minutes`);
        }
      });
    }, 60000);

    return () => clearInterval(timer);
  }, [meetings]);

  /* -----------------------------
     CALENDAR HANDLERS
  ------------------------------ */
  const handleDateSelect = (date) => {
    const start = new Date(date);
    start.setHours(10, 0, 0, 0);

    const end = new Date(start);
    end.setHours(11, 0, 0, 0);

    setSelectedMeeting({
      startTime: start.toISOString(),
      endTime: end.toISOString()
    });

    setShowForm(true);
  };

  const handleEventEdit = (meeting) => {
    // Check if the meeting has already ended
    const now = new Date();
    const meetingEndTime = new Date(meeting.endTime);
    
    if (meetingEndTime < now) {
      alert('Cannot edit a meeting that has already ended.');
      return;
    }
    
    setSelectedMeeting(meeting);
    setShowForm(true);
  };

  return (
    <div className="wc-meetings">
      {/* HEADER */}
      <div className="wc-meetings-header">
        <h3>Meetings</h3>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="btn-primary"
            onClick={() => {
              setSelectedMeeting(null);
              setShowForm(true);
            }}
          >
            + Schedule Meeting
          </button>

          <button onClick={onClose}>✕</button>
        </div>
      </div>

      {/* CALENDAR */}
      <MeetingCalendar 
        key={meetings.length + meetings.map(m => m.status).join('')} // Force re-render when meetings change
        meetings={meetings} 
        onSelect={handleDateSelect}
        onEdit={handleEventEdit}
      />

      {/* MODAL */}
      {showForm && (
        <MeetingForm
          meeting={selectedMeeting}
          token={user.token}      // ✅ EXPLICIT
          users={users}           // ✅ FOR AUTOSUGGEST
          onClose={() => setShowForm(false)}
          onSaved={(m) => {
            console.log('📅 Meeting saved/updated:', m);
            
            // Always refresh the meetings list after saving
            if (user?.email && user?.token) {
              console.log('📅 Refreshing meetings list...');
              fetchMyMeetings(user.email, user.token)
                .then((data) => {
                  console.log('📅 Meetings refreshed:', data);
                  setMeetings(data);
                })
                .catch((err) => {
                  console.error("Failed to refresh meetings", err);
                });
            }
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}