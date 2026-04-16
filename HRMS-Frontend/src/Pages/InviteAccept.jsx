import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function InviteAccept() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // 1️⃣ Get token from URL + validate
  useEffect(() => {
     console.log("🔥 InviteAccept PAGE LOADED");
    const params = new URLSearchParams(location.search);
    const t = params.get("token");

    setToken(t);

    if (!t) {
      alert("Invalid invite link");
      return;
    }

    // fetch email using token
    const fetchData = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://trowel-eldercare-scouting.ngrok-free.dev';
        const res = await axios.get(
          `${apiBase}/api/invite/onboarding?token=${t}`
        );

        setEmail(res.data.email);
      } catch (err) {
        alert("Invite link expired or invalid");
      }
    };

    fetchData();
  }, [location.search]);

  // 2️⃣ Submit password
  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/onboarding/accept-invite`, {
        token,
        email,
        otp,
        password,
      });

      alert("Account created successfully 🎉");

      // redirect to login
      navigate("/");
    } catch (err) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Complete Your HRMS Registration</h2>

        <input
          style={styles.input}
          value={email}
          disabled
          placeholder="Email"
        />

<input
  style={styles.input}
  placeholder="Enter OTP"
  value={otp}
  onChange={(e) => setOtp(e.target.value)}
/>
        <input
          style={styles.input}
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />


        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f4f6f8",
  },
  card: {
    padding: "30px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "350px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};