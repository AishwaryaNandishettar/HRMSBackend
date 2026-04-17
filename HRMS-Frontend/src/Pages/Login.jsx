import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/Authcontext";
import logo from "../assets/Background less.png";
import "./Login.css";
import api from "../api/axios";

export const login = (data) => {
  return api.post("/api/auth/login", data);
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isForgot, setIsForgot] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  

  /* ================= LOGIN USING BACKEND ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Debug logging
    console.log('🔍 Environment check:');
    console.log('  VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
    console.log('  Full URL will be:', `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      
      if (!apiUrl) {
        console.error('❌ VITE_API_BASE_URL is not defined!');
        setError("Configuration error: API URL not set. Please contact administrator.");
        return;
      }

      console.log('📤 Sending login request to:', `${apiUrl}/api/auth/login`);

      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log('📥 Response status:', res.status);

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }
const data = await res.json();  

console.log("🔥 LOGIN RESPONSE:", data); // Debug

// if using context - PASS ALL DATA TO LOGIN
login({
  name: data.name,
  email: data.email,
  role: data.role,
  token: data.token,
  empId: data.empId || data.employeeId, // ✅ PASS empId
  employeeId: data.employeeId || data.empId, // ✅ PASS employeeId
});

console.log("✅ LOGIN SUCCESSFUL - Redirecting to Home");

navigate("/Home");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };
 
  
  /* ================= FORGOT PASSWORD (UI ONLY – SAME AS BEFORE) ================= */
  const handleForgotPassword = () => {
    setIsForgot(true);
    setError("");
  };

  const sendOtp = (e) => {
    e.preventDefault();
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setOtp(generatedOtp);
    setOtpSent(true);
    alert(`✅ OTP sent to ${email}: ${generatedOtp}`);
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    if (enteredOtp === otp) {
      alert("OTP verified! You can now set a new password.");
      setOtpSent(false);
      setOtp("");
      setEnteredOtp("");
    } else {
      setError("Incorrect OTP. Try again.");
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    alert(`✅ Password reset successful for ${email}`);
    setIsForgot(false);
    setOtp("");
    setOtpSent(false);
    setEnteredOtp("");
    setNewPassword("");
  };

  return (
    <div className="login-page">
      <div className="login-overlay">
        <form
          className="login-form"
          onSubmit={isForgot ? (otpSent ? verifyOtp : sendOtp) : handleLogin}
        >
          <div className="header-section">
            <div className="logo-wrapper">
              <img src={logo} alt="Company Logo" className="logo-logo" />
            </div>
            <h1 className="app-title">Omoi HR Works</h1>
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* ---------- NORMAL LOGIN FORM ---------- */}
          {!isForgot && (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>

              <p className="forgot-link" onClick={handleForgotPassword}>
                Forgot Password?
              </p>
            </>
          )}

          {/* ---------- FORGOT PASSWORD FORM ---------- */}
          {isForgot && !otpSent && (
            <>
              <h3 className="reset-title">Forgot Password</h3>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Send OTP</button>
              <p className="back-link" onClick={() => setIsForgot(false)}>
                ← Back to Login
              </p>
            </>
          )}

          {/* ---------- OTP VERIFICATION ---------- */}
          {isForgot && otpSent && (
            <>
              <h3 className="reset-title">Enter OTP</h3>
              <input
                type="text"
                placeholder="Enter 4-digit OTP"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                required
              />
              <button type="submit">Verify OTP</button>
              <p className="back-link" onClick={() => setIsForgot(false)}>
                ← Cancel
              </p>

              {enteredOtp === otp && (
                <>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button onClick={handleResetPassword}>
                    Reset Password
                  </button>
                </>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
