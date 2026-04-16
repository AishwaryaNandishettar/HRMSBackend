import React, { useState } from "react";
import axios from "axios";

export default function InviteEmployee() {
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // ✅ SEND INVITE ONLY
  const sendInviteEmployee = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://trowel-eldercare-scouting.ngrok-free.dev';
      await axios.post(`${apiBase}/api/onboarding/invite`, {
        email,
        fullName: "Test User",
        department: "IT",
        designation: "Developer",
      });

      alert("Invite sent successfully 📩");
      setShowPopup(false);

    } catch (err) {
      console.error(err);
      alert("Failed to send invite");
    }
  };

  return (
    <div>
      <h3>Invite Employee</h3>

      <button onClick={() => setShowPopup(true)}>
        Invite Employee
      </button>

      {showPopup && (
        <div>
          <input
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={sendInviteEmployee}>
            Send Invite Link
          </button>
        </div>
      )}
    </div>
  );
}